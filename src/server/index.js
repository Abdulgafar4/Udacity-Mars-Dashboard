require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// Send information about the rover
app.get('/rovers', async (req, res) => {
    try {
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`
        let rovers = await fetch(url)
        rovers = await rovers.json();
        res.send(rovers)
    } catch (err) {
        console.log('error:', err);
    }
})

// Fetching images from NASA Apis
app.post('/fetchImage', async (req, res) => {
    try {
        const URL=`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.roverName}/photos?sol=1000&api_key=${process.env.API_KEY}`
        let data = await fetch(URL)
            .then(res => res.json())
            //send data
            res.send(data.photos)

    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))