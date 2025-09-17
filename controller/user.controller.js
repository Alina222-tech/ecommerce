
const model=require('../model/user.model.js')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")




const Admin_Email="acheiver@gmail.com"

const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !email || !password ){
            return res.status(400).json({message : "All fields are required."})

        }
        const existinguser=await model.findOne({email})
        if(existinguser){
             return res.status(409).json({message : "user already exits."})


        }

        const hashpassword=await bcrypt.hash(password,10)

        const role= email===Admin_Email ? "admin" :"user"

        const user=await model.create({
            name,
            email,
            password:hashpassword,
            role
        })  
        return res.status(201).json({message : "User created Successfully."})


    }
    catch(err){
        return res.status(500).json(err)
  
    }
}
const login=async(req,res)=>{
    try{

        const {email,password}=req.body

        if(!email || !password){
        return res.status(400).json({message : "All fields are required."})

        }

        const user=await model.findOne({email})

        if(!user){
             return res.status(400).json({message : "User not Found."})
        }

        const ismatch=await bcrypt.compare(password,user.password)
        if(!ismatch){
             return res.status(400).json({message : "Invalid Password."})
        }
const token=jwt.sign({id:user._id , role:user.role}, process.env.JWT_SECRET , {expiresIn : "1d"})
   res.cookie("token", token, {
      httpOnly: true,     
      secure: false,       
      sameSite: "strict",  
      maxAge: 24 * 60 * 60 * 1000,
    });
return res.status(200).json({message : "login succesfully.",token,

 })
    }
    catch(err){
        return res.status(500).json(err)
    }




}

module.exports={
    register,
    login
}