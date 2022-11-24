const express = require('express')
const router = express.Router()
const { Pool } = require('pg')
const { verifyToken } = require('../middlewares/verifyToken')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'examDB',
    password: 'admin',
    port: 5432,
})

//hae kaikki data
router.get('/', /* verifyToken, */ async (req, res) => {
    // tiedon luku asynkronisesti
    try {
        let tenttiData;
        console.log(req.query)
        if (Object.keys(req.query).length > 0) {
            tenttiData = await pool.query("SELECT * FROM exam WHERE NOT id IN (SELECT exam_id FROM finished_exam WHERE user_id = ($1)) ORDER BY id", [req.query.kayttaja.id])
        } else {
            tenttiData = await pool.query("SELECT * FROM exam ORDER BY id")
        }
        let tentit = tenttiData.rows
        for (let i = 0; i < tentit.length; i++) {
            let kysymykset = await pool.query("SELECT id, kysymys FROM question WHERE fk_exam_id = ($1) ORDER BY id", [Number(tentit[i].id)])
            tentit[i].kysymykset = kysymykset.rows
            for (let j = 0; j < tentit[i].kysymykset.length; j++) {
                let vastaukset = await pool.query("SELECT id, vastaus, oikein FROM answer WHERE question_id = ($1) ORDER BY id", [Number(tentit[i].kysymykset[j].id)])
                tentit[i].kysymykset[j].vastaukset = vastaukset.rows
                //console.log('dsfs', tentit[i].kysymykset[j].vastaukset)
            }
        }
        const kayttajat = await pool.query("SELECT id, kayttajatunnus, salasana, admin, kirjauduttu FROM käyttäjä")
        const kayttajaVastaukset = await pool.query('SELECT id, user_id, answer_id, question_id, exam_id FROM user_answer ORDER BY id')
        res.status(200).send({ tentit: tentit, kayttajaVastaukset: kayttajaVastaukset.rows, tallennetaanko: false, tietoAlustettu: false, kayttajat: kayttajat.rows, naytaVastaukset: false, rekisteröidytään: false })
    } catch (error) {
        res.status(500).send('Datan hakeminen epäonnistui')
    }
})

router.get('/offline-data'/* , verifyToken */, async (req, res) => {
    // tiedon luku asynkronisesti
    try {
        let tenttiData;
        console.log(req.query)
        if (Object.keys(req.query).length > 0) {
            tenttiData = await pool.query("SELECT * FROM exam WHERE NOT id IN (SELECT exam_id FROM finished_exam WHERE user_id = ($1)) ORDER BY id", [req.query.kayttaja.id])
        } else {
            tenttiData = await pool.query("SELECT * FROM exam ORDER BY id")
        }
        let tentit = tenttiData.rows
        for (let i = 0; i < tentit.length; i++) {
            let kysymykset = await pool.query("SELECT id, kysymys FROM question WHERE fk_exam_id = ($1) ORDER BY id", [Number(tentit[i].id)])
            tentit[i].kysymykset = kysymykset.rows
            for (let j = 0; j < tentit[i].kysymykset.length; j++) {
                let vastaukset = await pool.query("SELECT id, vastaus, oikein FROM answer WHERE question_id = ($1) ORDER BY id", [Number(tentit[i].kysymykset[j].id)])
                tentit[i].kysymykset[j].vastaukset = vastaukset.rows
                //console.log('dsfs', tentit[i].kysymykset[j].vastaukset)
            }
        }
        const kayttajat = await pool.query("SELECT id, kayttajatunnus, salasana, admin, kirjauduttu FROM käyttäjä")
        const kayttajaVastaukset = await pool.query('SELECT id, user_id, answer_id, question_id, exam_id FROM user_answer ORDER BY id')
        res.status(200).send({ tentit: tentit, kayttajaVastaukset: kayttajaVastaukset.rows, tallennetaanko: false, tietoAlustettu: false, kayttajat: kayttajat.rows, naytaVastaukset: false, rekisteröidytään: false })
    } catch (error) {
        res.status(500).send('Datan hakeminen epäonnistui')
    }
})

//lisää tentti
router.post('/lisaa', async (req, res) => {
    try {
        await pool.query("INSERT INTO exam (id, nimi, voimassa, kaytossa) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM EXAM), 1), '', false, false)")
        res.status(200).send('Tentin lisäys onnistui')
    } catch (err) {
        res.status(500).send('Tentin lisäys epäonnistui')
    }
})

//muuta tentin nimi
router.put('/nimi-muuttui', async (req, res) => {
    try {
        await pool.query('UPDATE exam SET nimi = ($1) WHERE id = ($2)', [req.body.nimi, req.body.tenttiId])
        res.status(200).send('Tentin nimen muuttaminen onnistui')
    } catch (err) {
        res.status(500).send('Tentin nimen muuttaminen epäonnistui')
    }

})

//poista tentti ja kaikki siihen liittyvä tieto
router.delete('/poista', async (req, res) => {
    try {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM finished_exam WHERE exam_id = ($1)', [req.body.tenttiId])
        await pool.query('DELETE FROM user_answer WHERE exam_id = ($1)', [req.body.tenttiId])
        await pool.query('DELETE FROM answer WHERE question_id IN (SELECT id FROM question WHERE fk_exam_id = ($1))', [req.body.tenttiId])
        await pool.query('DELETE FROM question WHERE fk_exam_id = ($1)', [req.body.tenttiId])
        await pool.query('DELETE FROM exam WHERE id = ($1)', [req.body.tenttiId])
        await pool.query('UPDATE exam SET voimassa = true WHERE id = (SELECT MIN(id) FROM exam)')
        await pool.query('COMMIT')
        res.status(200).send('Tentin poisto onnistui')
    } catch (err) {
        res.status(500).send('Tentin poisto epäonnistui')
    }

})

router.put('/kayttoon', async (req, res) => {
    try {
        await pool.query('UPDATE exam SET kaytossa = ($1) WHERE id = ($2)', [req.body.kaytossa, req.body.tenttiId])
        res.status(200).send('Tentti asetettu voimaan')
    } catch (err) {
        res.status(500).send('Tentin voimaan asetus epäonnistui')
    }
})


module.exports = router