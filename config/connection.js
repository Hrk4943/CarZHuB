const mongoose=require('mongoose')




module.exports.connect=function(){
    mongoose.connect('mongodb://localhost:27017/ProjectCarZHuB',()=>{
        console.log('Connected to Database');
    })
}
