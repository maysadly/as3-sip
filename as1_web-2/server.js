const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const path = require("path");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/calculate", (req, res) => {
    const { weight, height, age, gender } = req.body;
    
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.send("Invalid input. Please provide valid weight and height.");
    }

    const bmi = weight / (height * height);
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 18.5 && bmi <= 24.9) category = "Normal weight";
    else if (bmi >= 25 && bmi <= 29.9) category = "Overweight";
    else category = "Obesity";

    req.session.userData = { weight, height, age, gender, bmi, category };
    res.cookie("userData", JSON.stringify({ weight, height, age, gender }), 
    { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BMI Result</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="container">
        <h1>Your BMI: ${bmi.toFixed(2)}</h1>
        <p>Category: ${category}</p>
        <p>Age: ${age}</p>
        <p>Gender: ${gender}</p>
        
        <h3>Health Tips:</h3>
        <ul>
            <li>Underweight: You may need to gain weight for better health. Consider a balanced diet and consulting a healthcare professional.</li>
            <li>Normal weight: Keep up your healthy lifestyle with a balanced diet and regular exercise.</li>
            <li>Overweight: Consider adopting a healthier diet and increasing physical activity.</li>
            <li>Obesity: It's important to consult with a healthcare professional for personalized advice.</li>
        </ul>
        <a href="/">Go back</a>
    </div>
</body>
</html>`);
});

app.get("/previous", (req, res) => {
    const userData = req.session.userData;
    res.send(userData ? `Your last input: Weight - ${userData.weight}, Height - ${userData.height}, 
    Age - ${userData.age}, Gender - ${userData.gender}, BMI - ${userData.bmi.toFixed(2)}, 
    Category - ${userData.category}` : "No previous data found.");
});


app.get("/session-id", (req, res) => {
    res.send(`Session ID: ${req.sessionID}`);
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
