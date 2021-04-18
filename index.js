const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0gacq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const { ObjectID } = require('bson');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
client.connect(err => {
  const serviceCollection = client.db("klear").collection("services");
  const reviewCollection = client.db("klear").collection("review");
  const bookingCollection =  client.db("klear").collection("booking");
  const adminCollection = client.db("klear").collection("admin");
  console.log('db connected');
  app.post('/addService',(req,res) =>{
    const newEvent = req.body;
    console.log('adding new event',newEvent);
    serviceCollection.insertOne(newEvent)
    .then(result =>{
        console.log('Inserted count :',result.insertedCount)
        res.send(result.insertedCount>0);
    })
    })
    app.get('/service', (req, res) => {
      serviceCollection.find()
      .toArray((err, items) => {
        res.send(items);
        console.log(items);
      })
    })
    app.post('/addReview',(req,res)=>{
      const newReview = req.body;
      console.log('adding new event',newReview);
      reviewCollection.insertOne(newReview)
      .then(result => {
        console.log('Inserted count :',result.insertedCount)
        res.send(result.insertedCount>0);
      })
    })
    app.get('/review',(req,res)=>{
      reviewCollection.find()
      .toArray((err,items)=>{
        res.send(items);
        console.log(items);
      })
    })
    app.get('/bookings/:id', (req, res)=> {
      serviceCollection.find({
        _id: ObjectID(req.params.id)
      })
      .toArray((err, items)=> {
        res.send(items)
        console.log(items);
      })
    })
    app.post('/addBookings', (req, res) => {
      const newBooking = req.body;
      console.log('booking', newBooking);
      bookingCollection.insertOne(newBooking)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0);
      })
    })
    app.get('/booking', (req, res)=> {
      bookingCollection.find()
      .toArray((err,items)=>{
        res.send(items);
        console.log(items);
      })
    })
    app.post('/addAdmin', (req, res) => {
      const newAdmin = req.body;
      console.log('admin', newAdmin);
      adminCollection.insertOne(newAdmin);
     
    })
    app.get('/admin', (req, res) => {
      // console.log(req.query.email)
      adminCollection.find()
      .toArray((err, items)=> {
        res.send(items)
        console.log('fro db', items);
      })
    })
    app.get(`/booking/:id`, (req, res)=> {
      bookingCollection.find({
        _id: ObjectID(req.params.id)
      })
      .toArray((err, items)=> {
        res.send(items)
        console.log(items);
      })
    })
    
      // perform actions on the collection object
      //client.close();
});

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})