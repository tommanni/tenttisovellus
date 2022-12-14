const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10;
require('dotenv').config()
const { isAdmin } = require('../middlewares/isAdmin')
const { verifyToken } = require('../middlewares/verifyToken')
const { pool } = require('../pool')

router.post('/token', async (req, res) => {
    console.log('tokenia haetaan')
    const refreshToken = req.body.token
    if (refreshToken === null) return res.status(401).send('Tokenia ei tarjottu')
    let refreshTokenData = await pool.query('SELECT token FROM refresh_token')
    let refreshTokens = refreshTokenData.rows.map(token => token.token)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_ACCESS_TOKEN_SECRET, (err, user) => {
        //if (err) return res.status(403).send(err)
        const accessToken = jwt.sign({
            userId: user.userId,
            kayttajatunnus: user.kayttajatunnus
        },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "600s"
            })
        res.json({
            token: accessToken
        })
    })
})

router.post('/kirjaudu', async (req, res, next) => {
    const { kayttaja } = req.body

    let existingUser;
    let passwordMatch = false
    try {
        let result = await pool.query(
            "select * from käyttäjä where kayttajatunnus=$1",
            [kayttaja.kayttajatunnus]
        )
        existingUser = {
            salasana: result.rows[0].salasana,
            kayttajatunnus: result.rows[0].kayttajatunnus,
            id: result.rows[0].id
        }
        passwordMatch = await bcrypt.compare(
            kayttaja.salasana,
            existingUser.salasana
        )
        await pool.query(
            'UPDATE käyttäjä SET kirjauduttu = true WHERE id = ($1)',
            [kayttaja.id]
        )
    } catch (err) {
        res.status(500).send('Kirjautuminen epäonnistui')
        return next(err)
    }

    if (!existingUser || !passwordMatch) {
        return res.status(500)
    }
    let token;
    let refreshToken
    try {
        token = jwt.sign({
            userId: existingUser.id,
            kayttajatunnus: existingUser.kayttajatunnus
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "600s" }
        )
        refreshToken = jwt.sign({
            userId: existingUser.id,
            kayttajatunnus: existingUser.kayttajatunnus
        },
            process.env.REFRESH_ACCESS_TOKEN_SECRET
        )
        await pool.query(
            'INSERT INTO refresh_token (token) VALUES ($1)',
            [refreshToken]
        )
    } catch (err) {
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }

    res
        .status(200)
        .json({
            success: true,
            data: {
                userId: existingUser.id,
                kayttajatunnus: existingUser.kayttajatunnus,
                token: token,
                refreshToken: refreshToken
            }
        })
})

