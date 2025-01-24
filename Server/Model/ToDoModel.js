import mongoose from "mongoose";

<<<<<<< HEAD
=======



>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
<<<<<<< HEAD
=======

>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
    dueDate:{
        type:Date,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

<<<<<<< HEAD
const Task = mongoose.model('Task', taskSchema);
=======
const Task = mongoose.model('Task',taskSchema);
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6

export default Task;