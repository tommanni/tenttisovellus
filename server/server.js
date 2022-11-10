const fs = require('fs');
const { Pool, Client } = require('pg')
const express = require('express')  //Jos ei toimi, niin "npm install express"
const app = express()
const port = 8080
const cors = require('cors');
const { RestartAlt, ProductionQuantityLimits } = require('@mui/icons-material');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'examDB',
    password: 'admin',
    port: 5432,
})

app.use(cors())  //jos ei toimi, niin "npm install cors"
app.use(express.json());

app.get('/', (req, res) => {
    // tiedon luku asynkronisesti
    const haeTentit = async () => {
        try {
            let tenttiData = await pool.query("SELECT * FROM exam ORDER BY id")
            let tentit = tenttiData.rows
            for (let i = 0; i < tentit.length; i++) {
                let kysymykset = await pool.query("SELECT id, kysymys FROM question WHERE fk_exam_id = ($1) ORDER BY id", [Number(tentit[i].id)])
                tentit[i].kysymykset = kysymykset.rows
                for (let j = 0; j < tentit[i].kysymykset.length; j++) {
                    let vastaukset = await pool.query("SELECT id, vastaus, oikein, valinta FROM answer WHERE question_id = ($1) ORDER BY id", [Number(tentit[i].kysymykset[j].id)])
                    tentit[i].kysymykset[j].vastaukset = vastaukset.rows
                    //console.log('dsfs', tentit[i].kysymykset[j].vastaukset)
                }
            }
            const kayttajatData = await pool.query("SELECT id, kayttajatunnus, salasana, admin, kirjauduttu FROM käyttäjä")
            const kayttajat = kayttajatData.rows
            const kayttajaData = await pool.query("SELECT id, kayttajatunnus, salasana, admin, kirjauduttu FROM käyttäjä WHERE kirjauduttu = true")
            const kayttaja = kayttajaData.rows[0]
            const kayttajavastausData = await pool.query('SELECT id, user_id, answer_id, question_id, exam_id FROM user_answer ORDER BY id')
            const kayttajaVastaukset = kayttajavastausData.rows
            //console.log('kayttaja:', kayttajaData.rows[0])
            const rekisteröidytäänData = await pool.query('SELECT * FROM rekisteröidytään')
            const rekisteröidytään = rekisteröidytäänData.rows[0].rekisteröidytään
            res.send({ tentit: tentit, kayttajaVastaukset: kayttajaVastaukset, tallennetaanko: false, tietoAlustettu: false, kayttajat: kayttajat, naytaVastaukset: false, rekisteröidytään: rekisteröidytään, kayttaja: kayttaja === undefined ? {} : kayttaja, kirjauduttu: kayttaja === undefined ? false : true })
        } catch (error) {
            console.log('virhetilanne', error)
        }
        //pool.end()
    }
    haeTentit()
})
app.post('/', (req, res) => {
    // tiedon kirjoitus asynkronisesti  req.body antanee tarvittavan datan
    const writeData = async () => {
        const data = JSON.stringify(req.body)
        await fs.writeFile('./tenttidata.json', data, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("File written successfully");
            }
        })
        res.send('Hello World!')
    }
    writeData()
})

app.post('/lisaa-tentti', (req, res) => {
    const lisaaTentti = async () => {
        await pool.query("INSERT INTO exam (id, nimi, voimassa) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM EXAM), 1), '', false)")
    }
    lisaaTentti()
    res.send('hello world')
})

app.post('/lisaa-kysymys', (req, res) => {
    const lisaaKysymys = async () => {
        await pool.query("INSERT INTO question (id, fk_exam_id, kysymys) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM question), 1), ($1), '')", [req.body.tenttiIndex])
    }
    lisaaKysymys()
    res.send('hello world')
})

app.post('/lisaa-vastaus', (req, res) => {
    const lisaaVastaus = async () => {
        await pool.query("INSERT INTO answer (id, question_id, vastaus, oikein, valinta) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM answer), 1), ($1), '', false, false)", [req.body.kysymysId])
    }
    lisaaVastaus()
    res.send('hello world')
})

app.put('/tentin-nimi-muuttui', (req, res) => {
    const muutaTentinNimi = async () => {
        await pool.query('UPDATE exam SET nimi = ($1) WHERE id = ($2)', [req.body.nimi, req.body.tenttiId])
    }
    res.send('hello world')
    muutaTentinNimi()
})

app.put('/kysymyksen-nimi-muuttui', (req, res) => {
    const muutaKysymyksenNimi = async () => {
        await pool.query('UPDATE question SET kysymys = ($1) WHERE fk_exam_id = ($2) AND id = ($3)', [req.body.nimi, req.body.tenttiId, req.body.kysymysId])
    }
    res.send('hello world')
    muutaKysymyksenNimi()
})

app.put('/vastauksen-nimi-muuttui', (req, res) => {
    const muutaKysymyksenNimi = async () => {
        await pool.query('UPDATE answer SET vastaus = ($1) WHERE question_id = ($2) AND id = ($3)', [req.body.nimi, req.body.kysymysId, req.body.vastausId])
    }
    res.send('hello world')
    muutaKysymyksenNimi()
})

app.delete('/poista-tentti', (req, res) => {
    const poistaTentti = async () => {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM finished_exam WHERE exam_id = ($1)', [req.body.tenttiId])
        await pool.query('DELETE FROM user_answer WHERE exam_id = ($1)', [req.body.tenttiId])
        await pool.query('DELETE FROM answer WHERE question_id IN (SELECT id FROM question WHERE fk_exam_id = ($1))', [req.body.tenttiId])
        await pool.query('DELETE FROM question WHERE fk_exam_id = ($1)', [req.body.tenttiId])
        await pool.query('DELETE FROM exam WHERE id = ($1)', [req.body.tenttiId])
        await pool.query('UPDATE exam SET voimassa = true WHERE id = (SELECT MIN(id) FROM exam)')
        await pool.query('COMMIT')
    }
    poistaTentti()
    res.send('hello world')
})

