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

let hour = [now.getHours()];
let minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
let month = [now.getMonth() + 1];
let date = [now.getDate()];
let year = [now.getFullYear()];
let currentDate = document.querySelector("#date");
currentDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${month}/${date}/${year}`;
let currentTime = document.querySelector("#time");
currentTime.innerHTML = `<i class="far fa-clock"></i>  ${hour}:${minute}`;

//showTemperature uses the API generated from the function cityAlert
//to search for a city and display all the info from the API, including temperature, humidity, feels like, description, and icons.
//Basically, this funtion integrates the API into my code. Very important! :)

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

  //I wanted to integrate font awesome icons instead of the weather api icons, so this is the section that does that.

  let weatherIcon = response.data.weather[0].icon;
  let currentWeather = response.data.weather[0].main;
  let icon = document.querySelector("#icon");
  if (weatherIcon === "01d") {
    icon.innerHTML = ` <i class="fas fa-sun"></i>`;
  } else {
    if (weatherIcon === "01n") {
      icon.innerHTML = ` <i class="fas fa-moon"></i>`;
    } else if (currentWeather === "Clouds") {
      icon.innerHTML = `<i class="fas fa-cloud"></i>`;
    } else {
      if (currentWeather === "Thunderstorm") {
        icon.innerHTML = `<i class="fas fa-bolt"></i>`;
      } else {
        if (currentWeather === "Rain" || "Drizzle") {
          icon.innerHTML = `<i class="fas fa-cloud-showers-heavy"></i>`;
        } else {
          if (currentWeather === "Snow") {
            icon.innerHTML = `<i class="far fa-snowflake"></i>`;
          } else {
            if (weatherIcon === "02d")
              icon.innerHTML = `<i class="fas fa-cloud-sun"></i>`;
            else {
              if (weatherIcon === "02n")
                icon.innerHTML = `<i class="fas fa-cloud-moon"></i>`;
              else {
                icon.innerHTML = `<i class="fas fa-smog"></i>`;
              }
            }
          }
        }
      }
    }
  }
}

//convert makes the innerHTML of the degree button go from F to C, and therefore converts the units from fahrenheit to celsius and back
// using the API url that it generated to be used in function showTemperature.
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

//getForecast integrates the forecast API into my website.
function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiKey = `95aeb6a7ef6c41601b52d671db1e4f20`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(forecast);
}
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

//forecast displays the innerHTML of our forecast.
function forecast(response) {
  console.log(response.data.daily);
  let future = document.querySelector("#future");
  let days = ["Tues", "Wed", "Thurs", "Fri", "Sat"];
  let weatherForecast = `<div class= "row">`;
  days.forEach(function (day) {
    weatherForecast =
      weatherForecast +
      `
      <div class="col">
      <div class ="card">
        <div class="card-body">
          <h6>${day}</h6>
          <p class="future-temp">
            <i class="fas fa-sun"></i> 24°C
          </p>
          <p>High:</p>
          <p>Low:</p>
          <p>Feels like:</p>
        </div>
      </div>
    </div>
  `;
  });
  weatherForecast = weatherForecast + `</div>`;
  future.innerHTML = weatherForecast;
}
