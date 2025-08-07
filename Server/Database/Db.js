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