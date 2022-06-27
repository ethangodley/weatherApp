const locationEl = document.getElementById('input'); // stores element containing id input from html into variable locationEl
const curTimeEl = document.getElementById('todayTime'); // stores element containing id todayTime from html into variable curTimeEl
const curTempEl = document.getElementById('todayTemp'); // stores element containing id todayTemp from html into variable curTempEl
const curWindEl = document.getElementById('todayWind'); // stores element containing id todayWind from html into variable curWindEl
const curHumidityEl = document.getElementById('todayHumidity'); // stores element containing id todayHumidity from html into variable curHumidityEl
const uvEl = document.getElementById('todayUv'); // stores element containing id todayUv from html into variable uvEl
const cardEl = document.querySelectorAll('.card'); // stores all elements containing class card in variable cardEl
const dailyTemp = document.querySelectorAll("#temp"); // stores all elements containing id temp in variable dailyTemp
const dailyHumidity = document.querySelectorAll("#humidity"); // stores all elements containing id humidity in variable dailyHumidity
const dailyWind = document.querySelectorAll("#wind"); // stores all elements containing id wind in variable dailyWind
const dailyDate = document.querySelectorAll("#date"); // stores all elements containing id date in variable dailyDate
const dailyIcon = document.querySelectorAll("#icon"); // stores all elements containing id icon in variable dailyIcon

// function uses the user input to determine city and gets the longitude and latitude of that city using geocode API
function getGeoCode(event) {
    const requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+locationEl.value+"&limit=1&appid=1b3b16034189ea5a6560c677be7833f3"; // sets fetch url for API
    let longitude = 0; // initializes longitude variable
    let latitude = 0; // initializes latitude variable
    fetch(requestUrl) // fetches request URL and exectues .then functions
     .then(function (response){
         return response.json();
     }) 
     .then(function (data){
         longitude = data[0].lon; // sets longitude value using API
         latitude = data[0].lat; // sets latitude value using API
         const geoLocation = "lat="+latitude+"&lon="+longitude; // adds and formats longitude and latitude to url format and stores in geoLocation variable
         getCurrentWeather(geoLocation); // calls upon getCurrentWeather function which imports geoLocation variable
    })
}
// this function is still in progress and will store previous searches in local storage and display to DOM
/* function saveSearch(event) {
    const curSearch = locationEl.value;
    localStorage.setItem("save", curSearch);
    console.log(localStorage.getItem("save"));
    getGeoCode(); 
} */

// function gets current weather of selected city, imports geoLocation 
function getCurrentWeather(geoLocation) {
    // sets fetch request url using imported geoLocation
    const requestUrl = "https://api.openweathermap.org/data/2.5/onecall?"+ geoLocation +"&exclude=minutely,hourly&units=metric&appid=1b3b16034189ea5a6560c677be7833f3";
    fetch(requestUrl) // fetches API using url and executes .then functions
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        curTempEl.textContent += data.current.temp + " °C"; // gets temperature from API and displays to DOM
        curWindEl.textContent += data.current.wind_speed + " m/s"; // gets windspeed from API and displays to DOM
        curHumidityEl.textContent += data.current.humidity + " %"; // gets humidity from API and displays to DOM
        uvEl.textContent += data.current.uvi; // gets uv index from API and displays to DOM
        displayLocation(geoLocation); // calls upon display location function, importing geoLocation
    })
    getDailyWeather(geoLocation); // calls upon getDailyWeather function, importing geoLocation
}
// function displays forecasted weather for next 5 days importing geoLocation
function getDailyWeather(geoLocation) {
    //sets url for fetching api
    const requestUrl = "https://api.openweathermap.org/data/2.5/onecall?"+ geoLocation +"&exclude=minutely,hourly&units=metric&appid=1b3b16034189ea5a6560c677be7833f3";
    fetch(requestUrl) // fetches API using url and exectutes .then functions
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        for(let i = 0; i < 5; i++) { // for as long as i is less than 5 execute code within
            dailyDate[i].textContent = moment().add(i+1, 'day').format("DD MM YYYY"); // display date of weather forecast using moment.js
            let icon = data.daily[i+1].weather[0].icon; // sets icon id to variable icon from API
            $(dailyIcon[i]).find("img").attr("src", "http://openweathermap.org/img/wn/"+icon+"@2x.png"); // sets href attribute of img tag in dom to icon link
            dailyTemp[i].textContent = JSON.stringify(data.daily[i+1].temp.day) + " °C"; // gets future temp of [i] day from API and displays to dom
            dailyWind[i].textContent = JSON.stringify(data.daily[i+1].wind_speed) + " m/s"; // gets future wind speed of [i] day from API and displays to dom
            dailyHumidity[i].textContent = JSON.stringify(data.daily[i+1].humidity) + " %"; // gets future humidity of [i] day from API and displays to dom
        }
    })
}
// displays name of city to currentweather title importing geoLocation
function displayLocation(geoLocation) {
    const requestUrl = "http://api.openweathermap.org/geo/1.0/reverse?"+ geoLocation +"&limit=1&appid=1b3b16034189ea5a6560c677be7833f3"; // sets url for fetching api
    fetch(requestUrl) // fetches api using url and executes .then functions
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        curTimeEl.textContent = JSON.stringify(data[0].name) + " " + moment().format("DD MM YYYY"); // gets name of city from API and displays to DOM
    })
}

