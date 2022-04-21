const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').objectId;

// use mideleware 
app.use(cors());
app.use(express.json());


// dbUse name: dbuser1
// password: b04K2Lpn6Vm3W0Ip


const uri = "mongodb+srv://dbuser1:b04K2Lpn6Vm3W0Ip@cluster0.0vsrm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run () {
    try{
        await client.connect();
        const userCollction = client.db('foodExpress').collection('user');

        // get user 
        app.get('/user', async(req, res) => {
            const query = {};
            const currsor = userCollction.find(query);
            const user = await currsor.toArray();
            res.send(user)
        });

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: objectId(id)};
            const result = await userCollction.findOne(query);
            res.send(result);
        })

        // POST user : add a new user 
        app.post('/user', async(req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollction.insertOne(newUser);
            res.send(result);
        });

        // updete user 
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updeteUser = req.body;
            const filter = {_id: objectId(id)};
            const options = { upsert: true };
            const updeteDoc = {
                $set: {
                    name: updeteUser.name,
                    email : updeteUser.email
                }
            };
            const result = await userCollction.updateOne(filter, updeteDoc, options);
            res.send(result);
        })

        // delete 
        app.delete('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: objectId(id)};
            const result = await userCollction.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my Node CRUD Server")
});

app.listen(port, () => {
    console.log("CRUD Server is running");
})