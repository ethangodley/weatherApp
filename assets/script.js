const locationEl = document.getElementById('input');
const curTimeEl = document.getElementById('todayTime');
const curTempEl = document.getElementById('todayTemp');
const curWindEl = document.getElementById('todayWind');
const curHumidityEl = document.getElementById('todayHumidity');
const uvEl = document.getElementById('todayUv');
const cardEl = document.querySelectorAll('.card');
const dailyTemp = document.querySelectorAll("#temp");
const dailyHumidity = document.querySelectorAll("#humidity");
const dailyWind = document.querySelectorAll("#wind");
const dailyDate = document.querySelectorAll("#date");
const dailyIcon = document.querySelectorAll("#icon");
const historyEl = document.getElementById("history");


function getGeoCode(event) {
    const requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+locationEl.value+"&limit=1&appid=1b3b16034189ea5a6560c677be7833f3";
    let longitude = 0;
    let latitude = 0;
    fetch(requestUrl)
     .then(function (response){
         return response.json();
     })
     .then(function (data){
         longitude = data[0].lon;
         latitude = data[0].lat;
         const geoLocation = "lat="+latitude+"&lon="+longitude;
         getCurrentWeather(geoLocation);
    })
}
/* function saveSearch(event) {
    const curSearch = locationEl.value;
    localStorage.setItem("save", curSearch);
    console.log(localStorage.getItem("save"));
    getGeoCode(); 
} */
function getCurrentWeather(geoLocation) {
    const requestUrl = "https://api.openweathermap.org/data/2.5/onecall?"+ geoLocation +"&exclude=minutely,hourly&units=metric&appid=1b3b16034189ea5a6560c677be7833f3";
    fetch(requestUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        curTempEl.textContent += data.current.temp + " °C";
        curWindEl.textContent += data.current.wind_speed + " m/s";
        curHumidityEl.textContent += data.current.humidity + " %";
        uvEl.textContent += data.current.uvi;
        displayLocation(geoLocation);
    })
    getDailyWeather(geoLocation);
}
function getDailyWeather(geoLocation) {
    const requestUrl = "https://api.openweathermap.org/data/2.5/onecall?"+ geoLocation +"&exclude=minutely,hourly&units=metric&appid=1b3b16034189ea5a6560c677be7833f3";
    fetch(requestUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        for(let i = 0; i < 5; i++) {
            dailyDate[i].textContent = moment().add(i+1, 'day').format("DD MM YYYY");
            let icon = data.daily[i+1].weather[0].icon;
            $(dailyIcon[i]).find("img").attr("src", "http://openweathermap.org/img/wn/"+icon+"@2x.png");
            dailyTemp[i].textContent = JSON.stringify(data.daily[i+1].temp.day) + " °C";
            dailyWind[i].textContent = JSON.stringify(data.daily[i+1].wind_speed) + " m/s";
            dailyHumidity[i].textContent = JSON.stringify(data.daily[i+1].humidity) + " %";
        }
    })
}
function displayLocation(geoLocation) {
    const requestUrl = "http://api.openweathermap.org/geo/1.0/reverse?"+ geoLocation +"&limit=1&appid=1b3b16034189ea5a6560c677be7833f3";
    fetch(requestUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        curTimeEl.textContent = JSON.stringify(data[0].name) + " " + moment().format("DD MM YYYY");
    })
}