router.post('/lisaa', async (req, res, next) => {
    const { kayttajatunnus, salasana } = req.body
    let result;
    try {
        const hashed = await bcrypt.hash(salasana, saltRounds)
        await pool.query('BEGIN')
        result = await pool.query(
            'INSERT INTO käyttäjä (kayttajatunnus, salasana, admin, kirjauduttu) VALUES ($1, $2, -1, false) RETURNING id',
            [kayttajatunnus, hashed]
        )
        await pool.query('COMMIT')
    } catch (err) {
        res.status(500).send('Käyttäjän lisäys epäonnistui')
        return next(err)
    }
    let token;
    try {
        token = jwt.sign({
            userId: result.rows[0].id,
            kayttajatunnus: kayttajatunnus
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        )
    } catch (err) {
        const error = new Error("Error! Something went wrong.")
        return next(error)
    }
    res
        .status(201)
        .json({
            success: true,
            data: {
                userId: result.rows[0].id,
                kayttajatunnus: kayttajatunnus,
                token: token
            }
        })
})

router.get('/hae', async (req, res) => {
    try {
        const kayttaja = await pool.query(
            'SELECT * FROM käyttäjä WHERE kayttajatunnus = $1',
            [req.query.kayttajatunnus]
        )
        if (kayttaja.rows.length === 0) {
            return res.send({ kayttaja: undefined })
        }
        let passwordMatch = await bcrypt.compare(
            req.query.salasana,
            kayttaja.rows[0].salasana
        )
        if (!passwordMatch) {
            return res.send('fail')
        }
        //console.log(kayttaja.rows)
        res.status(200).send({ kayttaja: kayttaja.rows[0] })
    } catch (err) {
        console.log(err)
        res.status(500).send('Käyttäjän haku epäonnistui')
    }

})

router.delete('/poista', verifyToken, isAdmin, async (req, res) => {
    try {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM user_answer WHERE user_id = ($1)', [req.body.kayttajaId])
        await pool.query('DELETE FROM käyttäjä WHERE id = ($1)', [req.body.kayttajaId])
        await pool.query('COMMIT')
        res.status(200).send('Käyttäjän poisto onnistui')
    } catch (err) {
        console.log('err')
    }

})

router.post('/poistu', verifyToken, async (req, res) => {
    console.log('positutana')
    try {
        await pool.query('DELETE FROM refresh_token WHERE token = ($1)', [req.headers.token])
        await pool.query('UPDATE käyttäjä SET kirjauduttu = false WHERE kirjauduttu = true AND id = $1', [req.headers.kayttajaid])
        res.status(204).send('Kirjauduttu ulos onnistuneesti')
    } catch (err) {
        console.log(err, 'Ulos kirjautuminen epäonnistui')
    }
})

router.get('/hae-tulos', async (req, res) => {
    try {
        const maxPisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE question_id IN (SELECT id FROM question WHERE fk_exam_id = ($1)) AND oikein = true', [req.query.tenttiId])
        console.log(maxPisteet.rows)
        const valitutPisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE id IN (SELECT answer_id FROM user_answer WHERE user_id = ($1) AND exam_id = ($2)) AND oikein = true', [req.query.kayttajaId, req.query.tenttiId])
        const arvosana = Math.round(valitutPisteet.rows[0].count / maxPisteet.rows[0].count * 10)
        await pool.query('INSERT INTO finished_exam (user_id, exam_id, grade, date) VALUES ($1, $2, $3, $4)', [req.query.kayttajaId, req.query.tenttiId, arvosana, req.query.aika])
        console.log(arvosana)
        res.status(200).send({ maxPisteet: maxPisteet.rows[0].count, valitutPisteet: valitutPisteet.rows[0].count, arvosana: arvosana })
    } catch (err) {
        console.log(err)
        res.status(500).send('Tuloksen haku epäonnistui')
    }
})

router.get('/hae-suoritus', verifyToken, /* isAdmin, */ async (req, res) => {
    try {
        const suoritetut = await pool.query('SELECT (SELECT nimi FROM exam WHERE id = F.exam_id), grade, date FROM finished_exam F WHERE user_id = ($1)', [req.headers.kayttajaid])
        const suorittamattomat = await pool.query('SELECT nimi FROM exam WHERE NOT id in (SELECT exam_id FROM finished_exam WHERE user_id = ($1))', [req.headers.kayttajaid])
        console.log(req.decoded)
        res.status(200).send({ suoritetut: suoritetut.rows, suorittamattomat: suorittamattomat.rows })
    } catch (err) {
        console.log(err)
    }
})

router.post('/aseta-valinta', verifyToken, async (req, res) => {
    try {
        await pool.query('BEGIN')
        if (!req.body.valinta) {
            await pool.query('INSERT INTO user_answer (id, user_id, answer_id, question_id, exam_id) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM user_answer), 1), $1, $2, $3, $4)', [req.headers.kayttajaid, req.headers.vastausid, req.headers.kysymysid, req.headers.tenttiid])
        } else {
            await pool.query('DELETE FROM user_answer WHERE user_id = ($1) AND answer_id = ($2)', [req.headers.kayttajaid, req.headers.vastausid])
        }
        await pool.query('COMMIT')
        res.status(200).send('Valinnan asetus onnistui')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router