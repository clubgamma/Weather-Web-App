const apikey = "a34e076d1c28a538a2209f6035f82208";

const weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri ";
weekday[6] = "Sat";
let table = '';

var months = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];

var now= new Date();
var month = months[now.getMonth()+1];
var day = now.getDay();
var year = now.getFullYear();

function KtoC(temp){
    return Math.floor(temp-273.15)
}

function putinCity(cityname,currtemp){
    city.innerHTML = cityname;
    currtemp = KtoC(currtemp);
    temp.innerHTML = currtemp+'&#8451;';
}

function hourlyTemp(city,data,firstData){
    let d = new Date();
    let n = d.getHours();   
    putinCity(city,firstData);
    table+=`<tr>`;
    table+=`<th class="col">Now</th>`;
    for (i=0; i<n; i++) {
        table+=`<th class='col'>`+i+`:00</td>`;
    }
    table+=`</tr>`;                
    for (i=0; i<n+1; i++) {
        let iconweather = data[i].weather[0].icon;        
        table+=`<td><img src=http://openweathermap.org/img/wn/${iconweather}@2x.png alt="" srcset=""></td>`;
    }
    table+=`</tr><tr><td>`+KtoC(firstData)+'&#8451;'+`</td>`;
    for (i=1; i<n+1; i++) {
        table+=`<td>`+KtoC(data[i].temp)+'&#8451;'+`</td>`;
    }
    let mini=1000;
    let maxi=-1000;
    for (i=0; i<data.length; i++) {
        mini=Math.min(mini,data[i].temp);
        maxi=Math.max(maxi,data[i].temp);
    }
    document.getElementById("maxTemp").innerHTML = KtoC(maxi);
    document.getElementById("minTemp").innerHTML = KtoC(mini);
    document.getElementById("tablebody").innerHTML = table;

}

async function getWeather(city){
    const weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`);
    const res = await weather.json();
    return res.weather;        
}

function dailyTemp(city,data,firstData){
    // putinDays(city,firstData);
    let tt="<th scope='col'>Today</th>";
    let existDay = weekday[day];    
    let inx=0,cnt=0;
    weekday.forEach((ele)=>{        
        cnt++;
        if(ele==existDay){  
            inx=cnt;
        }else{
            tt+=`<th scope='col'>`+ele+`</th>`;
        }
    })    
    document.getElementById("daystoDisplay").innerHTML = tt;
    let xt="";
    xt+=`<tr>`;    
    let micon;
    for (i=0; i<weekday.length; i++) {
        let iconweather = data[i].weather[0].icon;
        xt+=`<td><img src=http://openweathermap.org/img/wn/${iconweather}@2x.png alt="" srcset=""></td>`;
    }
    xt+=`</tr><tr><td>`+KtoC(firstData)+'&#8451;'+`</td>`;
    for (i=0; i<weekday.length; i++) {
        if(i==inx){}
        else xt+=`<td>`+KtoC(data[i].temp.day)+'&#8451;'+`</td>`;
    }
    document.getElementById("tablebody2").innerHTML = xt;

}

async function url(city) {    
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`)
    const jsonData = await res.json();
    console.log(jsonData);
    const lat = jsonData[0].lat;
    const lon = jsonData[0].lon;
    const response = await fetch( `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apikey}`)
    let myJson = await response.json();  
    let mainicon = myJson.current.weather[0].main;
    document.getElementById('situation').innerHTML = mainicon;
    let imgsrc = myJson.current.weather[0].icon;
    let image = `<img src=http://openweathermap.org/img/wn/${imgsrc}@2x.png alt="" srcset="">`
    document.getElementById('imglogo').innerHTML = image;
    hourlyTemp(city,myJson.hourly,myJson.current.temp) ;
    dailyTemp(city,myJson.daily,myJson.current.temp);       
}

// Getting city from the input using Session
let city = sessionStorage.getItem('cityName');
url(city);

document.getElementById('herecity').innerHTML = city;
let name_title = "Weather of "+city;
document.getElementById('webpage-title').innerHTML = name_title;
