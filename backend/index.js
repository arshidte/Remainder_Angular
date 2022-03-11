const express = require('express');
const jwt = require('jsonwebtoken')
const dataService = require('./Services/dataServices');
const cors = require('cors');

const app = express();

app.use(cors({
    origin:'http://localhost:4200'
}))

app.use(express.json());

const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        const data = jwt.verify(token, 'superSecretKey');
        req.currentAcc = data.currentAcc;
        next()
    } catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "Please login"
        })
    }
}


app.post('/register', (req,res)=>{
    dataService.register(req.body.username,req.body.password,req.body.email).then(result => {
        res.status(result.statusCode).json(result);
    })
})

app.post('/login', (req,res)=>{
    dataService.login(req.body.email,req.body.password).then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.post('/postRemainder',jwtMiddleware, (req,res)=>{
    dataService.postRemainder(req.body.email,req.body.title,req.body.date,req.body.desc).then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.post('/remainder',jwtMiddleware, (req,res)=>{
    dataService.remainder(req.body.email).then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.delete('/deleteAcc/:email', (req,res)=>{
    dataService.deleteAcc(req.params.email).then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.post('/deleteRem',jwtMiddleware, (req,res)=>{
    dataService.deleteRem(req.body.email,req.body.i).then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.listen(3000, () => {
    console.log("Server started at port number 3000");
})