const express = require('express');
var app = express();

app.get("/", function (req, res) {
    res.send("<h1>Hello, World!");
});

app.get("/contact", function (req, res) {
    res.send("Contact me at: abhkb777@gmail.com");
});

app.get("/about", function (req, res) {
    res.send("My name is Abhijeet and I like beer and code");
}); 

app.get("/hobbies", function (req, res) {
    res.send("<ul><li>Coffee</li><li>Code</li><li>Beer</li></ul>");
}); 

// app.post('/hello', function(req, res){
//    res.send("You just called the post method at '/hello'!\n");
// });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});  