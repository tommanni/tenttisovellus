const fs = require('fs');
const { Pool } = require('pg')
const express = require('express')  //Jos ei toimi, niin "npm install express"
const app = express()
const port = 8080
const cors = require('cors');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'examDB',
    password: 'admin',
    port: 5432,
})

app.use(cors())  //jos ei toimi, niin "npm install cors"
app.use(express.json());

const tenttiRouter = require('./routes/tentit')
const kysymysRouter = require('./routes/kysymykset')
const vastausRouter = require('./routes/vastaukset');
const kayttajaRouter = require('./routes/kayttajat')

app.use('/tentti', tenttiRouter)
app.use('/kysymys', kysymysRouter)
app.use('/vastaus', vastausRouter)
app.use('/kayttaja', kayttajaRouter)

app.get('/onko-valittu', async (req, res) => {
    try {
        const valittu = await pool.query('SELECT CASE WHEN id IN (SELECT answer_id FROM user_answer WHERE user_id = ($1)) THEN true ELSE false END FROM answer ORDER BY id', [req.query.kayttajaId])
        res.send(valittu.rows)
    } catch (err) {
        res.status(500).send('Valittujen haku epäonnistui')
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})