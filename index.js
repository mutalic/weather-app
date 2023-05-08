// https://api.openweathermap.org/data/2.5/weather?q=Denver&units=metric&appid=1c04d814fe5328098460e4663a46db86
import cityList from "./data/city.list.json" assert { type: "json" };

const weatherAPI = {
  apiKey: "1c04d814fe5328098460e4663a46db86",

  getWeather: function (location) {
    let unit;
    let units = document.querySelector(".units").textContent;
    if (units === "Celsius") {
      unit = "metric";
    } else {
      unit = "imperial";
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${this.apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data);
        // Clean Up (input text field, <ul></ul> containing previous matched location list)
        document.querySelector(".search-bar").value = "";
        clearChildrenElements(document.querySelector(".matched-locations"));
      });
  },

  displayWeather: function (data) {
    /* Variables */
    let unit = document.querySelector(".units").textContent;

    /* Destructure API Data */
    const { name } = data;
    // const { lon, lat } = data.coord;
    const { main, description } = data.weather[0];
    const { temp, humidity, pressure, temp_min, temp_max } = data.main;
    const { speed, deg } = data.wind;
    const { sunrise, sunset } = data.sys;

    /* Set Background Image */
    this.setBackgroundImage(main);

    /* Display Current Data */
    /* Main Information (city name, description, temperature, high and low) */
    document.querySelector(".city").textContent = name;
    document.querySelector(".description").textContent = description;
    document.querySelector(".temperature").textContent = Math.round(temp) + "°";
    document.querySelector(".high").textContent = Math.round(temp_max);
    document.querySelector(".low").textContent = Math.round(temp_min);

    /* Additional Information (wind, sunrise/sunset, humidity, pressure) */
    document.querySelector(".wind-direction").textContent =
      this.getWindDirection(deg);
    document.querySelector(".wind-speed").textContent =
      unit === "Fahrenheit"
        ? Math.round(speed) + "mph"
        : Math.round(speed) + "kph";
    document.querySelector(".sunrise-time").textContent =
      this.unixToHoursMinutes(sunrise);
    document.querySelector(".sunset-time").textContent =
      this.unixToHoursMinutes(sunset);
    document.querySelector(".humidity-value").textContent = humidity + "%";
    document.querySelector(".pressure-value").textContent =
      Math.round(pressure * 2.953) / 100;
  },

  setBackgroundImage(main) {
    let body = document.body;
    if (main === "Clear") {
      body.style.background = "url(./images/clear-sky.jpg)";
    }
    if (main === "Clouds") {
      body.style.background = "url(./images/clouds.jpg) center";
    }
    if (main === "Snow") {
      body.style.background = "url(./images/snow.jpg) center";
      document.querySelector(".search-bar").style.color =
        "rgba(43, 114, 164, 0.8)";
    }
    if (main === "Rain" || main === "Drizzle") {
      body.style.background = "url(./images/rain.jpg) center";
    }
    if (main === "Thunderstorm" || main === "Squall" || main === "Tornado") {
      body.style.background = "url(./images/thunderstorm.jpg) center";
    }
    if (main === "Mist" || main === "Haze" || main === "Fog") {
      body.style.background = "url(./images/mist.jpg) center";
    }
    if (
      main === "smoke" ||
      main === "dust" ||
      main === "sand" ||
      main === "ash"
    ) {
      body.style.background = "url(./images/dust.jpg)";
    }
  },

  convertUnits: function () {
    let city = document.querySelector(".city").textContent;
    let unit = document.querySelector(".units");
    if (unit.textContent === "Celsius") {
      unit.textContent = "Fahrenheit";
    } else {
      unit.textContent = "Celsius";
    }
    weatherAPI.getWeather(city);
  },

  getWindDirection(deg) {
    if ((deg >= 337.5 && deg < 360) || (deg >= 0 && deg < 22.5)) {
      return "N";
    } else if (deg >= 22.5 && deg < 67.5) {
      return "NE";
    } else if (deg >= 67.5 && deg < 112.5) {
      return "E";
    } else if (deg >= 112.5 && deg < 157.5) {
      return "SE";
    } else if (deg >= 157.5 && deg < 202.5) {
      return "S";
    } else if (deg >= 202.5 && deg < 247.5) {
      return "SW";
    } else if (deg >= 247.5 && deg < 292.5) {
      return "W";
    } else {
      return "NW";
    }
  },

  unixToHoursMinutes(unix) {
    let date = new Date(unix * 1000);
    let hour =
      date.getHours().toString().length === 1
        ? "0" + date.getHours()
        : date.getHours();
    let minutes =
      date.getMinutes().toString().length === 1
        ? "0" + date.getMinutes()
        : date.getMinutes();
    return hour + ":" + minutes;
  },
};

