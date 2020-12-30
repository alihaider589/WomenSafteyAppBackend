const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost:27017/wosafeDB', { useUnifiedTopology: true, useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    username: String,
    cellnumber: String,
    FirstGuardian: String,
    FGuardianNo: Number,
    SecondGuardian: String,
    SecondGuardianNo: Number,
    Message: String,
    Password: String,
})

const User = new mongoose.model('Lady', userSchema)


app.post('/register', (req, res) => {
    const NewUser = new User({
        username: req.body.username,
        cellnumber: req.body.cellnumber,
        FirstGuardian: req.body.FirstGuardian,
        FGuardianNo: req.body.FGuardianNo,
        SecondGuardian: req.body.SecondGuardian,
        SecondGuardianNo: req.body.SecondGuardianNo,
        Message: req.body.Message,
        Password: req.body.Password
    })
    NewUser.save((err) => {
        if (!err) {
            res.send('Saved Successfully')
        } else {
            res.send('Failed')
        }
    })
})





app.listen(3000, console.log('app is running on port 3000'))