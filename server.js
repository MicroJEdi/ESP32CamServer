
const path = require('path')

const defaultRoutes = require( path.resolve( __dirname, "./routes/default.js" ) )
const cameraRoutes = require( path.resolve( __dirname, "./routes/camera.js" ) )
const imageRoutes = require( path.resolve( __dirname, "./routes/image.js" ) )
const rssiRoutes = require( path.resolve( __dirname, "./routes/rssi.js" ) )

const mongoose = require("mongoose")
const connectionString = 'mongodb://localhost:27017/'
const databaseName = 'ESP32Photogrammetry'

const bodyParser = require('body-parser')

const express = require('express')
const app = express()
const router = express.Router();
const port = 3000

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())

// use express router
app.use('/',router)
defaultRoutes(router)
cameraRoutes(router)
imageRoutes(router)
rssiRoutes(router)

mongoose.connect(connectionString+databaseName, { useNewUrlParser: true }).then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})
