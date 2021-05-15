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
//to search for a city and display the temperature.

function showTemperature(response) {
  let temperature = response.data.main.temp;
  temperature = Math.round(temperature);
  let temp = document.querySelector("#currentTemp");
  temp.innerHTML = `${temperature}°`;

  let feelsLike = response.data.main.feels_like;
  feelsLike = Math.round(feelsLike);
  let feels = document.querySelector("#feelsLike");
  feels.innerHTML = `Feels like: ${feelsLike}°C`;

  let humidity = response.data.main.humidity;
  humidity = Math.round(humidity);
  let humid = document.querySelector("#humid");
  humid.innerHTML = `Humidity: ${humidity}%`;

  let getDescription = response.data.weather[0].description;
  let description = document.querySelector("#description");
  description.innerHTML = `${getDescription}`;

  //I wanted to integrate font awesome icons instead of the weather api icons, so this is the section that does that.

  let weatherIcon = response.data.weather[0].icon;
  console.log(weatherIcon);
  let currentWeather = response.data.weather[0].main;
  console.log(currentWeather);
  let icon = document.querySelector("#icon");
  if (currentWeather === "Clear") {
    icon.innerHTML = ` <i class="fas fa-sun"></i>`;
  } else {
    if (currentWeather === "Clouds") {
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
            if (weatherIcon === "02d" || "02n")
              icon.innerHTML = `<i class="fas fa-cloud-sun"></i>`;
            else {
              icon.innerHTML = <i class="fas fa-smog"></i>;
            }
          }
        }
      }
    }
  }
}

//cityAlert displays the city you searched as well as generates an api key to send to the showTemperature function
function cityAlert(event) {
  event.preventDefault();
  let place = document.querySelector("#place");
  let currentCity = document.querySelector("#currentCity");
  let city = place.value;

  currentCity.innerHTML = city;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=dde5f5b53a9878edbb3c8ca7477531b0`;

  axios.get(apiUrl).then(showTemperature);
}
let form = document.querySelector("#cityName");
form.addEventListener("submit", cityAlert);

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
