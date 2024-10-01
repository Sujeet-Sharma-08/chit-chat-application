import mongoose, { Types } from "mongoose";


//  this is the user schema
const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required: true
    },

   username:{
        type:String,
        required: true
    },

    password:{
        type:String,
        required: true,
        unique:true,
        minlength:6
    },

    gender:{
        type:String,
        required: true,
        enum:['male' , 'female']
    },

    profilePic:{
        type:String,
       default:"",
    }
},{timestamps:true});

// this is the user model
const User  = mongoose.model("User", UserSchema);
export default User;
