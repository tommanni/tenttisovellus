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
        await pool.query('BEGIN')
        await pool.query('INSERT INTO käyttäjä (kayttajatunnus, salasana, admin, kirjauduttu) VALUES ($1, $2, -1, false)', [req.body.kayttajatunnus, req.body.salasana])
        await pool.query('UPDATE rekisteröidytään SET rekisteröidytään = false')
        await pool.query('COMMIT')
        res.status(200).send('Käyttäjän lisäys onnistui')
    } catch (err) {
        res.status(500).send('Käyttäjän lisäys epäonnistui')
    }

})

router.get('/hae', async (req, res) => {
    try {
        const kayttaja = await pool.query('SELECT * FROM käyttäjä WHERE kayttajatunnus = ($1)', [req.query.tunnus])
        console.log(kayttaja.rows[0])
        res.status(200).send({ kayttaja: kayttaja.rows[0] })
    } catch (err) {
        res.status(500).send('Käyttäjän haku epäonnistui')
    }

})

router.delete('/poista', async (req, res) => {
    try {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM user_answer WHERE user_id = ($1)', [req.body.kayttajaId])
        await pool.query('DELETE FROM käyttäjä WHERE id = ($1)', [req.body.kayttajaId])
        await pool.query('COMMIT')
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

router.get('/hae-tulos', async (req, res) => {
    try {
        const maxPisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE question_id IN (SELECT id FROM question WHERE fk_exam_id = ($1)) AND oikein = true', [req.query.tenttiId])
        console.log(maxPisteet.rows)
        const valitutPisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE id IN (SELECT answer_id FROM user_answer WHERE user_id = ($1) AND exam_id = ($2)) AND oikein = true', [req.query.kayttajaId, req.query.tenttiId])
        const arvosana = Math.round(valitutPisteet.rows[0].count / maxPisteet.rows[0].count * 10)
        await pool.query('INSERT INTO finished_exam (user_id, exam_id, grade) VALUES ($1, $2, $3)', [req.query.kayttajaId, req.query.tenttiId, arvosana])
        console.log(arvosana)
        res.status(200).send({ maxPisteet: maxPisteet.rows[0].count, valitutPisteet: valitutPisteet.rows[0].count, arvosana: arvosana })
    } catch (err) {
        res.status(500).send('Tuloksen haku epäonnistui')
    }
})

router.get('/hae-suoritus', async (req, res) => {
    try {
        console.log('sadfasdfdas')
        const suoritetut = await pool.query('SELECT (SELECT nimi FROM exam WHERE id = F.exam_id), grade FROM finished_exam F WHERE user_id = ($1)', [req.query.kayttajaId])
        console.log(suoritetut.rows)
        const suorittamattomat = await pool.query('SELECT nimi FROM exam WHERE NOT id in (SELECT exam_id FROM finished_exam WHERE user_id = ($1))', [req.query.kayttajaId])
        res.status(200).send({ suoritetut: suoritetut.rows, suorittamattomat: suorittamattomat.rows })
    } catch (err) {
        res.status(500).send('Tuloksen haku epäonnistui')
    }
})

router.put('/aseta-valinta', async (req, res) => {
    try {
        await pool.query('BEGIN')
        if (!req.body.valinta) {
            await pool.query('INSERT INTO user_answer (id, user_id, answer_id, question_id, exam_id) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM user_answer), 1), $1, $2, $3, $4)', [req.body.kayttajaId, req.body.vastausId, req.body.kysymysId, req.body.tenttiId])
        } else {
            await pool.query('DELETE FROM user_answer WHERE user_id = ($1) AND answer_id = ($2)', [req.body.kayttajaId, req.body.vastausId])
        }
        await pool.query('COMMIT')
        res.status(200).send('Valinnan asetus onnistui')
    } catch (err) {
        res.status(500).send('Valinnan asetus epäonnistui')
    }
})

module.exports = router