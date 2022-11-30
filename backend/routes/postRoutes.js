
const router = require("express").Router();
const Post = require('../model/postModel')
const User = require('../model/userModel')
const Catagories  = require('../model/catModel')
const mongoose = require('mongoose')


// ==================Create New Post=======================
router.post('/', async (req,res)=>{
    const {title,desc, username,categories,photo} = req.body;
    try{
        const newPost = await Post.create({title,desc, username,categories,photo})
        res.status(200).json(newPost)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})
// ==================Show Single Post=======================
router.get('/:id', async (req, res)=>{
    var postID = req.params.id
    if(!mongoose.Types.ObjectId.isValid(postID)){
        return res.status(404).json({erorr:"invalid Id Requisted"})
    }
    const aPost = await Post.findById(postID)
    if(!aPost){
        return res.status(404).json({error:"No Post by This id exsit!"})
    }
    res.status(200).json(aPost)
})
// ==================Show all Post=========================
router.get('/', async (req,res)=>{
    const username = req.query.username;
    const catName = req.query.cat;
    try{
        let posts
        if(username){
            posts = await Post.find({username}).sort({createdAt:-1})
        }else if(catName){
            posts = await Post.find({categories:{$in:[catName]}}).sort({createdAt:-1})
        }else{
            posts = await Post.find()
        }
        res.status(200).json(posts)
    }catch(error){
        res.status(500).json(error)
    } 
})

// ==================Update a Single Post=================
router.patch('/:id', async (req,res)=>{
    var postID = req.params.id
    if(!mongoose.Types.ObjectId.isValid(postID)){
        return res.status(404).json({erorr:"invalid Id Requisted"})
    }
    try{
        const post  = await Post.findById(postID)
        if(post.username === req.body.username){
            try{
                const updataPost = await Post.findByIdAndUpdate(postID, {$set:req.body},{new:true})
                res.status(200).json(updataPost)
            }catch(error){
                res.status(500).json(error)
            }
        }else{
            res.status(401).json({message:"you can update your post Only!"})
        }
    }catch(error){
        res.status(500).json(error)
    }
})

// ==================Delete A Post=======================
router.delete('/:id', async (req, res)=>{
    var postID = req.params.id
    if(!mongoose.Types.ObjectId.isValid(postID)){
        return res.status(404).json({erorr:"invalid Id Requisted"})
    }
    try{
        const post  = await Post.findById(postID)
        if(post.username === req.body.username){
            try{
                await post.delete()
                res.status(200).json({message:"Post Deleted!"})
            }catch(error){
                res.status(500).json(error)
            }
        }else{
            res.status(401).json({message:"you can Delete your post Only!"})
        }
    }catch(erorr){
        res.status(500).json(erorr)
    }

})


module.exports = router