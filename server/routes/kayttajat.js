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

router.post('/lisaa', async (req, res) => {
    try {
        await pool.query('INSERT INTO käyttäjä (kayttajatunnus, salasana, admin, kirjauduttu) VALUES ($1, $2, -1, false)', [req.body.kayttajatunnus, req.body.salasana])
        await pool.query('UPDATE rekisteröidytään SET rekisteröidytään = false')
        res.status(200).send('Käyttäjän lisäys onnistui')
    } catch (err) {
        res.status(500).send('Käyttäjän lisäys epäonnistui')
    }

})

router.delete('/poista', async (req, res) => {
    try {
        await pool.query('DELETE FROM user_answer WHERE user_id = ($1)', [req.body.kayttajaId])
        await pool.query('DELETE FROM käyttäjä WHERE id = ($1)', [req.body.kayttajaId])
        console.log(req.body.kayttajaId)
        res.status(200).send('Käyttäjän poisto onnistui')
    } catch (err) {
        res.status(500).send('Käyttäjän poisto epäonnistui')
    }

})

router.post('/kirjaudu', async (req, res) => {
    try {
        await pool.query('UPDATE käyttäjä SET kirjauduttu = true WHERE id = ($1)', [req.body.kayttaja.id])
        res.status(200).send('Kirjauduttu onnistuneesti')
    } catch (err) {
        res.status(500).send('Kirjautuminen epäonnistui')
    }
})

router.post('/poistu', async (req, res) => {
    try {
        await pool.query('UPDATE käyttäjä SET kirjauduttu = false WHERE kirjauduttu = true')
        res.status(200).send('Kirjauduttu ulos onnistuneesti')
    } catch (err) {
        res.status(500).send('Ulos kirjautuminen epäonnistui')
    }
})

router.put('/rekisteroidytaan', async (req, res) => {
    try {
        const data = req.body.data
        await pool.query('UPDATE rekisteröidytään SET rekisteröidytään = ($1)', [data])
        res.status(200).send('Rekisteröidytään')
    } catch (err) {
        res.status(500).send('Rekisteröitymisen aloitus epäonnistui')
    }
})

router.get('/hae-tulos', async (req, res) => {
    try {
        const maxPisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE question_id IN (SELECT id FROM question WHERE fk_exam_id = ($1)) AND oikein = true', [req.query.tenttiId])
        const valitutPisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE id IN (SELECT answer_id FROM user_answer WHERE user_id = ($1) AND exam_id = ($2)) AND oikein = true', [req.query.kayttajaId, req.query.tenttiId])
        res.status(200).send({ maxPisteet: maxPisteet.rows[0].count, valitutPisteet: valitutPisteet.rows[0].count })
    } catch (err) {
        res.status(500).send('Tuloksen haku epäonnistui')
    }
})

router.put('/aseta-valinta', async (req, res) => {
    try {
        await pool.query('UPDATE answer SET valinta = ($1) WHERE id = ($2)', [!req.body.valinta, req.body.vastausId])
        if (!req.body.valinta) {
            await pool.query('INSERT INTO user_answer (id, user_id, answer_id, question_id, exam_id) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM user_answer), 1), $1, $2, $3, $4)', [req.body.kayttajaId, req.body.vastausId, req.body.kysymysId, req.body.tenttiId])
        } else {
            await pool.query('DELETE FROM user_answer WHERE user_id = ($1) AND answer_id = ($2)', [req.body.kayttajaId, req.body.vastausId])
        }
        res.status(200).send('Valinnan asetus onnistui')
    } catch (err) {
        res.status(500).send('Valinnan asetus epäonnistui')
    }
})

module.exports = router