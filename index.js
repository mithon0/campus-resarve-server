const express = require('express');
const cors = require('cors');
const app= express();
require('dotenv').config();
const port =process.env.PORT || 4000;

// middlewere
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3kcnoe6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const collageCollections = client.db("campus_reserve").collection("Collages");
    app.get('/collages',async(req,res)=>{
        const result =await collageCollections.find().toArray();
        res.send(result)
    })
    app.get('/collages/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:new ObjectId(id)}
        const result =await collageCollections.findOne(query);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Campus server is running')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(process.env.DB_PASS);
  })