const express = require("express")
const app = express();
const mongoose = require("mongoose")
const userController = require("./controllers/users")
const session = require("express-session")
const sessionsController = require("./controllers/sessions")
const methodOverride = require("method-override")
require("dotenv").config()

const PORT = process.env.PORT

//Middleware
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride("_method"))
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
)

//Database Config
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//Database Connection Error/ Success
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use("/users", userController)
app.use("/sessions", sessionsController)

//Routes / Controllers
app.get("/", (req, res) => {
    if (req.session.currentUser) {
        res.render("dashboard.ejs", {
            currentUser: req.session.currentUser
        })
    } else {    
    res.render("index.ejs", {
        currentUser: req.session.currentUser
        })
    }
})



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})