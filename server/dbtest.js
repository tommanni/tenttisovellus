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
    pool.end()
}
//lisaaTentti()

const poistaTentti = async () => {
    try {
        await pool.query("DELETE FROM tentit WHERE id = 828474")
    } catch (error) {
        console.log('virhetilanne', error)
    }
    pool.end()
}
//poistaTentti()

const muokkaaTentti = async () => {
    try {
        await pool.query("UPDATE tentit SET name = 'Ruby' WHERE id = 828479")
    } catch (error) {
        console.log('virhetilanne', error)
    }
    pool.end()
}
//muokkaaTentti()

const haeTentit = async () => {
    try {
        const res = await pool.query("SELECT * FROM tentit ORDER BY name")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    pool.end()
}
//haeTentit()

const haeTentitID = async () => {
    try {
        const res = await pool.query("SELECT * FROM tentit WHERE id IN (828485,828486,828487)")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    pool.end()
}
//haeTentitID()
//pool.query('ALTER TABLE tentit ADD voimassa BOOLEAN')
//pool.query("DELETE FROM tentit")

const lisaaTentit = async () => {
    const text = 'INSERT INTO tentit (name, date, voimassa) VALUES ($1, $2, $3)'
    const kielet = ['HTML', 'CSS', 'Python', 'Java', 'JavaScript', 'Swift', 'C++', 'C#', 'R', 'Golang (Go)']
    try {
        for (let i = 0; i < 10; i++) {
            await pool.query(text, [kielet[i], ['2022', '10', i + 7].join('-'), Math.random() < 0.5])
        }
    } catch (error) {
        console.log('virhetilanne', error)
    }
    pool.end()
}
lisaaTentit()

const haeTentitPaivamaaralla = async () => {
    try {
        const res = await pool.query("SELECT name FROM tentit WHERE date < '2022-10-12'")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    pool.end()
}
//haeTentitPaivamaaralla()

const haeTentitJotkaVoimassa = async () => {
    try {
        const res = await pool.query("SELECT name,date FROM tentit WHERE voimassa")
        console.log('tentit:', res.rows)
    } catch (error) {
        console.log('virhetilanne', error)
    }
    pool.end()
}
//haeTentitJotkaVoimassa()
/* pool.query("DELETE FROM tentit", (err, res) => {
    console.log(err, res)
}) */

/* pool.query('SELECT name FROM public.tentit', (err, res) => {
    console.log(err, res.rows)
    pool.end()
}) */
