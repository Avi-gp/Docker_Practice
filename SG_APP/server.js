const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Use environment variable or default to localhost
const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:surya4@localhost:27017";
const client = new MongoClient(MONGO_URL);

// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve the success page
app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "success.html"));
});

// Serve the users page (HTML interface)
app.get("/users", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users.html"));
});

//GET all users (API endpoint - returns JSON)
app.get("/getUsers", async (req, res) => {
    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db("dockerps-db");
        const data = await db.collection('users').find({}).toArray();
        
        await client.close();
        res.json(data);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

//POST new user
app.post("/addUser", async (req, res) => {
    try {
        const userObj = req.body;
        console.log("User data received:", req.body);
        
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db("dockerps-db");
        const data = await db.collection('users').insertOne(userObj);
        
        console.log("User inserted:", data.insertedId);
        
        await client.close();
        
        // Redirect to success page
        res.redirect("/success");
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("Error creating account. Please try again.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Project directory: ${__dirname}`);
    console.log(`Public folder: ${path.join(__dirname, "public")}`);
});