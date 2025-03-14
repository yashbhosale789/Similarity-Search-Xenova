namespace com.pg.genai;

entity Person {
    key ID: Integer;
    name: String(100);
    gender: String(50);
    country: String(100);
    school: String(100);
}

entity PersonEmbedding {
    key ID: Integer;
    embedding: Vector(384) @cds.persistence.skip; // Maps to HANA VECTOR(384), skipped in OData
    person: Association to Person;
}