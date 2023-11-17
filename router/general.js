const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let myPromise = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve("Promise resolved")
  },1000)})

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(isValid(username)) {

    return res.status(400).json({message:"User Already Exist"})

  } 

  if(username && password) {

    users.push({username:username,password:password})

    res.status(200).json({message:"User successfully registered."})

  } else {

    res.status(400).json({message:"Unable to register the user. Please recheck the credentials"})
    
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {

  try {

       await myPromise

       res.status(200).json(books)

  }catch(err) {
    res.status(500).json({message:"Error while getting Books"})
  }

  

});

public_users.get('/isbn/:isbn',async function (req, res) {

  try{

    await myPromise

    const isbn = req.params.isbn
    res.status(200).json(books[isbn])
    
  }catch(err) {

    res.status(400).json({message:"Error while getting books by ISBN"})
  }
 });

public_users.get('/author/:author',async function (req, res) {

    try{

      const author = req.params.author

      let findByAuthor = Object.values(books).find(book => book.author === author)
    
      if(findByAuthor) {

        await myPromise
    
          res.status(200).json(findByAuthor)
      }else {
        res.status(400).json({message:"Error while getting book"})
      }
  
      
    }catch(err) {
  
      res.status(400).json({message:err.message})
    }

});

public_users.get('/title/:title',async function (req, res) {


  try{

    await myPromise

    let title = req.params.title

    let findByTitle = Object.values(books).find(book => book.title === title)
  
    res.status(200).json(findByTitle)

    
  }catch(err) {

    res.status(400).json({message:"Error while getting books by ISBN"})
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn

  const reviews = books[isbn].reviews

  res.status(200).json(reviews)

});

module.exports.general = public_users;
