const express = require("express")
const accountRoutes = express.Router();
const fs = require('fs');

const dataPath = './data/scouters.json' 
let gamePath = '';

// util functions 

const saveScoutData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

const getScoutData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)    
}

function addNewGame(fileName)
{
    gamePath = './data/'+fileName+'.json';
    let newGame = {};
    newGame.match = 'Match 1';
    newGame.pregame = {};
    newGame.auton = {};
    newGame.telop = {};
    fs.writeFile(gamePath, JSON.stringify(newGame), function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });
}

function addScout(name, scout)
{
var existingScouts = getScoutData()
   
    existingScouts[name] = scout;
     
    console.log(existingScouts);

    saveScoutData(existingScouts);
}

/*
// reading the data
accountRoutes.get('/account', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });


  accountRoutes.post('/account/addaccount', (req, res) => {
   
    var existAccounts = getAccountData()
    const newAccountId = Math.floor(100000 + Math.random() * 900000)
   
    existAccounts[newAccountId] = req.body
     
    console.log(existAccounts);

    saveAccountData(existAccounts);
    res.send({success: true, msg: 'account data added successfully'})
})

// Read - get all accounts from the json file
accountRoutes.get('/account/list', (req, res) => {
  const accounts = getAccountData()
  res.send(accounts)
})

// Update - using Put method
accountRoutes.put('/account/:id', (req, res) => {
   var existAccounts = getAccountData()
   fs.readFile(dataPath, 'utf8', (err, data) => {
    const accountId = req.params['id'];
    existAccounts[accountId] = req.body;

    saveAccountData(existAccounts);
    res.send(`accounts with id ${accountId} has been updated`)
  }, true);
});

//delete - using delete method
accountRoutes.delete('/account/delete/:id', (req, res) => {
   fs.readFile(dataPath, 'utf8', (err, data) => {
    var existAccounts = getAccountData()

    const userId = req.params['id'];

    delete existAccounts[userId];  
    saveAccountData(existAccounts);
    res.send(`accounts with id ${userId} has been deleted`)
  }, true);
})*/
module.exports = {addScout, addNewGame}