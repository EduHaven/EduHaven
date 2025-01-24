<<<<<<< HEAD
import mongoose from 'mongoose'

export const ConnectDB = async () => {
  const uri = process.env.MONGODB_URI
  try {
    mongoose.connect(uri).then(() => {
      console.log('Connected to Database')
    })
  } catch (error) {
    console.log('Error: ', error.message)
  }
}
=======
import mongoose from "mongoose";

export const ConnectDB = async () => {
    const uri = process.env.MONGODB_URI;
   try {
    mongoose.connect(uri, ).then(()=>{
        console.log("Connected to Database")
    })
   } catch (error) {
    console.log("Error: ", error.message);
   }
    
}
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
