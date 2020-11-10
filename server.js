// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');


let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'db', 'usenergy.sqlite3');

let app = express();
let port = 8000;

// open usenergy.sqlite3 database
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

app.use(express.static(public_dir)); // serve static files from 'public' directory


// GET request handler for home page '/' (redirect to /year/2018)
app.get('/', (req, res) => {
    res.redirect('/year/2018');
});

// GET request handler for '/year/*'
app.get('/year/:selected_year', (req, res) => {
    console.log(req.params.selected_year);
    fs.readFile(path.join(template_dir, 'year.html'),'utf-8' ,(err, data) => {
        // modify `template` and send response
        // this will require a query to the SQL database
    
        db.all("SELECT * FROM Consumption WHERE year = ?", [req.params.selected_year], (err, rows) => {
            //console.log(rows); // rows is an array with the result of the query
            if(err){
                res.status(404).type("plain");
                res.write("Error executing SQL query");
                res.end();
            }
            else{
                //console.log("success reading");
                res.status(200).type('html');
                let total_coal = 0;
                let total_natural_gas = 0;
                let total_nuclear_count = 0;
                let total_petroleum_count = 0;
                let total_renewable_count = 0;
                let year = req.params.selected_year;

                for (let i = 0; i < rows.length; i++) {
                    total_coal = total_coal + rows[i].coal;
                    total_natural_gas = total_natural_gas + rows[i].natural_gas;
                    total_nuclear_count = total_nuclear_count + rows[i].nuclear;
                    total_petroleum_count = total_petroleum_count + rows[i].petroleum;
                    total_renewable_count = total_renewable_count + rows[i].renewable;
                }
                let finalRes = data.replace('var coal_count', 'var coal_count = ' + total_coal);
                finalRes = finalRes.replace('var natural_gas_count', 'var natural_gas_count = ' + total_natural_gas);
                finalRes = finalRes.replace('var nuclear_count', 'var nuclear_count = ' + total_nuclear_count);
                finalRes = finalRes.replace('var petroleum_count', 'var petroleum_count = ' + total_petroleum_count);
                finalRes = finalRes.replace('var renewable_count', 'var renewable_count = ' + total_renewable_count);
                finalRes = finalRes.replace('var year', 'var year = ' + year);
                res.write(finalRes);
                res.end();
            }
        });
    });
});

// GET request handler for '/state/*'
app.get('/state/:selected_state', (req, res) => {
    console.log(req.params.selected_state);
    fs.readFile(path.join(template_dir, 'state.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        db.all("SELECT * FROM consumption WHERE state_abbreviation = ?", [req.params.selected_state], (err, rows) => {
            //console.log(rows); // rows is an array with the result of the query
            if(err){
                res.status(404).type("plain");
                res.write("Error executing SQL query");
                res.end();
            }
            else{
                res.status(200).type('html').send(rows);
                console.log("success reading");
                res.end();
            }
        });
    });
});

// GET request handler for '/energy/*'
app.get('/energy/:selected_energy_source', (req, res) => {
    console.log(req.params.selected_energy_source);
    fs.readFile(path.join(template_dir, 'energy.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database

        res.status(200).type('html').send(energy); // <-- you may need to change this
    });
});

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
