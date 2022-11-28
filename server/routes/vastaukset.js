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

//lisää vastaus
router.post('/lisaa', async (req, res) => {
    try {
        await pool.query("INSERT INTO answer (id, question_id, vastaus, oikein) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM answer), 1), ($1), '', false)", [req.body.kysymysId])
        res.status(200).send('Vastaus tallennettu')
    } catch (err) {
        res.status(500).send('Tallennus epäonnistui')
    }

})

//muuta vastausta
router.put('/nimi-muuttui', async (req, res) => {
    try {
        await pool.query('UPDATE answer SET vastaus = ($1) WHERE question_id = ($2) AND id = ($3)', [req.body.nimi, req.body.kysymysId, req.body.vastausId])
        res.status(200).send('Vastauksen nimi muutettu')
    } catch (err) {
        res.status(500).send('Vastauksen nimen muutos epäonnistui')
    }
})

//muuta vastauksen oikeellisuus
router.put('/oikein', async (req, res) => {
    try {
        await pool.query('UPDATE answer SET oikein = ($1) WHERE id = ($2)', [!req.body.oikein, req.body.vastausId])
        await pool.query('UPDATE exam SET kaytossa = false WHERE id = ($1)', [req.body.tenttiId])
        res.status(200).send('Vastauksen oikeellisuus muutettu')
    } catch (err) {
        res.status(500).send('Vastauksen oikeellisuuden muuttaminen epäonnistui')
    }
})

router.get('/laske-oikein', async (req, res) => {
    try {
        const maara = await pool.query('SELECT COUNT(*) FROM answer WHERE question_id IN (SELECT id FROM question WHERE fk_exam_id = ($1)) AND oikein = true', [req.query.tenttiId])
        console.log(maara.rows)
        res.status(200).send({ maara: maara.rows[0].count })
    } catch (err) {
        res.status(500).send('Vastauksen oikeellisuuden muuttaminen epäonnistui')
    }
})

//poista vastaus ja siihen liittyvät tiedot
router.delete('/poista', async (req, res) => {
    try {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM user_answer where answer_id = (SELECT id FROM answer WHERE vastaus = ($1))', [req.body.vastaus])
        await pool.query('DELETE FROM answer WHERE question_id = ($1) AND vastaus = ($2)', [req.body.kysymysId, req.body.vastaus])
        await pool.query('COMMIT')
        res.status(200).send('Vastauksen poisto onnistui')
    } catch (err) {
        console.log(err)
        res.status(500).send('Vastauksen poisto epäonnistui')
    }
})

module.exports = router