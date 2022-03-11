const db = require('./db')
const jwt = require('jsonwebtoken')

const register = (username,password,email) => {
    return db.User.findOne({email}).then(user=>{
        if(user) {
            return {
                statusCode: 422,
                status: false,
                message: "User already exists. Please login!"
            }
        }else{
            const newUser = new db.User({
                username,
                password,
                email,
                remainders: []
            })
            newUser.save();
            return {
                statusCode: 200,
                status: true,
                message: "Successfully registered"
            }
        }
    })
}

let currentEmail;
const login = (email,password) => {
    return db.User.findOne({email,password}).then(user=>{
        if(user){
            currentUser = user.username;
            currentEmail = user.email;

            token = jwt.sign({
                currentAcc: user.email
            }, 'superSecretKey')

            return {
                statusCode: 200,
                status: true,
                message: "Successfully logged in",
                currentUser,
                currentEmail,
                token
            }
            
        }else{
            return {
                statusCode: 422,
                status: false,
                message: "Your email or password is incorrect!"
            }
        }
    })
}

const postRemainder = (email,title,date,desc) => {
    return db.User.findOne({email}).then(user=>{
        if(user){
            user.remainders.push({
                title,
                date,
                desc
            })
            user.save()
            return {
                statusCode: 200,
                status: true,
                message: "Successfully set the remainder",
            }
        }else{
            return {
                statusCode: 422,
                status: false,
                message: "Something went wrong! Please check if you are logged in"
            }
        }
    })
}

const remainder = (email) => {

    return db.User.findOne({email}).then(user=>{
        if(user){
            return {
                statusCode: 200,
                status: true,
                remainder: user.remainders

            }
        }else{
            return {
                statusCode: 422,
                status: false,
                message: "Something went wrong! Please check if you are logged in"
            }
        }
    })
}

const deleteAcc = (email)=>{
    return db.User.deleteOne({
        email
    })
    .then(user=>{
        if(user){
            return{
                statusCode:200,
                status:true,
                message:"Account deleted successfully",
            }
        }else{
            return {
                statusCode: 422,
                status: false,
                message: "Invalid credentials"
            }
        }
    })
}

const deleteRem = (email,i) => {
    return db.User.updateOne({email},{$pull: { remainders: { title: i } }})
    .then(user=>{
        if(user){
            return{
                statusCode:200,
                status:true,
                message:"Document deleted successfully",
                remainder: user.remainders
            }
        }
    })
}

module.exports = {
    register,
    login,
    postRemainder,
    remainder,
    deleteAcc,
    deleteRem
}