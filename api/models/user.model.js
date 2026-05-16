import mongoose from "mongoose";
const userSchema = new mongoose.Schema ({
    username:{
        type : String,
        required: true,
        unique: true,
    } ,
    email:{
        type : String,
        required: true,
        unique:true,
    } ,
    password:{
        type : String,
        required: true,
        unique:true,
    },
    avatar:{
        type:String,
        default:"https://i.pinimg.com/originals/1d/ec/e2/1dece2c8357bdd7cee3b15036344faf5.jpg?nii=t"
    }

},{timestamp: true});

const User = mongoose.model('User',userSchema);
export default User;