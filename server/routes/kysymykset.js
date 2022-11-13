const express = require('express')
const router = express.Router()
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'examDB',
    password: 'admin',
    port: 5432,
})

//lisää kysymys
router.post('/lisaa', async (req, res) => {
    try {
        await pool.query("INSERT INTO question (id, fk_exam_id, kysymys) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM question), 1), ($1), '')", [req.body.tenttiIndex])
        res.status(200).send('Kysymyksen lisäys onnistui')
    } catch (err) {
        res.status(500).send('Kysymyksen lisäys epäonnistui')
    }
})

//muuta kysymystä
router.put('/nimi-muuttui', async (req, res) => {
    try {
        await pool.query('UPDATE question SET kysymys = ($1) WHERE fk_exam_id = ($2) AND id = ($3)', [req.body.nimi, req.body.tenttiId, req.body.kysymysId])
        res.status(200).send('Kysymyksen muuttaminen onnistui')
    } catch (err) {
        res.status(500).send('Kysymyksen muuttaminen epäonnistui')
    }
})

//poista kysymys ja kaikki siihen liittyvä tieto
router.delete('/poista', async (req, res) => {
    try {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM user_answer WHERE question_id = (SELECT id FROM question WHERE kysymys = ($1) AND user_id = ($2))', [req.body.kysymys, req.body.userId])
        await pool.query('DELETE FROM answer WHERE question_id IN (SELECT id FROM question WHERE kysymys = ($1))', [req.body.kysymys])
        await pool.query('DELETE FROM question WHERE kysymys = ($1) AND fk_exam_id = ($2)', [req.body.kysymys, req.body.tenttiId])
        await pool.query('COMMIT')
        res.status(200).send('Kysymyksen poisto onnistui')
    } catch (err) {
        res.status(500).send('Kysymyksen poisto epäonnistui')
    }

})

module.exports = router