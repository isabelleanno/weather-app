//This is a lot of JavaScript. I will walk you through what everything does with these comments. First, we're going to start with general
//stuff like the dates and times. Since JavaScript already knows this based on your location, we do not need an API. There are two API's used
//in this weather app. One is for the current weather, and one is for the forecast.
//Gets the current dates and times
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let currentDay = document.querySelector("#day");
currentDay.innerHTML = `It is ${day},`;
//hourChange converts 24 hour format to am/pm
function hourChange(event) {
  if (time === 24) {
    currentTime.innerHTML = `<i class="far fa-clock"></i>  ${hour}:${minute}`;
    time = 12;
  } else {
    currentTime.innerHTML = `<i class="far fa-clock"></i>  ${now.toLocaleString(
      "en-US",
      { hour: "numeric", minute: "numeric", hour12: true }
    )}`;
    time = 24;
  }
}
let time = 24;
let clock = document.querySelector("#time");
clock.addEventListener("click", hourChange);
let hour = [now.getHours()];
let minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
let month = [now.getMonth() + 1];
let date = [now.getDate()];
let year = [now.getFullYear()];
let currentDate = document.querySelector("#date");
currentDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${month}/${date}/${year}`;
let currentTime = document.querySelector("#time");
currentTime.innerHTML = `<i class="far fa-clock"></i>  ${hour}:${minute}`;
//Now we're getting into the first of two API's. This one deals with the current forecast. We start with a function called "convert" which does
// two important things: 1.) It generates the API url. and 2.) It is able to convert the units from fahrenheit to celsius when you click
//the "F" or "C" displayed on the screen. This function also converts the units for the forecast api, too using the same method,
//since "units" is a global variable, so I just grabbed it and used it twice.
let units = "";
function convert(event) {
  event.preventDefault();
  let place = document.querySelector("#place");
  let city = place.value;
  let currentCity = document.querySelector("#currentCity");
  currentCity.innerHTML = city;
  if (degreeButton.innerHTML === "C") {
    degreeButton.innerHTML = "F";
    units = "imperial";
  } else {
    degreeButton.innerHTML = "C";
    units = "metric";
  }
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=dde5f5b53a9878edbb3c8ca7477531b0`;
  axios
    .get(apiUrl)
    .then(showTemperature)
    .catch((error) => {
      alert("Please type a valid city");
    });
}
let degreeButton = document.querySelector("#degreeButton");
degreeButton.addEventListener("click", convert);
let form = document.querySelector("#cityName");
form.addEventListener("submit", convert);
//showTemperature gets the api from function convert and integrates it in the display.
function showTemperature(response) {
  let temperature = response.data.main.temp;
  temperature = Math.round(temperature);
  let temp = document.querySelector("#currentTemp");
  temp.innerHTML = `${temperature}°`;
  let feelsLike = response.data.main.feels_like;
  feelsLike = Math.round(feelsLike);
  let feels = document.querySelector("#feelsLike");
  feels.innerHTML = `Feels like: ${feelsLike}°`;
  let humidity = response.data.main.humidity;
  humidity = Math.round(humidity);
  let humid = document.querySelector("#humid");
  humid.innerHTML = `Humidity: ${humidity}%`;
  let getDescription = response.data.weather[0].description;
  let description = document.querySelector("#description");
  description.innerHTML = `${getDescription}`;
  getForecast(response.data.coord);
  let icon = document.querySelector(".icon");
  icon.innerHTML = weatherIcons(
    response.data.weather[0].icon,
    response.data.weather[0].main
  );
}
//Now we're moving onto the forecast/future  portion of this app. We start with function "getForecast" (very original name) which generates
//the API and dstributes it to another function to display it.
function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiKey = `95aeb6a7ef6c41601b52d671db1e4f20`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(forecast);
}
//formatDay formats the timestamp given to us by the API.
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}
//forecast displays the innerHTML of our forecast.
function forecast(response) {
  let forecastDays = response.data.daily;
  let future = document.querySelector("#future");
  let weatherForecast = `<div class= "row">`;
  forecastDays.forEach(function (day, index) {
    if (index < 5) {
      weatherForecast =
        weatherForecast +
        `
      <div class="col">
      <div class ="card">
        <div class="card-body">
          <h6>${formatDay(day.dt)}</h6>
          <p class="future-temp" class="icon">
          ${weatherIcons(day.weather[0].icon, day.weather[0].main)}
          ${Math.round(day.temp.day)}°
          </p>
          <span>High: ${Math.round(day.temp.max)}°</span>
          <span>Low: ${Math.round(day.temp.min)}°</span>
          <span>Feels like: ${Math.round(day.feels_like.day)}°</span>
        </div>
      </div>
      </div>
      `;
    }
  });
  weatherForecast = weatherForecast + `</div>`;
  future.innerHTML = weatherForecast;
}
//weatherIcons generates the weather icon based on the description given by the API using a big ass if/else statement. I could have just used
//the icons given to me by the API, but I think fontAwesome's icons are cuter and go better with this app. This function is used by both the
//current weather stuff and by the forecast stuff.
function weatherIcons(weatherIcon, currentWeather) {
  let icon = "";
  if (weatherIcon === "01d") {
    icon = ` <i class="fas fa-sun"></i>`;
  } else if (weatherIcon === "01n") {
    icon = ` <i class="fas fa-moon"></i>`;
  } else if (currentWeather === "Clouds") {
    icon = `<i class="fas fa-cloud"></i>`;
  } else if (currentWeather === "Thunderstorm") {
    icon = `<i class="fas fa-bolt"></i>`;
  } else if (currentWeather === "Rain" || "Drizzle") {
    icon = `<i class="fas fa-cloud-showers-heavy"></i>`;
  } else if (currentWeather === "Snow") {
    icon = `<i class="far fa-snowflake"></i>`;
  } else if (weatherIcon === "02d") {
    icon = `<i class="fas fa-cloud-sun"></i>`;
  } else if (weatherIcon === "02n") {
    icon = `<i class="fas fa-cloud-moon"></i>`;
  } else {
    icon = `<i class="fas fa-smog"></i>`;
  }
  return icon;
}
