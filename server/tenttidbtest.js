const { Pool, Client } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'examDB',
    password: 'admin',
    port: 5432,
})

const lisaaTentti = async () => {
    try {
        await pool.query("INSERT INTO exam (name) VALUES ('Kotlinin perusteet')")
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
//lisaaTentti()

const poistaTentti = async () => {
    try {
        await pool.query("DELETE FROM exam WHERE id = 2")
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
//poistaTentti()

const muokkaaTentti = async () => {
    try {
        await pool.query("UPDATE exam SET name = 'Rubyn perusteet' WHERE id = 3")
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
//muokkaaTentti()

const haeTentit = async () => {
    try {
        let tenttiData = await pool.query("SELECT * FROM exam ORDER BY nimi")
        let tentit = tenttiData.rows
        for (let i = 0; i < tentit.length; i++) {
            let kysymykset = await pool.query("SELECT id, question FROM question WHERE fk_exam_id = ($1)", [Number(tentit[i].id)])
            tentit[i].kysymykset = kysymykset.rows
            for (let j = 0; j < tentit[i].kysymykset.length; j++) {
                let vastaukset = await pool.query("SELECT id, vastaus, oikein, valinta FROM answer WHERE question_id = ($1)", [Number(tentit[i].kysymykset[j].id)])
                tentit[i].kysymykset[j].vastaukset = vastaukset.rows
                //console.log('dsfs', tentit[i].kysymykset[j].vastaukset)
            }
        }
        const kayttajatData = await pool.query("SELECT id, kayttajatunnus, salasana, admin FROM käyttäjä")
        const kayttajat = kayttajatData.rows
        const kayttajaData = await pool.query("SELECT id, kayttajatunnus, salasana, admin FROM käyttäjä WHERE kirjauduttu = true")
        const kayttaja = kayttajaData.rows[0]
        console.log({ tentit: tentit, tallennetaanko: false, tietoAlustettu: false, kayttajat: kayttajat, naytaVastaukset: false, rekisteröidytään: false, kayttaja: kayttaja === undefined ? {} : kayttaja, kirjauduttu: kayttaja === undefined ? false : true })
        console.log('users', kayttaja)
        //console.log('tentit:', tentit)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
haeTentit()

const lisaaSuoritus = async () => {
    try {
        await pool.query("INSERT INTO finished_exam (user_id, exam_id, points) VALUES (1, 1, (SELECT COUNT(*) FROM answer WHERE answer_id IN (SELECT answer_id FROM user_answer WHERE user_id =1) AND is_correct = true))")
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
//lisaaSuoritus()

const haeTenttiTulokset = async () => {
    try {
        const res = await pool.query("SELECT (SELECT name FROM käyttäjä WHERE id = finished_exam.user_id), (SELECT exam FROM exam WHERE id = finished_exam.exam_id), points FROM finished_exam ORDER BY name")
        console.log('tulokset:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
//haeTenttiTulokset()

const haeSuoritetutTentit = async () => {
    try {
        const res = await pool.query("SELECT (SELECT exam FROM exam WHERE id = finished_exam.exam_id) FROM finished_exam WHERE user_id = 1")
        console.log('suoritetut:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
//haeSuoritetutTentit()

const haeSuorittamattomatTentit = async () => {
    try {
        const res = await pool.query("SELECT exam FROM exam WHERE NOT id IN (SELECT exam_id FROM finished_exam WHERE user_id = 1)")
        console.log('suorittamattomat:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    //pool.end()
}
//haeSuorittamattomatTentit()

pool.end()

/* app.get('/', (req, res) => {
    // tiedon luku asynkronisesti
    const getData = async () => {
        try {
            const tentit = await pool.query('SELECT * FROM exam')
            const data = { tentit: tentit }
        } catch (e) {
            console.log(e)
        }
    }
    getData()
}) */