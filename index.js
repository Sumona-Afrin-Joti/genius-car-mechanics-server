const express = require('express');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const app = express();
const port = 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

//middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ctn6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {
    try {
        await client.connect();
        console.log('server connected to databse');
        const database = client.db("carMechanics");
        const serviceCollection = database.collection("services");

        //GET API

        app.get('/services',async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });

        // GET single service;

        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            console.log('getting specific service')
            const query = {_id:ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // POST API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitted the post request',service)
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        });

        //DELETE API 
        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            console.log('deleted successfully', result);
            res.json(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running the Server');
});

app.listen(port, () => {
    console.log('Listening the port ,', port);
})