const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/remainderDb', {
    useNewUrlParser: true
})

const User = mongoose.model('User',{
    username:String,
    password:String,
    email:String,
    remainders:[]
})

module.exports={
    User
}