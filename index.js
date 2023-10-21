const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.BS_USER}:${process.env.BS_PASS}@cluster0.etbjr0z.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();


    const brandsCollection = client.db("brandsDB").collection("brands");
    const cartCollection = client.db("brandsDB").collection("cart");
    const userCollection = client.db("brandsDB").collection("user");


    app.get("/brands", async (req, res) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post("/brands", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await brandsCollection.insertOne(newProduct);
      res.send(result);
    })

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post("/cart", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await cartCollection.insertOne(newProduct);
      res.send(result);
    })

    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Brand shop is running");
})

app.listen(port, () => {
  console.log(`Brand shop is running on port ${port}`);
})