const mongoose = require('mongoose');

// const mongoURI="mongodb://127.0.0.1:27017/iNoteBook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.3";
const mongoURI="mongodb://0.0.0.0:27017/registration"

const connectToMongo =()=>{
         mongoose.connect(mongoURI,()=>{
                console.log("connected to Mongo Successfully");
         })
}

module.exports = connectToMongo;
