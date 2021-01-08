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
app.use(session({
    secret: 'Our Little Secret',
    resave: false,
    saveUninitialized: false
}
))
app.use(passport.initialize())
app.use(passport.session())
mongoose.connect('mongodb://localhost:27017/wosafeDB',
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

UserSchema.plugin(passportLocalMongoose)
UserSchema.plugin(findOrCreate)

const User = new mongoose.model('User', UserSchema)
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//  BYCRYPT METHOD


app.post('/register', (req, res) => {

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
                        res.send(err)
                    } else {
                        res.send('Saved Successfully')
                    }
                })
            })
        }
    })



})


// BCRYPT METHOD

app.post('/login', (req, res) => {
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
        }
    }
    )
})














// app.post('/register', (req, res) => {
//     const { username, cellnumber, FirstGuardian, FGuardianNo, SecondGuardian, SecondGuardianNo, Message } = req.body
//     User.register({
//         username: username,
//         cellnumber: cellnumber,
//         FirstGuardian: FirstGuardian,
//         FGuardianNo: FGuardianNo,
//         SecondGuardian: SecondGuardian,
//         SecondGuardianNo: SecondGuardianNo,
//         Message: Message
//     }, req.body.password, function (err, user) {
//         if (err) {
//             console.log(err);
//             res.send(err)
//         } else {
//             passport.authenticate("local")(req, res, function () {
//                 res.send("Successfully")
//             });
//         }
//     });
// })
// app.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/')
// })
// app.post('/login', (req, res) => {
//     const user = new User({
//         username: req.body.username,
//         password: req.body.password
//     })

// })

app.listen(3000, console.log('app is running on port 3000'))