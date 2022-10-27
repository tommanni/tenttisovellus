const fs = require('fs');
const express = require('express')  //Jos ei toimi, niin "npm install express"
const app = express()
const port = 8080
const cors = require('cors')

app.use(cors())  //jos ei toimi, niin "npm install cors"
app.use(express.json());

app.get('/', (req, res) => {
    // tiedon luku asynkronisesti
    const getData = async () => {
        try {
            await fs.readFile('./tenttidata.json', 'utf-8', function (err, data) {
                res.send(data)
            })
        } catch (e) {
            console.log(e)
        }
    }
    getData()
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})