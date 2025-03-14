using {com.pg.genai as my} from '../db/schema';

service PersonService {
    entity Person as projection on my.Person; // Expose all fields of Person
    
    // Expose PersonEmbedding without the embedding field
    entity PersonEmbedding as projection on my.PersonEmbedding excluding { embedding };

    action initializeEmbeddings() returns { message: String };
    action searchSimilar(query: String) returns array of Person;
}