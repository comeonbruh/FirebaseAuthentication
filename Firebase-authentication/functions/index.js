const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello! How are you?");
});

//getting all users
app.get('/', async(req, res) => {
    const snapshot = await admin.firestore().collection('users').get();
    let users = [];
    snapshot.forEach(doc => {
        let id = doc.id;
        let data = doc.data();
        users.push({id, ...data});
    })
    res.status(201).send(JSON.stringify(users));
})

//getting a specific user by their id
app.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection('users').doc(req.params.id).get();
    const userId = snapshot.id;
    const userData = snapshot.data();
    res.status(200).send(JSON.stringify({id: userId, ...userData}));
})

//creating a user
app.post('/', async(req, res) => {
    const user = req.body;
    await admin.firestore().collection('users').add(user);
    res.status(201).send(JSON.stringify(user));
})

//updating a user using their id
app.put("/:id", async(req, res) => {
    const body = req.body;
    await admin.firestore().collection('users').doc(req.params.id).update({...body});
    res.status(200).send();
})

//deleting a user using their id
app.delete("/:id", async(req,res) => {
    await admin.firestore().collection('users').doc(req.params.id).delete();
    res.status(200).send();
})

exports.user =  functions.https.onRequest(app)


