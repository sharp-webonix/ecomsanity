const connectToMongo = require('./db');
const cors = require("cors");


const express = require('express');
connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth',require('./routes/auth'));

app.listen(port,()=>{
    console.log(`iNotebook backend listining at http://localhost:${port}`);
})
