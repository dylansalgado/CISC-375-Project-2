function init() {
    // TODO: add event listener for a click on the 'lookup' button
    //       should call the `getLocate()` function when clicked
    var previous = document.getElementById("previous");
    var next = document.getElementById("next");
    var home = document.getElementById("home");

    previous.addEventListener("click",prevData,false);
    next.addEventListener("click",nextData,false);
    home.addEventListener("click", homeData, false);

    // lookup.addEventListener("click",geoLocate,false) //when locate is clicked activate this
}

function checkvalue(val)
{
    var select = document.getElementById('view');
    var option;
    for (var i=0; i<select.options.length; i++) {
        option = select.options[i];
        option.selected = false;
        

        if (option.value == val) {
            console.log(option.selected);
            option.selected = true;
            console.log(option.selected);
            // return;
        } 
    }

    if(val==="state")
    {
        document.getElementById('yearSelect').style.display='none';
        document.getElementById('energySelect').style.display='none'; 
        document.getElementById('stateSelect').style.display='block';
    }
       
    else if(val == "year")
    {
        document.getElementById('stateSelect').style.display='none'; 
        document.getElementById('energySelect').style.display='none'; 
        document.getElementById('yearSelect').style.display='block'; 
    }

    else if(val == "energy")
    {
        document.getElementById('stateSelect').style.display='none'; 
        document.getElementById('yearSelect').style.display='none'; 
        document.getElementById('energySelect').style.display='block'; 
    }
       
}

function yearChanged(yearVal){  
    var selectA = document.getElementById('view');
    var select = document.getElementById('yearSelect');
    var optionA;
    var option;

    for (var i=0; i<selectA.options.length; i++) {
        optionA = selectA.options[i];
        optionA.selected = false;
        
        if (optionA.value == 'year') {
            console.log("The year selection is selected? " + optionA.selected);
            optionA.selected = true;
            console.log("The year selection is selected? " + optionA.selected);
        } 
    }

    for (var i=0; i<select.options.length; i++) {
        option = select.options[i];
        option.selected = false;
        
        if (option.value == yearVal) {
            console.log("The "+ yearVal +" year selection is selected? " + option.selected);
            option.selected = true;
            console.log("The "+ yearVal +" year selection is selected? " + option.selected);
        } 
    }

    window.location = 'http://localhost:8000/year/' + yearVal;
}

function stateChanged(stateVal){  
    window.location = 'http://localhost:8000/state/' + stateVal;
}

function energyChanged(energyVal){  
    window.location = 'http://localhost:8000/energy/' + energyVal;
}

function prevData(event) {
    var year = document.getElementById("previous").value;

    let prevYear = (parseInt(year)-1)
    let url = 'http://localhost:8000/year/' + prevYear;

    window.location = url; //replace url bar with this data
}

function nextData(event) {
    var year = document.getElementById("next").value;
    let url = 'http://localhost:8000/year/' + (parseInt(year)+1);
    window.location = url;
    // getResponse(url, (data)=>{
    //     document.write(data);
    // });
}

function homeData(event) {
    let url = 'http://localhost:8000/year/2018';
    window.location = url;
}

function getResponse(url, callback) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            let data = req.responseText;
            console.log(data);
            //document.getElementById("demo").innerHTML = req.responseText;
            callback(data);
        }
    }
    req.open("GET", url, true);
    req.send();

}