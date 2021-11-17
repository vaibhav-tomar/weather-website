const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast') 

const app = express()

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to save
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather App',
        name: 'vaibhav Tomar'
    })
})

app.get("/help", (req, res) => {
    res.render('help',{
        helpText: 'Please help me i am dyyyiiinngggg!!',
        title: "Help",
        name: "Vaibhav tomar"
    })
})

app.get("/about", (req, res) => {
    res.render('about',{
        title: 'About me',
        name: 'vaibhav tomar'
    })
})

app.get("/weather", (req, res) => {
    if(!req.query.address){
       return res.send({
            error: "you must provide an address"
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location}={}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) =>{
            if(error){
                res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address

            })
        })
    })
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        title: "404",
        name: "vaibhav",
        error: "Help article not found"
    })
})

app.get("*", (req,res) => {
    res.render('404',{
        title: "404",
        name: "vaibhav",
        error: "page not found"
    })
})

app.listen(3000, () => {
    console.log("Server is up on port 3000!")
})

