const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        res.status(200).json({ success: false, message: "Error!Token was not provided." });
    }
    //Decoding the token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
    req.decoded = decodedToken
    next()
}

module.exports = {
    verifyToken
}