const { Pool, Client } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
})


const lisaaTentti = async () => {
    try {
        await pool.query("INSERT INTO tentit (name) VALUES ('Kotlinin perusteet')")
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
//lisaaTentti()

const poistaTentti = async () => {
    try {
        await pool.query("DELETE FROM tentit WHERE id = 828474")
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
//poistaTentti()

const muokkaaTentti = async () => {
    try {
        await pool.query("UPDATE tentit SET name = 'Rubyn perusteet' WHERE id = 828479")
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
//muokkaaTentti()

const haeTentit = async () => {
    try {
        const res = await pool.query("SELECT * FROM tentit ORDER BY name")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
//haeTentit()

const haeTentitID = async () => {
    try {
        const res = await pool.query("SELECT * FROM tentit WHERE id IN (828485,828486,828487)")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
//haeTentitID()
//pool.query('ALTER TABLE tentit ADD voimassa BOOLEAN')
//pool.query("DELETE FROM tentit")

const lisaaTentit = async () => {
    const text = 'INSERT INTO tentit (name, date, voimassa) VALUES ($1, $2, $3)'
    const kielet = ['HTML', 'CSS', 'Python', 'Java', 'JavaScript', 'Swift', 'C++', 'C#', 'R', 'Golang (Go)']
    try {
        for (let i = 7; i < 17; i++) {
            let date = ['2022', '10', i]
            let values = [kielet[i - 7], date.join('-'), Math.random() < 0.5]
            await pool.query(text, values)
        }
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
//lisaaTentit()

const haeTentitPaivamaaralla = async () => {
    try {
        const res = await pool.query("SELECT name FROM tentit WHERE date < '2022-10-12'")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
//haeTentitPaivamaaralla()

const haeTentitJotkaVoimassa = async () => {
    try {
        const res = await pool.query("SELECT name,date FROM tentit WHERE voimassa")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
}
haeTentitJotkaVoimassa()
/* pool.query("DELETE FROM tentit", (err, res) => {
    console.log(err, res)
}) */

/* pool.query('SELECT name FROM public.tentit', (err, res) => {
    console.log(err, res.rows)
    pool.end()
}) */
