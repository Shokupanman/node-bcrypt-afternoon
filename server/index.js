require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const { CONNECTION_STRING, SESSION_SECRET } = process.env
let authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
let auth = require('./middleware/authMiddleware')

const app = express()

const PORT = 4000

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.listen(PORT, () => {
    console.log(`${PORT}% chance of brain damage after Dev Mountain`)
})

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))


massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
})