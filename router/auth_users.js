const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  username: "saad",
  password: "234"
}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let alreadyExist = users.find(user => user.username === username)

  return alreadyExist ? true : false
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

if(username && password) {

  let isAuthenticated = users.find(user => user.username === username && user.password === password)

  return isAuthenticated ? true : false
}
return false

}

//only registered users can login

regd_users.get("/",(req,res) => {

  res.status(200).json(users)

})
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password

  console.log(authenticatedUser(username,password))
  
  if(authenticatedUser(username,password)) {

    let accessToken = jwt.sign({
      data: password
    }, "access" , {expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken,username
    }

    return res.status(200).json({message:"User successfully login"})

  } else {

    return res.status(208).json({message: "Invalid Login: Check username and password"});

  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  let isbn = req.params.isbn

  console.log(req.session.authorization)

  if(req.session.authorization) {

    let username = req.session.authorization['username']

    const reviews = books[isbn].reviews

    console.log(reviews)

    res.status(200).json({message:"Review is submitted sucessfully"})
  } else {

    res.status(400).json({message:"Error while updating the review"})
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn",(req,res) => {
  let isbn = req.params.isbn

  if(req.session.authorization) {

    let username = req.session.authorization['username']

    const reviews = books[isbn].reviews

    delete reviews[username]

    res.status(200).json({message:"Review deleted successfully"})
  } else {

    res.status(400).json("Error while deleting the review")
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
