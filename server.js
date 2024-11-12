const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;

app.use(cors( {
    origin: 'http://localhost:5173',
    methods: ['GET', "POST"],
}));

app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: '',      
    database: 'projectDB' 
  });

db.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.stack);
        return;
    }
    console.log('Połączono z bazą danych MySQL!');
});

app.get('/products', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Błąd zapytania SQL:', err);
            res.status(500).send('Błąd serwera');
            return;
        }
    res.json(results);
    });
});

app.get('/cart', (req, res) => {
    const query = 'SELECT * FROM cart';
    db.query(query, (err, result) => {
        if(err) {
            console.log("nie udalo sie")
            res.status(500).json({error: 'Wystapil blad podczas dodawania produktu'});
        }
        else {
            res.json(result);
        }
        
    });
});

app.post('/deleteProduct', (req, res) => {
    const id = req.body.id;
    console.log(id)
    const query = 'DELETE FROM cart WHERE id = ' + id; 
    console.log(query)
    db.query(query, (err, result) => {
        if(err) {
            console.log("nie udalo sie")
            res.status(500).json({error: 'Wystapil blad podczas usuwania produktu'});
            
        }
        else {
            console.log("udalo sie")
            res.status(200).json({message: 'Produkt zostal usuniety pomyslnie'});
            
        }
    });
});

app.post('/addProduct', (req, res) => {
    const {name, price, description, soldOut} = req.body;
    const query = 'INSERT INTO cart (`name`, `price`, `description`, `soldOut`) VALUES (' + "'" + name + "'" + ', ' + price.toFixed(2) + ', ' + "'" + description + "'" + ', ' + soldOut + ')'; 
    console.log(query)
    db.query(query, (err, result) => {
        if(err) {
            console.log(err)
            console.log("nie udalo sie")
            res.status(500).json({error: 'Wystapil blad podczas dodawania produktu'});
            
        }
        else {
            console.log("udalo sie")
            res.status(200).json({message: 'Produkt zostal dodany pomyslnie'});
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});