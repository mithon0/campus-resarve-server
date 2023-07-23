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
const usersCollections = client.db("campus_reserve").collection("users");
const admissionCollections = client.db("campus_reserve").collection("admission");
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
    });

    app.post('/users',async(req,res)=>{
      const user =req.body
      console.log(user);
      const email =user.email;
      console.log(email);
      const existingUser =await usersCollections.findOne(email)
      if(existingUser){
        const result =await usersCollections.insertOne(user);
      res.send(result)
      }else{
        res.send({})
      };
      
      
    })
    app.get('/user/:email',async(req,res)=>{
      const email =req.params.email
      console.log(email);
      const query ={email:email}
      const result =await usersCollections.findOne(query);
      res.send(result)
    })

    app.put('/updateusers', async(req,res)=>{
        const updatedUser =req.body;
        console.log(updatedUser);
        const query ={email:updatedUser.email}
        const replacement =updatedUser;
        const result =await usersCollections.replaceOne(query,replacement);
        res.send(result)
    });
    app.post('/admission',async(req,res)=>{
      const admissionData =req.body;
      console.log(admissionData);
      const result = await admissionCollections.insertOne(admissionData) ;
      res.send(result)
    })
    app.get('/admission/:email',async(req,res)=>{
      const email =req.params.email;
      const query ={email:email}
      const result =await admissionCollections.find(query).toArray();
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