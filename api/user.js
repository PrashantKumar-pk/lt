const express = require('express');
const router = express.Router();

const user = require('./../models/user');

const bcrypt = require('bcrypt');

router.post('/signup',(req, res) => {
    let {name,email,password,dateOfBirth} = req.body;
 
    if (!name || !email || !password || !dateOfBirth) {
        return res.json({
            status: "FAILED",
            message: "Missing input fields!"
        });
    }
    name  = name.trim();
    email  = email.trim();
    password  = password.trim();
    dateOfBirth  = dateOfBirth.trim();

    if (name == "" || email=="" || password =="" ||dateOfBirth==""){
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    }else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    }else if(!new Date(dateOfBirth).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid date of Birth entered"
        })
    }else if(password.length<8){
        res.json({
            status: "FAILED",
            message: "Password length should be more than 7"
        })
    }else{
        //Checking if user exists
        user.find({email}).then(result => {
            if (result.length){
                res.json({
                    status: "FAILED",
                    message: "User with provided email already exists"
                })
            }else{ 

                const saltRounds = 10;
                bcrypt.hash(password,saltRounds).then(hashedPassword => {
                    const newUser = new user({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    });
                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "SignUp successful",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "Error occured while saving user account"
                        })
                    })

                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password"
                    })
                })

            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user!"
            })
        })
    }

})

router.post('/signin', (req,res) => {
    let {email,password} = req.body;
    email  = email.trim();
    password  = password.trim();
    if (email=="" || password =="" ){
        res.json({
            status: "FAILED",
            message: "Empty credentials!"
        });
    }else{
        user.find({email})
        .then(data => {
            if (data.length){
                const hashedPassword = data[0].password;
                bcrypt.compare(password,hashedPassword).then(result => {
                    if(result){
                        res.json({
                            status: "SUCCESS",
                            message: "SignIn successful",
                            data: data
                        })
                    }else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid Password entered!",
                        })

                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing passwords"
                    })

                })
            }else{
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }

})
module.exports = router ; 