// Unit Conversion Event Listener (Metric <-> Imperial)
document.querySelector(".units").addEventListener("click", function () {
  weatherAPI.convertUnits();
});

/* Seach Bar Input Event Listener */
document.querySelector(".search-bar").addEventListener("input", function (e) {
  let matchList = document.querySelector(".search-match");
  let userInput = e.target.value;

  if (userInput.length > 1) {
    debouncedSearchMatch(userInput);
  } else {
    document.querySelector(".search-bar").classList.remove("search-error");
    document.querySelector(".search-error__text").style.visibility = "hidden";
    matchList.classList.add("hide");
    clearChildrenElements(document.querySelector(".matched-locations"));
  }
});

/* Initial Rendering */
weatherAPI.getWeather("Seoul");

/* City List */
function searchMatch(input) {
  let currentInput = new RegExp(`${input}`, "i");
  let matchedLocations = [];
  for (let i = 0; i < cityList.length; i++) {
    let name = cityList[i].name;
    let state = cityList[i].state;
    let country = cityList[i].country;
    let location =
      state !== "" ? `${name}, ${state}, ${country}` : `${name}, ${country}`;

    if (currentInput.test(location)) {
      matchedLocations.push(location);
    }
  }
  clearChildrenElements(document.querySelector(".matched-locations"));
  displayMatched(matchedLocations);
}

function displayMatched(matchedLocations) {
  let matchedLocationsEl = document.querySelector(".matched-locations");
  let searchMatchEl = document.querySelector(".search-match");
  let n = matchedLocations.length > 30 ? 30 : matchedLocations.length;
  for (let i = 0; i < n; i++) {
    // <li class="matched-location">city, state, country</li>
    let li = document.createElement("li");
    let matchedLocation = matchedLocations[i];
    li.classList.add("matched-location");
    li.append(matchedLocation);
    li.addEventListener("click", function () {
      weatherAPI.getWeather(matchedLocation);
      searchMatchEl.classList.add("hide");
    });

    // append to <ul>
    matchedLocationsEl.appendChild(li);
  }

  if (matchedLocations.length === 0) {
    document.querySelector(".search-bar").classList.add("search-error");
    document.querySelector(".search-error__text").style.visibility = "visible";
    searchMatchEl.classList.add("hide");
  } else {
    // show list
    document.querySelector(".search-bar").classList.remove("search-error");
    document.querySelector(".search-error__text").style.visibility = "hidden";
    searchMatchEl.classList.remove("hide");
  }
}

// Clears all child nodes of a parent node
function clearChildrenElements(parentNode) {
  while (parentNode.lastElementChild) {
    parentNode.removeChild(parentNode.lastElementChild);
  }
}

// A debounced version of searchMatch, which waits until 500ms has passed from last user input to invoke the function.
const debouncedSearchMatch = debounce(searchMatch, 500);

// Debouncer
function debounce(func, wait) {
  let timeoutID = null;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutID);

    timeoutID = setTimeout(function () {
      func.apply(context, args);
      timeoutID = null;
    }, wait);
  };
}
