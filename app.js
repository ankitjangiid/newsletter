const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

// this is to check all files like images and css into a static folder called public 
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // this is object to store the data and to pass it to API
    // we can see how to store the data in API documentation
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    // this is to convert above js object into string
    const jsonData = JSON.stringify(data);

    const API = process.env.API_KEY;
    const LIST = process.env.LIST_ID;

    // this is the endpoint of API
    const url = "https://us2.api.mailchimp.com/3.0/lists/" + LIST;

    // this is a option method for authentication of API
    const options = {
        method: "POST",
        auth: API
    }

    // this is https request and it has been stored into const request so that we can post the data to API server by writing .write()
    const request = https.request(url, options, function (response) {

        // To check if our server is running properly
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        // this is to get the data and consol log it
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();

})

// To redirect the failure page to home page using a button
app.post("/failure", function (req, res) {
    res.redirect("/");
})


// prcess.env.PORT is used because now we're not running our code on local server
// We're running it on heroku server and it might create its own port
// So to set the port automatically according to heroku we use this code.
// Locally this won't work because 'process' object is automatically created by Heroku.

// We write 3000 because now we can also run it locally on 3000 port
// || is OR
app.listen(process.env.PORT || 3000, function () {
    console.log("Server Running");
});

// list id
// d4155bb520