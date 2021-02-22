const express = require('express')
const app = express()
const mySql = require('mysql')
const cors = require('cors')
const body_parser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')

const saltRounds = 10

const connection = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "icube_db"
})

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}))
app.use(cookieParser())
app.use(body_parser.urlencoded({extended: true}))
app.use(session({
    key: 'userID',
    secret: 'icube',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 86400
    }
}))


app.use(express.json())
app.use(body_parser.urlencoded({extended: true}))

app.get('/', (req, res) => {})

app.get('/api/get', (req, res) => {
    const sqlSelect = "SELECT * FROM icube_db.review;"
    connection.query(sqlSelect, ((err, result) => {
        if (err) console.log(err)
        else return res.send(result)
    }));
})

app.post('/api/insert', (req, res) => {
    const movie_name = req.body.movie_name
    const movie_review = req.body.movie_review
    const sqlInsert = "INSERT INTO icube_db.review (movie_name, movie_review) VALUES (?, ?);"
    connection.query(sqlInsert, [movie_name, movie_review], ((err, result) => {
        if (err) return res.send('Error with database')
        return res.send('')
    }));
    return
})

app.post('/register', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    const sqlInsert = "INSERT INTO icube_db.users (username, password) VALUES (?, ?);"

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.send(err)
        connection.query(sqlInsert, [userName, hash], ((err, result) => {
            if (err) return res.send({ message: 'Some error ' + err.message })
            return res.send('Ok')
        }));
    })
    
    return
})


app.post('/login', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    const sqlInsert = "SELECT * FROM icube_db.users WHERE username = ?;"
    try {
        connection.query(sqlInsert, userName, ((err, result) => {
            if (err) return res.send({message: 'Error with select'})
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, response) => {
                    if (err) return res.send({ message: 'Error password compare' })
                    if (response) {
                        req.session.user = result
                        //console.log(req.session.user)
                        return res.send(result)
                    }
                    return res.send({message: 'Wrong password'})
                })
            } else {
                return res.send({ message: 'User doesn\'t exists' })
            }
        }));
    } catch (e) {
        return res.send({ message: 'Some error ' + e.message })
    }
    return
})

app.get('/login', (req, res) => {
    if (req.session.user)
        res.send({loggedIn: true, user: req.session.user})
    else
        res.send({loggedIn: false}) 
})

app.listen(3001, () => {
    console.log('listening port 3001')
})