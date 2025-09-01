const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string
const uri = "mongodb+srv://Alejandro:y1zajqr9AWm4Gl5g@cluster0.pij2euq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('Arqui1');
    const movies = database.collection('Alarmas');

    // Queries for a movie that has a title value of 'Back to the Future'
    const query = { evento: "ALARM_ON" };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);