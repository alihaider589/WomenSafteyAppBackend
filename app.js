//jshint esversion:6
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const bodyParser = require('body-parser')
const findOrCreate = require('mongoose-findorcreate')
const bycrypt = require('bcrypt')


const app = express();


app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb+srv://alihaider589:dzpiNbTBFrhrmSeH@cluster0.rskys.mongodb.net/woSafeDB',
    { useUnifiedTopology: true, useNewUrlParser: true }
)
mongoose.set('useCreateIndex', true)

const UserSchema = new mongoose.Schema({
    password: String,
    username: String,
    cellnumber: String,
    FirstGuardian: String,
    FGuardianNo: Number,
    SecondGuardian: String,
    SecondGuardianNo: Number,
    Message: String,

})

const User = new mongoose.model('User', UserSchema)


app.post('/api/wosafe/register', (req, res) => {

    const { username, cellnumber, FirstGuardian, FGuardianNo, SecondGuardian, SecondGuardianNo, Message, password } = req.body
    User.findOne({ username: username }, function (err, foundUser) {
        if (foundUser) {
            res.json({ "message": "User Already Exist" })
        } else {
            bycrypt.hash(password, 10, function (err, has) {

                const user = new User({
                    email: username,
                    username: username,
                    password: has,
                    cellnumber: cellnumber,
                    FirstGuardian: FirstGuardian,
                    FGuardianNo: FGuardianNo,
                    SecondGuardian: SecondGuardian,
                    SecondGuardianNo: SecondGuardianNo,
                    Message: Message
                })
                user.save((err) => {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json({ "message": "Saved Successfully" })
                    }
                })
            })
        }
    })



})


// BCRYPT METHOD

app.post('/api/wosafe/login', (req, res) => {
    const { username, cellnumber, FirstGuardian, FGuardianNo, SecondGuardian, SecondGuardianNo, Message, password } = req.body


    console.log(username, password)
    User.findOne({ username: username }, function (err, foundUser) {
        if (foundUser) {
            bycrypt.compare(password, foundUser.password, function (err, result) {
                if (result === true) {
                    res.send(foundUser)
                } else {
                    res.json({ "message": "User Not Found" })
                }
            })
        } else {
            res.json({ "message": "User Not Found" })
        }
    }
    )
})
app.patch('/api/wosafe/update', (req, res) => {
    const { id,
        username,
        cellnumber,
        FirstGuardian,
        SecondGuardian,
        FGuardianNo,
        SecondGuardian,
        SecondGuardianNo,
        Message } = req.body
    User.findOneAndUpdate({ _id: id }, {
        username: username,
        cellnumber: cellnumber,
        FirstGuardian: FirstGuardian,
        FGuardianNo: FGuardianNo,
        SecondGuardian: SecondGuardian,
        SecondGuardianNo: SecondGuardianNo,
        Message: Message
    }, (err) => {
        if (!err) {
            res.json({ "message": "Successfully changed Profile" })
        } else {
            res.json({ "message": "Failed to update Data" })
        }
    })
})


app.listen(process.env.PORT || 3000, console.log('app is running on port 3000'))