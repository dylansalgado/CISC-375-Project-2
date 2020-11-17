function init() {

    var previous = document.getElementById("previousState");
    var next = document.getElementById("nextState");
    var home = document.getElementById("home");

    previous.addEventListener("click",prevData,false);
    next.addEventListener("click",nextData,false);
    home.addEventListener("click", homeData, false);

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
    let state = ['AK', 'AL','AR','AZ','CA','CO','CT','DC','DE', 'FL','GA','HI','IA','ID','IL', 'IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY']
    var stateVal = document.getElementById("previousState").value;
    var url;
    console.log(state.indexOf(stateVal));
    if(state.indexOf(stateVal)>0){
        url = 'http://localhost:8000/state/' + state[state.indexOf(stateVal)-1];
        window.location = url;
    }
}

function nextData(event) {
    let state = ['AK', 'AL','AR','AZ','CA','CO','CT','DC','DE', 'FL','GA','HI','IA','ID','IL', 'IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY']
    var stateVal = document.getElementById("nextState").value;
    var url;
    console.log(state.indexOf(stateVal));
    if(state.indexOf(stateVal)<50){
        url = 'http://localhost:8000/state/' + state[state.indexOf(stateVal)+1];
        window.location = url;
    }
   
    
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