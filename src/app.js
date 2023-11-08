const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const hbs =require("hbs");
require("./db/conn");
const bodyParser = require('body-parser');


const Register = require("./models/registers")

const static_path = path.join(__dirname , "../public");
const template_path = path.join(__dirname , "../templates/views");
const partial_path = path.join(__dirname , "../templates/partials");
//console.log(path.join(__dirname, "../public"));



app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);


app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req , res) => {
    res.render("register");
})



app.post("/register", async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password == confirmPassword) {
                const registerEmployee = new Register({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword,
                });

                const registered = await registerEmployee.save();
                console.log("Data saved successfully:", registered);
                res.status(201).render("index");
            }
        else {
            res.status(400).send("Password not matching.");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});




app.post("/delete", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    try {
        // Use Mongoose's deleteOne to delete a document based on name and email
        const result = await Register.collection.deleteOne({ name, email });

        if (result.deletedCount === 1) {
            // Document deleted successfully
            res.redirect("/");
        } else {
            // Document not found
            res.status(404).send("User record not found");
        }
    } catch (error) {
        // Handle any errors during deletion
        res.status(500).send("Error deleting user record: " + error.message);
    }
});


app.post("/edit", async (req, res) => {
    const currentName = req.body.currentName;
    const currentEmail = req.body.currentEmail;
    const newName = req.body.newName;
    const newEmail = req.body.newEmail;

    try {
        // Use Mongoose to find and update the user record based on current name and email
        const result = await Register.updateOne({ name: currentName, email: currentEmail }, { name: newName, email: newEmail });

        if (result.nModified === 1) {
            res.status("User record updated successfully");
            res.redirect("/");
        } else {
            // User record not found or not updated
            res.status(404).send("User record found or updated");
        }
    } catch (error) {
        // Handle any errors during editing
        res.status(500).send("Error editing user record: " + error.message);
    }
});


app.listen(port, () =>{
    console.log(`server is running at port no ${port}`);
})


