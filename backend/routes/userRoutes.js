const router = require("express").Router();
const mongoose = require('mongoose')
const User = require('../model/userModel')
const Post = require('../model/postModel')
const bcrypt = require('bcrypt');


router.get('/:id', async (req,res)=>{

    try{
        const user  = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    }catch(error){
        res.status(500).json(error)
    }
})

// ================Update===============
router.patch('/:id', async (req,res)=>{
    // check if its user's account only
    if(req.body.userId === req.params.id){
        // bcryp user password to update
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password,salt )
        }
        // update user information
        try{
            const updateUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body},{new:true})
            res.status(200).json(updateUser)
        }catch(error){
            res.status(500).json(error)
        }
    }else{
        res.status(400).json({message:"you can update your own acount only!"})
    }
})
// ====================Delete User=======================
router.delete('/:id', async (req,res)=>{
       // check if its user's account only
       if(req.body.userId === req.params.id){
        try{
            const user = await User.findById(req.params.id);
            try{
                await Post.deleteMany({username:user.username})
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json({message:"Your Account Deleted!"})
            }catch(error){
                res.status(500).json(error)
            }
        }catch(error){
            res.status(500).json(error)
        }
    }else{
        res.status(400).json({message:"you can delete only your account!"})
    }
})
module.exports = router
