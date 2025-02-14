const { compiledContract } = require('./compile');
const cors = require("cors");
const express = require('express');
const app = express();

const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(compiledContract));
});

app.listen(8000, () => {
    console.log("Record Map Compile Server is running...");
});
