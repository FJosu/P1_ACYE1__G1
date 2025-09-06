const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://MariAbi:papasfritas14@cluster0.pij2euq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('Arqui1');
    const movies = database.collection('Alarmas');

    const query = { evento: "ALARM_ON" };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);