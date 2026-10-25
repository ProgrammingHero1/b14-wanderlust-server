import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors'
import 'dotenv/config'
const app = express() 
const PORT = 8000

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

app.use(cors())
app.use(express.json())


const mongoClient = await connectToMongoDB()
const db = mongoClient.db("wanderlust")
const destinationCollection =  db.collection("destination")

app.post("/add-destination", async(req, res) => {
  const data = req.body
  const result = await destinationCollection.insertOne(data)
  res.send(result)
})

app.get('/destinations', async(req, res) => {
  const result = await destinationCollection.find().toArray() 
  res.send(result)
})

app.get('/destination/:id', async(req, res) => {
  const {id} = req.params
  const result = await destinationCollection.findOne({_id: new ObjectId(id)})
  res.send(result)
})

app.patch('/destination/:id', async(req, res) => {
  const {id} = req.params
  const data = req.body
  const result = await destinationCollection.updateOne(
    {_id: new ObjectId(id)}, 
    {$set: data}
  )
  res.json(result)
})

app.delete('/destination/:id', async(req, res) => {
  const {id} = req.params
  const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
  res.json(result)
})




//http://localhost:8000

app.get('/', (req, res) => {
    res.send({message: 'Server is running fine!'})
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})
