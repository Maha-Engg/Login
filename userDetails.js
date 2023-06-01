const mongoose =require("mongoose");


const UserDetailSchema = new mongoose.Schema(
    {
        fname:{type:String},
        lname:{type:String},
        email:{type:String, unique:true},
        password:{type:String},
        
        
    },
    {
        collection:"UserInfo"
    }
);

mongoose.model("UserInfo",UserDetailSchema);