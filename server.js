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
        // modify `template` and send finalRes
        // this will require a query to the SQL database
    
        db.all("SELECT * FROM Consumption WHERE year = ?", [req.params.selected_year], (err, rows) => {
            //console.log(rows); // rows is an array with the result of the query
            if(err){
                res.status(404).type("txt");
                res.write("Error executing SQL query");
                res.end();
            }
            else if(rows.length == 0){
                //res.status(404).type("plain");
                res.status(404).type("txt");
                res.write("Error: no data for year " + req.params.selected_year);
                res.end();
            }
            else{
                console.log("success reading sql queries");
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
                finalRes = finalRes.replace('<h1> year </h1>', '<h1>' + year + ' Energy Consumption in the U.S.'+ '</h1>');

                for (let i = 0; i < rows.length; i++) {
                    var count = 0;
                    for ([key, value] of Object.entries(rows[i])) {
                        //console.log(key, value);
                        if(key == "state_abbreviation"){
                            finalRes = finalRes.replace('S'+i, value );
                        }

                        if(key == "coal"){
                            finalRes = finalRes.replace('C'+i, value );
                            count = count + value;
                        }

                        if(key == "natural_gas"){
                            finalRes = finalRes.replace('NA'+i, value );
                            count = count + value;
                        }

                        if(key == "nuclear"){
                            finalRes = finalRes.replace('NU'+i, value );
                            count = count + value;
                        }

                        if(key == "petroleum"){
                            finalRes = finalRes.replace('P'+i, value );
                            count = count + value;
                        }

                        if(key == "renewable"){
                            finalRes = finalRes.replace('R'+i, value );
                            count = count + value;
                        }
                    }
                    finalRes = finalRes.replace('T'+i, count );
                }

                res.write(finalRes);
                res.end();
            }
        });
    });
});

// GET request handler for '/state/*'
app.get('/state/:selected_state', (req, res) => {
    // console.log(req.params.selected_state);
    fs.readFile(path.join(template_dir, 'state.html'),'utf-8' ,(err, data) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        db.all("SELECT * FROM consumption WHERE state_abbreviation = ?", [req.params.selected_state], (err, rows) => {
            // console.log(rows); // rows is an array with the result of the query
            if(err){
                res.status(404).type("txt");
                res.write("Error executing SQL query");
                res.end();
            }
            else if(rows.length == 0){
                //res.status(404).type("plain");
                res.status(404).type("txt");
                res.write("Error: no data for State " + req.params.selected_state);
                res.end();
            }
            else{
                res.status(200).type('html');
                let coal_array = [];
                let natural_gas_array = [];
                let nuclear_array = [];
                let petroleum_array = [];
                let renewable_array = [];
                let year_total = [];
                let years_array = [];
                let state = req.params.selected_state;

            let stateName = {
                        "AL":'Alabama',
                        "AK":'Alaska',
                        "AZ":'Arizona',
                        "AR":'Arkansas',
                        "CA":'California',
                        "CO":'Colorado',
                        "CT":'Connecticut',
                        "DE":'Delaware',
                        "DC":'District Of Columbia',
                        "FL":'Florida',
                        "GA":'Georgia',
                        "HI":'Hawaii',
                        "ID":'Idaho',
                        "IL":'Illinois',
                        "IN":'Indiana',
                        "IA":'Iowa',
                        "KS":'Kansas',
                        "KY":'Kentucky',
                        "LA":'Louisiana',
                        "ME":'Maine',
                        "MD":'Maryland',
                        "MA":'Massachusetts',
                        "MI":'Michigan',
                        "MN":'Minnesota',
                        "MS":'Mississippi',
                        "MO":'Missouri',
                        "MT":'Montana',
                        "NE":'Nebraska',
                        "NV":'Nevada',
                        "NH":'New Hampshire',
                        "NJ":'New Jersey',
                        "NM":'New Mexico',
                        "NY":'New York',
                        "NC":'North Carolina',
                        "ND":'North Dakota',
                        "OH":'Ohio',
                        "OK":'Oklahoma',
                        "OR":'Oregon',
                        "PA":'Pennsylvania',
                        "RI":'Rhode Island',
                        "SC":'South Carolina',
                        "SD":'South Dakota',
                        "TN":'Tennessee',
                        "TX":'Texas',
                        "UT":'Utah',
                        "VT":'Vermont',
                        "VA":'Virginia',
                        "WA":'Washington',
                        "WV":'West Virginia',
                        "WI":'Wisconsin',
                        "WY":'Wyoming'
            }




                for (let i = 0; i < rows.length; i++) {
                    var current_year = i + 1960;
                    year_total.push(rows[i].coal + rows[i].natural_gas + rows[i].nuclear + rows[i].nuclear + rows[i].petroleum + rows[i].renewable);
                    coal_array.push(rows[i].coal/year_total[i]);
                    natural_gas_array.push(rows[i].natural_gas/year_total[i]);
                    nuclear_array.push(rows[i].nuclear/year_total[i]);
                    petroleum_array.push(rows[i].petroleum/year_total[i]);
                    renewable_array.push(rows[i].renewable/year_total[i]);
                    years_array.push(current_year);
                }
                finalRes = data.replace('var coal_counts', 'var coal_counts = [' + coal_array + ']');
                finalRes = finalRes.replace('var natural_gas_counts', 'var natural_gas_counts = [' + natural_gas_array + ']');
                finalRes = finalRes.replace('var nuclear_counts', 'var nuclear_counts = [' + nuclear_array + ']');
                finalRes = finalRes.replace('var petroleum_counts', 'var petroleum_counts = [' + petroleum_array + ']');
                finalRes = finalRes.replace('var renewable_counts', 'var renewable_counts = [' + renewable_array + ']');
                finalRes = finalRes.replace('var years_array', 'var years_array = [' + years_array + ']');
                finalRes = finalRes.replace("var state", 'var state = ' + '"' + state + '"');

                for ([key, value] of Object.entries(stateName)) {
                    if(state == key){
                        finalRes = finalRes.replace("var stateFull", 'var stateFull = ' + '"' + value + '"');
                        finalRes = finalRes.replace('<h1> State </h1>', '<h1>' + value + ' Energy Consumption from 1960 to 2018</h1>');
                    }
                }

                for (let i = 0; i < rows.length; i++) {
                    for ([key, value] of Object.entries(rows[i])) {
                        // console.log(key, value);
                        let current_year = 1960 + i;

                        finalRes = finalRes.replace('T'+current_year, year_total[i] );

                        if(key == "coal"){
                            finalRes = finalRes.replace('C'+current_year, value );
                        }

                        if(key == "natural_gas"){
                            finalRes = finalRes.replace('NA'+current_year, value );
                        }

                        if(key == "nuclear"){
                            finalRes = finalRes.replace('NU'+current_year, value );
                        }

                        if(key == "petroleum"){
                            finalRes = finalRes.replace('P'+current_year, value );
                        }

                        if(key == "renewable"){
                            finalRes = finalRes.replace('R'+current_year, value );
                        }
                    }
                }
                // console.log(finalRes);
                res.write(finalRes);
                res.end();
            }
        });
    });
});


