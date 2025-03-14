const cds = require('@sap/cds');

// Declare embedder globally, initialize later
let embedder;

module.exports = cds.service.impl(async function () {
    const { Person, PersonEmbedding } = this.entities;

    // Initialize the embedder dynamically
    if (!embedder) {
        try {
            const { pipeline } = await import('@xenova/transformers');
            embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('Embedder loaded successfully');
        } catch (error) {
            console.error('Failed to load embedder:', error);
            throw new Error('Embedder initialization failed');
        }
    }

    // Generate embedding from text
    async function generateEmbedding(text) {
        const output = await embedder(text, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);
        console.log('Embedding length:', embedding.length); // Should be 384
        console.log('Embedding sample:', embedding.slice(0, 5)); // First 5 values
        if (!embedding || embedding.length !== 384 || !embedding.every(v => typeof v === 'number' && !isNaN(v))) {
            throw new Error(`Invalid embedding: ${JSON.stringify(embedding)}`);
        }
        const vectorString = `[${embedding.join(',')}]`;
        console.log('Formatted vector for HANA:', vectorString);
        return vectorString;
    }

    // Initialize embeddings from Person data, updating existing or inserting new records
    this.on('initializeEmbeddings', async (req) => {
        try {
            const persons = await cds.run(SELECT.from(Person));
            const db = await cds.connect.to('db');
            let processedCount = 0;

            for (const person of persons) {
                const text = `${person.name} ${person.gender} ${person.country} ${person.school}`;
                const vectorString = await generateEmbedding(text);
                console.log(`Processing ID ${person.ID} with embedding: ${vectorString}`);

                try {
                    // Check if a record with this ID exists
                    const existing = await db.run(`
                        SELECT ID FROM "COM_PG_GENAI_PERSONEMBEDDING" WHERE ID = ?
                    `, [person.ID]);

                    if (existing && existing.length > 0) {
                        // Update only the EMBEDDING field for the existing ID
                        await db.run(`
                            UPDATE "COM_PG_GENAI_PERSONEMBEDDING"
                            SET EMBEDDING = TO_REAL_VECTOR(?)
                            WHERE ID = ?
                        `, [vectorString, person.ID]);
                        console.log(`Updated embedding for existing ID ${person.ID}`);
                    } else {
                        // Insert a new record if no existing ID is found
                        await db.run(`
                            INSERT INTO "COM_PG_GENAI_PERSONEMBEDDING" (ID, EMBEDDING, PERSON_ID)
                            VALUES (?, TO_REAL_VECTOR(?), ?)
                        `, [person.ID, vectorString, person.ID]);
                        console.log(`Inserted new embedding for ID ${person.ID}`);
                    }
                    processedCount++;
                } catch (error) {
                    console.error(`Error processing ID ${person.ID}:`, error);
                    req.error(500, `Error initializing embeddings for ID ${person.ID}: ${error.message}`);
                    return; // Exit early on error to prevent partial processing
                }
            }

            return { message: `Embeddings initialized successfully for ${processedCount} records` };
        } catch (error) {
            req.error(500, `Error initializing embeddings: ${error.message}`);
        }
    });

    // Handle similarity search
    this.on('searchSimilar', async (req) => {
        try {
            const queryText = req.data.query;
            const queryEmbedding = await generateEmbedding(queryText);

            const results = await cds.run(`
                SELECT p.*, 
                       COSINE_SIMILARITY(pe."EMBEDDING", TO_REAL_VECTOR(?)) AS similarity
                FROM "COM_PG_GENAI_PERSON" p
                JOIN "COM_PG_GENAI_PERSONEMBEDDING" pe ON p.ID = pe."PERSON_ID"
                ORDER BY similarity DESC
                LIMIT 5
            `, [queryEmbedding]);

            return results;
        } catch (error) {
            req.error(500, `Search error: ${error.message}`);
        }
    });
});