
const router = require("express").Router();
const mongoose = require('mongoose')
const User = require('../model/userModel')
const bcrypt = require('bcrypt');


// ==================Ragisteration=======================
router.post('/register', async (req,res)=>{
        const salt = await bcrypt.genSalt(10)
        const hasedPass = await bcrypt.hash(req.body.password, salt)

        const username = req.body.username;
        const email = req.body.email;
        const password = hasedPass;
    try{
        const newPost = await User.create({username,email, password})
        res.status(200).json(newPost)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})
// ===================Login======================

router.post('/login', async (req,res)=>{

    try{
        const user = await User.findOne({username: req.body.username})
        !user && res.status(400).json('Email dose not Exist!')

        const validated  = await bcrypt.compare(req.body.password,user.password)
        !validated && res.status(400).json("Wrong Password!")

        // res.json(user)
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    }catch(error){
        res.status(500).json(error)
    }

})

module.exports = router
