const { pool } = require('../pool')

const isAdmin = async (req, res, next) => {
    try {
        let result = await pool.query("SELECT * FROM käyttäjä WHERE id = $1 ", [req.decoded?.userId])
        let admin = result.rows[0].admin
        if (admin !== 1) {
            res.status(401).send("no access!")
            next()
        } else {
            next()
        }
        //res.send('Tais datan tallennus onnistua')    
    }
    catch (e) {
        console.log(e)
    }

}
module.exports = {
    isAdmin
}