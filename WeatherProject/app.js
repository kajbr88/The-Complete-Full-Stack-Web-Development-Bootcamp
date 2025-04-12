// const express = require("express");
// const https = require("https");
// const bodyParser = require("body-parser")

// const app = express(); // initiallises new express app

// app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

// app.post("/", function (req, res) {
//     const query = req.body.cityName;
//     const apiKey = "69b333152c71b54c1846d59b62a7482d";
//     const unit = "metric";
//     const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

//     https.get(url, function (response) {
//         console.log(response.statusCode);

//         response.on("data", function (data) {
//             const weatherData = JSON.parse(data)
//             const temp = weatherData.main.temp
//             const weatherDescription = weatherData.weather[0].description
//             const icon = weatherData.weather[0].icon
//             const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
//             res.write("<p>The weather is currently " + weatherDescription + "<p>");
//             res.write("<h1>The temperature in "+ query +" is " + temp + " degrees Celcius.</h1>")
//             res.write("<img src=" + imageURL + ">");
//             res.send();
//         })
//     })
// })



// app.listen(3000, function () {
//     console.log("Server is running on port 3000.")
// })




const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = "69b333152c71b54c1846d59b62a7482d";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        let weatherData = ""; // Initialize empty data string.

        response.on("data", function (data) {
            weatherData += data; // Append data chunks.
        });

        response.on("end", function () {
            try {
                const parsedWeatherData = JSON.parse(weatherData);
                const temp = parsedWeatherData.main.temp;
                const weatherDescription = parsedWeatherData.weather[0].description;
                const icon = parsedWeatherData.weather[0].icon;
                const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Weather Report</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background: linear-gradient(135deg, #6190E8, #A7BFE8);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                color: #333;
                                text-align: center;
                            }
                            .weather-container {
                                background-color: rgba(255, 255, 255, 0.9);
                                padding: 40px;
                                border-radius: 15px;
                                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                            }
                            h1 {
                                color: #4A90E2;
                                margin-bottom: 20px;
                            }
                            p {
                                font-size: 1.2em;
                                margin-bottom: 20px;
                            }
                            img {
                                margin-top: 20px;
                                max-width: 100px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="weather-container">
                            <p>The weather is currently ${weatherDescription}.</p>
                            <h1>The temperature in ${query} is ${temp} degrees Celsius.</h1>
                            <img src="${imageURL}" alt="Weather Icon">
                        </div>
                    </body>
                    </html>
                `);
            } catch (error) {
                console.error("Error parsing weather data:", error);
                res.send("<h1>Error fetching weather data. Please try again.</h1>");
            }
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});