// // PerosnEmbeddings

// const fs = require('fs');

// // Data pools for realistic values
// const names = ['Emma', 'Liam', 'Sofia', 'Noah', 'Olivia', 'Ethan', 'Isabella', 'James', 'Ava', 'William', 'Mia', 'Lucas', 'Charlotte', 'Alexander', 'Amelia', 'Benjamin', 'Sophia', 'Henry', 'Luna', 'Mason', 'Evelyn', 'Jackson', 'Lily', 'Oliver', 'Harper'];
// const lastNames = ['Johnson', 'Smith', 'Martinez', 'Brown', 'Davis', 'Wilson', 'Garcia', 'Taylor', 'Anderson', 'Lee', 'Gonzalez', 'White', 'Clark', 'Kim', 'Rodriguez', 'Patel', 'Nguyen', 'Walker', 'Perez', 'Thompson', 'Adams', 'Khan', 'Chen', 'Singh', 'Wright'];
// const genders = ['Male', 'Female'];
// const countries = ['United States', 'Canada', 'Spain', 'United Kingdom', 'Australia', 'Mexico', 'Brazil', 'Japan', 'Germany', 'France', 'India', 'South Korea', 'Italy', 'China', 'Argentina', 'Vietnam', 'South Africa', 'Chile', 'Sweden', 'Netherlands', 'Pakistan', 'Singapore', 'Ireland', 'Norway', 'Philippines'];
// const schools = ['Harvard University', 'University of Toronto', 'University of Barcelona', 'University of Oxford', 'University of Sydney', 'MIT', 'UNAM', 'University of Tokyo', 'Technical University of Munich', 'Sorbonne University', 'IIT Bombay', 'Seoul National University', 'University of Bologna', 'Peking University', 'University of Buenos Aires', 'University of Hanoi', 'University of Cape Town', 'University of Chile', 'Uppsala University', 'University of Amsterdam', 'University of Lahore', 'National University of Singapore', 'Trinity College Dublin', 'University of Oslo', 'University of the Philippines'];

// function generateRandomEntry(id) {
//     const name = `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
//     const gender = genders[Math.floor(Math.random() * genders.length)];
//     const country = countries[Math.floor(Math.random() * countries.length)];
//     const school = schools[Math.floor(Math.random() * schools.length)];
//     return `${id},${name},${gender},${country},${school}`;
// }

// // Generate 5000 entries starting from ID 1
// const data = ['ID,name,gender,country,school'];
// for (let id = 1; id <= 1000; id++) {
//     data.push(generateRandomEntry(id));
// }

// // Write to CSV
// fs.writeFileSync('db/data/com.pg.genai-Person.csv', data.join('\n'));
// console.log('Generated 1000 entries in db/data/db/data/com.pg.genai-Person.csv');




// Person.csv

const fs = require('fs');

// Generate 5000 entries starting from ID 1
const data = ['ID,person_ID'];
for (let id = 1; id <= 1000; id++) {
    const personId = id; // 1:1 mapping to Person IDs 1–5000
    data.push(`${id},${personId}`);
}

// Write to CSV
fs.writeFileSync('db/data/com.pg.genai-PersonEmbedding.csv', data.join('\n'));
console.log('Generated 1000 entries in db/data/com.pg.genai-PersonEmbedding.csv');