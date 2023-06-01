const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcrypt");


const jwt=require("jsonwebtoken");
const JWT_SECRET="asdfghjklmznxbcvqpowieruyto1234567890?./,|pqw!@#$%^&*()[]{}"
app.use(express.json());
//connect mongo

let mongoUrl =
  "mongodb+srv://mahacm98:Maha1234@cluster0.igmsqwf.mongodb.net/signup?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// ********** check Api Using Postman ***********

// // start server
// app.listen(1001,()=>{
//     console.log("Server Started....!");
// })

// // make api

// app.post("/post",async(req,res)=>{
//     console.log(req.body);
//     const {data}=req.body;

//     try{
//         if(data=="maha"){
//             res.send({status:"Ok"});
//         }else{
//             res.send({status:"user not valid"});
//              }
//     } catch(error){
//         res.send({status:"something went wront try again"});
//     }
// });

//*********** get details from user      */


require("./userDetails")
const User = mongoose.model("UserInfo"); // Initializing the mongoose model
 

// *********** Register API ************
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.send({ error: "User Exist" });
    }

    // create() returns a newly created document
    // no need to send any response to the client
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });

    res.send({ status: "ok" });
  } catch (error) {
    // send the error message to the client
    res.status(500).send({ status: "error", message: error.message });
  }
});

// *******8 Create login api  **********88

app.post("/login",async (req,res)=>{
    const { email,password }=req.body;     // get email and password
    const user = await User.findOne({ email });

    // check user exist or not

    if (!user) {   
      return res.send({ error: "User Not Found" });
    }  

    // *********Decrypt password *****
    if(await bcrypt.compare(password,user.password)){   
        const token = jwt.sign({email:user.email},JWT_SECRET,{expiresIn:10});
        if (res.status(201)){
            return res.json({status:"ok",data:token});
        }else{
            return res.json({error:"error"});
        }
    }
res.json({status:"error",error:"Invalid Password"});

});

//  ******  Make another  API  ******

app.post("/userData",async(req,res)=>{
    const {token}=req.body;
    try{
        const user=jwt.verify(token,JWT_SECRET,(err,res)=>{
          if(err){
            return " token is expire";
          }
          return res;

        });
        
        console.log(user);
        if(user=="token expired"){
          return res.send({status:"error",data:"token expired"});
        }

        const useremail=user.email;
        User.findOne({email:useremail})
        .then((data)=>{
            res.send({status:"ok",data:data});
        })
        .catch((error)=>{
            res.send({status:"error", data:error});
        });
    }catch(error){}


});







app.listen(5000, () => {
  console.log("server started");
});
