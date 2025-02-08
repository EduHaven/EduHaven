import mongoose from 'mongoose';


const FriendSchema=new mongoose.Schema({
userId: {type:String, required:true, unique:true},
friends:{
    type:Map,
    of: new mongoose.Schema({
        friendName: { type: String, required: true }
      }),
    default:{}
}
});

const friends=mongoose.model("friends",FriendSchema);

export default friends;