// GET request handler for '/energy/*'
app.get('/energy/:selected_energy_source', (req, res) => {
    console.log(req.params.selected_energy_source);
    fs.readFile(path.join(template_dir, 'energy.html'), (err, template) => {
            let energyTypeSelected = '';
            energyTypeSelected = req.params.selected_energy_source;
            energyTypeSelected = energyTypeSelected.toString();

            let finalRes = template.toString().replace('var energy_type', 'var energy_type = ' +  "'" + energyTypeSelected + "'");

            db.all('SELECT * FROM Consumption ORDER BY state_abbreviation,year', (err, rows) => {
                if(err){
                    res.status(404).type("txt");
                    res.write("Error executing SQL query");
                    res.end();
                }

                else if(rows.length == 0){
                    res.status(404).type("txt");
                    res.write("Error: no data for energy " + req.params.selected_energy_source);
                    res.end();
                }

                else{
                    let key = '';
                    let energyObject = {};

                    let i = 0;
                    while (i < rows.length) {
                        const energyValue = [];
                        key = rows[i].state_abbreviation;
                        let curState = key;

                        while (curState === key) {
                            energyValue.push(rows[i][energyTypeSelected]);
                            i++;
                            if (i < rows.length) {
                                curState = rows[i].state_abbreviation;
                            } else {
                                curState = '';
                            }
                        }
                        energyObject[key] = energyValue;
                    }

                    finalRes = finalRes.replace('var energy_counts', 'var energy_counts = ' + JSON.stringify(energyObject));
                    finalRes = finalRes.replace('<h1> energy_type </h1>', '<h1> ' + req.params.selected_energy_source  + ' Yearly Energy Consumption For Each State'+'</h1>')

                    let dataResult = '';
                    let data = 0;
                    i = 0;
                    let j = 0;
                    while (i < 59) {
                        dataResult += '<tr><td>' + rows[i].year + '</td>';
                        j = i;
                        let k = 0;
                        while (k < 51) {
                            
                            data = rows[j][energyTypeSelected];
                            dataResult += '<td>' + data + '</td>';
                            j += 59;
                            k++;
                        }
                        i++;
                    }
                    finalRes = finalRes.replace('<td>{{DATA}}</td>', dataResult);
                    res.write(finalRes);
                    res.end();
                }
            });
    });
});

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});

