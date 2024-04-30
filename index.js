const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors({
    origin: ["http://localhost:5173", "https://pottery-verse.web.app"],
}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xrf0qev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const craftsCollection = client.db('craftsDB').collection('crafts')
        const categoryCollection = client.db('craftsDB').collection('categories')

        // get craft items
        app.get('/crafts', async (req, res) => {
            const cursor = craftsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get all cetagories
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get specific category
        app.get('/category/:name', async (req, res) => {
            const query = { category: req.params.name }
            const result = await craftsCollection.find(query).toArray();
            res.send(result)
        })

        // get craft item using id
        app.get('/craft/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const result = await craftsCollection.findOne(query);
            res.send(result)
        })

        // get craft item based on user email
        app.get('/myItem/:email', async (req, res) => {
            // console.log()
            const query = { email: req.params.email }
            const result = await craftsCollection.find(query).toArray()
            res.send(result)
        })

        // update craft item based on user id

        app.put('/craft/:id', async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) }
            const updatedItem = req.body
            const item = {
                $set: {
                    name: updatedItem.name,
                    image: updatedItem.image,
                    category: updatedItem.category,
                    customization: updatedItem.customization,
                    price: updatedItem.price,
                    rating: updatedItem.rating,
                    time: updatedItem.time,
                    status: updatedItem.status,
                    details: updatedItem.details,
                }
            }
            const result = await craftsCollection.updateOne(filter, item)
            res.send(result)
        })

        // post craft item
        app.post('/crafts', async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft)
            const result = await craftsCollection.insertOne(newCraft)
            res.send(result)
        })

        // delete item based on id
        app.delete('/craft/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const result = await craftsCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Pottery Verse server is running')
})


app.listen(port, () => {
    console.log(`Pottery Verse server is running on port : ${port}`)
})