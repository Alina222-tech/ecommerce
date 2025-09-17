const express=require("express")
const router=express.Router()
const protect=require("../middleware/auth.js")

const {register,login}=require("../controller/user.controller.js")

router.post("/register",register)
router.post("/login",login)


module.exports=router