app.delete('/poista-kysymys', (req, res) => {
    const poistaKysymys = async () => {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM user_answer WHERE question_id = (SELECT id FROM question WHERE kysymys = ($1) AND user_id = ($2))', [req.body.kysymys, req.body.userId])
        await pool.query('DELETE FROM answer WHERE question_id IN (SELECT id FROM question WHERE kysymys = ($1))', [req.body.kysymys])
        await pool.query('DELETE FROM question WHERE kysymys = ($1) AND fk_exam_id = ($2)', [req.body.kysymys, req.body.tenttiId])
        await pool.query('COMMIT')
    }
    res.send('hello world')
    poistaKysymys()
})

app.delete('/poista-vastaus', (req, res) => {
    const poistaVastaus = async () => {
        await pool.query('BEGIN')
        await pool.query('DELETE FROM user_answer where answer_id = (SELECT id FROM answer WHERE vastaus = ($1) AND user_id = ($2))', [req.body.vastaus, req.body.userId])
        await pool.query('DELETE FROM answer WHERE question_id = ($1) AND vastaus = ($2)', [req.body.kysymysId, req.body.vastaus])
        await pool.query('COMMIT')
    }
    res.send('hello world')
    poistaVastaus()
})

app.post('/lisaa-kayttaja', (req, res) => {
    const lisaaKayttaja = async () => {
        await pool.query('INSERT INTO käyttäjä (kayttajatunnus, salasana, admin, kirjauduttu) VALUES ($1, $2, -1, false)', [req.body.kayttajatunnus, req.body.salasana])
    }
    res.send('hello world')
    lisaaKayttaja()
})

app.post('/kirjaudu', (req, res) => {
    const kirjaudu = async () => {
        console.log(req.body.data)
        try {
            const kayttaja = req.body.data
            await pool.query('UPDATE käyttäjä SET kirjauduttu = true WHERE id = ($1)', [kayttaja.id])
        } catch (err) {
            console.log(err)
        }
    }
    kirjaudu()
})

app.post('/poistu', (req, res) => {
    const kirjauduUlos = async () => {
        try {
            await pool.query('UPDATE käyttäjä SET kirjauduttu = false WHERE kirjauduttu = true')
        } catch (err) {
            console.log(err)
        }
    }
    kirjauduUlos()
})

app.post('/rekisteroidytaan', (req, res) => {
    const rekisteröidytään = async () => {
        try {
            const data = req.body.data
            await pool.query('UPDATE rekisteröidytään SET rekisteröidytään = ($1)', [data])
        } catch (err) {
            console.log(err)
        }
    }
    rekisteröidytään()
})

app.put('/muuta-voimassa', (req, res) => {
    const muutaVoimassa = async () => {
        try {
            await pool.query('UPDATE exam SET voimassa = false WHERE id = ($1)', [req.body.vanhaTenttiId])
            await pool.query('UPDATE exam SET voimassa = true WHERE id = ($1)', [req.body.tenttiId])
        } catch (err) {
            console.log(err)
        }
    }
    res.send('Hello world')
    muutaVoimassa()
})

app.put('/vastaus-oikein', (req, res) => {
    const vaihdaOikein = async () => {
        try {
            await pool.query('UPDATE answer SET oikein = ($1) WHERE id = ($2)', [!req.body.oikein, req.body.vastausId])
        } catch (err) {
            console.log(err)
        }
    }
    res.send('Hello world')
    vaihdaOikein()
})

app.put('/aseta-valinta', (req, res) => {
    const asetaValinta = async () => {
        await pool.query('UPDATE answer SET valinta = ($1) WHERE id = ($2)', [!req.body.valinta, req.body.vastausId])
        if (!req.body.valinta) {
            await pool.query('INSERT INTO user_answer (id, user_id, answer_id, question_id, exam_id) OVERRIDING SYSTEM VALUE VALUES (COALESCE((SELECT MAX(id) + 1 FROM user_answer), 1), $1, $2, $3, $4)', [req.body.kayttajaId, req.body.vastausId, req.body.kysymysId, req.body.tenttiId])
        } else {
            await pool.query('DELETE FROM user_answer WHERE user_id = ($1) AND answer_id = ($2)', [req.body.kayttajaId, req.body.vastausId])
        }

    }
    res.send('Hello world')
    asetaValinta()
})

app.get('/hae-tulos', (req, res) => {
    const haeTulos = async () => {
        const maxPisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE question_id IN (SELECT id FROM question WHERE fk_exam_id = ($1))', [req.query.tenttiId])
        const pisteet = await pool.query('SELECT COUNT(*) FROM answer WHERE id IN (SELECT answer_id FROM user_answer WHERE user_id = ($1) AND exam_id = ($2)) AND oikein = true', [req.query.kayttajaId, req.query.tenttiId])
        console.log(maxPisteet.rows[0].count)
        res.send({ maxPisteet: maxPisteet.rows[0].count, pisteet: pisteet.rows[0].count })
    }
    haeTulos()
})

app.get('/onko-valittu', (req, res) => {
    const onkoValittu = async () => {
        const valittu = await pool.query('SELECT CASE WHEN id IN (SELECT answer_id FROM user_answer WHERE user_id = ($1)) THEN true ELSE false END FROM answer ORDER BY id', [req.query.kayttajaId])
        console.log(valittu.rows)
        res.send(valittu.rows)
    }
    onkoValittu()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})