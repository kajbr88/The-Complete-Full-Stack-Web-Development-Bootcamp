const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {  //merge field is an object 
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/4836395945";

    const options = {
        method: "POST",
        auth: "abhijeet1:a57f2ab726dc97edb5c3af70d88ed4da-us21"
    }

    // const request = https.request(url, options, function (response) {

    //     if (response.statusCode === 200) {
    //         res.sendFile(__dirname + "/success.html");
    //     }
    //     else { 
    //         res.sendFile(__dirname + "/failure.html");
    //     }
    //     response.on("data", function (data) {
    //         console.log(JSON.parse(data));
    //     })
    // })

    const request = https.request(url, options, function(response) {
        let data = ''; // Initialize an empty string to store the response
    
        response.on('data', function(chunk) {
            data += chunk; // Append each chunk of data as it's received
        });
    
        response.on('end', function() {
            try {
                const jsonData = JSON.parse(data); // Parse the complete response
                console.log(jsonData);
                // ... (handle the parsed data)
                if (response.statusCode === 200) {
                    res.sendFile(__dirname + "/success.html");
                } else {
                    res.sendFile(__dirname + "/failure.html");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });
    

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(rep, res) { // route for failure route which is (res.redirect("/");)aka home route.
    res.redirect("/"); //completion handler that redirects the user to the home route.
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is runing on port 3000");
}
);

//api key = a57f2ab726dc97edb5c3af70d88ed4da-us21
// List id = 4836395945 