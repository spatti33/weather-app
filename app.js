const express = require ("express");
const bodyParser = require ("body-parser");
const https = require ("https");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(__dirname));

app.get ("/", function (req, res) {
    res.render('index', {weather: ''});
});

app.post("/", function (req, res) {
    var city = req.body.cityName;
    const APIKey = "6f81853ade578660e6967840a3fd8490";
    var unit = req.body.inlineRadioOptions;
    var unitString
    if (unit === "imperial") {
        unitString = "Degrees F";
    } else {
        unitString = "Degrees C";
    }
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=" + unit + "&appid=" + APIKey;
    https.get(url, function (response) {
        response.on ("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const iconCode = weatherData.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            var string = "The temp in " + city + " is " + temp + " " + unitString + " with " + description + "!";
            res.render('index', {weather: string});
        });
    });
});

app.listen("3000", function () {
    console.log("Server is running on port 3000");
});