const cluster = require('cluster')
if(cluster.isMaster){
    var i = 0
    for(i; i<2; i++){
        cluster.fork();
    }
    cluster.on('exit',(worker)=>{
        console.log('worker' + worker.id + 'died..')
        cluster.fork()
    })
   
} else{
// require express package=========================
var express = require('express')
var app  = express()
const postRoutes = require('./routes/postRoutes')
const registerRoutes = require('./routes/authRoutes')
const usersRoutes = require('./routes/userRoutes')
const catRoutes = require('./routes/catRoutes')
var url = "mongodb://localhost:27017/MyMongoDB"
var mongoose = require('mongoose')
const cors = require("cors")
const path = require('path')
//this let us to send data to the sever from front end
app.use(express.json())
// ============Middleware================
app.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()
})
// =============CORS==============
app.use(cors())
// =============All Routes===========
app.use('/posts', postRoutes)
app.use('/auth', registerRoutes)
app.use('/users', usersRoutes)
app.use('/category',catRoutes)
// the photo

app.use('/images',express.static(path.join(__dirname,"./images")))

// ======================Upload image===============================

const multer = require('multer');

const storage  = multer.diskStorage({
    destination: (req,file,cb)=>{
    cb(null, "./images")
    },
    filename: (req,file,cb)=>{
        cb(null, req.body.name)
    }
});
const upload = multer({storage:storage})

app.post('/upload', upload.single("file"), (req,res)=>{
    res.status(200).json({message:"file has been uploaded successfully!"})
})

// =============Port List============
mongoose.connect(url)
.then(()=>{
    app.listen(4000, ()=>{
        console.log('Server is running on port 4000')
    })
}).catch((error)=>{console.log(error)})
// when server stop misha baz ee ki ast again run is mikona bro
}