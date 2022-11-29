const express = require('express')
const router = express.Router()
const { Pool } = require('pg')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        console.log('filename:', file)
        cb(null, req.headers.kysymysid)
    }
})
const upload = multer({ storage: storage })

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

router.post('/lisaa-kuva', upload.single('image'), async (req, res) => {
    console.log(req)
    res.send('image uplaoded')
})

router.delete('/poista-kuva', async (req, res) => {
    try {
        console.log('hello')
        fs.readdir('./images', function (err, fileNames) {
            if (fileNames?.includes(req.body.kysymysId)) {
                fs.unlink(`./images/${req.body.kysymysId}`, (err => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Deleted file');
                    }
                }))
            }
        })
        res.status(200).send('Kuvan poisto onnistui')
    } catch (err) {
        console.log(err)
        res.status(404)
    }
})

/* router.get('/hae-kuva', async (req, res) => {
    try {
        let idData = await pool.query('SELECT id FROM question WHERE fk_exam_id = $1', [req.query.tenttiId])
        idData = idData.rows.map(id => id.id)
        let images = []
        let files = fs.readdirSync('./images')
        files.forEach(file => {
            if (idData.includes(file)) {
                let data = fs.readFileSync(`./images/${file}`)
                const b64 = Buffer.from(data).toString('base64');
                // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER
                const mimeType = 'image/png'; // e.g., image/png
                let obj = {}
                obj[file] = `"data:${mimeType};base64,${b64}"`
                images.push(obj)
                //console.log(obj)
            }
        });
        res.send(images)
    } catch (err) {
        res.status(404)
    }
}) */

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