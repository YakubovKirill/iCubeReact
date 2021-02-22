const express = require('express')
const app = express()
const mySql = require('mysql')
const cors = require('cors')
const body_parser = require('body-parser')

const connection = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "icube_db"
})

app.use(cors())
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
    connection.query(sqlInsert, [userName, password], ((err, result) => {
        if (err) return res.send(err)
        return res.send('Ok')
    }));
    return
})


app.post('/login', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    const sqlInsert = "SELECT * FROM icube_db.users WHERE username = ? AND password = ?;"
    try {
        connection.query(sqlInsert, [userName, password], ((err, result) => {
            if (err) throw new Error()
            return res.send(result)
        }));
    } catch (e) {
        return res.send({
            data: 'Some error ' + e
        })
    }
    return
})

app.listen(3001, () => {
    console.log('listening port 3001')
})