const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

const connectToDb = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URI)
        console.log('Database has connected')
    }
    catch(e){
        console.log('Error from connecting to db\n',e)
    }
}

module.exports = connectToDb