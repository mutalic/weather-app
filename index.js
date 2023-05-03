// https://api.openweathermap.org/data/2.5/weather?q=Denver&units=metric&appid=1c04d814fe5328098460e4663a46db86

const weatherAPI = {

    apiKey : "1c04d814fe5328098460e4663a46db86",

    getWeather: function(city){
        let unit;
        let units = document.querySelector('.units').textContent;
        if (units === "Celsius") {
            unit = "metric";
        } else {
            unit = "imperial";
        }
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${this.apiKey}`)
        .then(response => response.json())
        .then(data => this.displayWeather(data));
    },

    displayWeather: function(data){
        /* Variables */
        let unit = document.querySelector('.units').textContent;

        /* Destructure API Data */
        const { name } = data;
        const { main, description } = data.weather[0];
        const { temp, humidity, pressure, temp_min, temp_max} = data.main;
        const { speed, deg } = data.wind;
        const { sunrise, sunset } = data.sys;

        /* Set Background Image */
        this.setBackground(main);
        
        /* Display Current Data */
        /* Main Information (city name, description, temperature, high and low) */
        document.querySelector('.city').textContent = name;
        document.querySelector('.description').textContent = description;
        document.querySelector('.temperature').textContent = Math.round(temp) + '°';
        document.querySelector('.high').textContent = Math.round(temp_max);
        document.querySelector('.low').textContent = Math.round(temp_min);

        /* Additional Information (wind, sunrise/sunset, humidity, pressure) */
        document.querySelector('.wind-direction').textContent = this.getWindDirection(deg);
        document.querySelector('.wind-speed').textContent = unit === "Fahrenheit" ? Math.round(speed) + "mph" : Math.round(speed) + "kph";
        document.querySelector('.sunrise-time').textContent = this.unixToHoursMinutes(sunrise);
        document.querySelector('.sunset-time').textContent = this.unixToHoursMinutes(sunset);
        document.querySelector('.humidity-value').textContent = humidity + "%";
        document.querySelector('.pressure-value').textContent = (Math.round(pressure * 2.953) / 100);
    },

    setBackground(main) {
        let body = document.body;
        if (main === "Clear") {
            body.style.background = "url(./images/clear-sky.jpg)";
        }
        if (main === "Clouds") {
            body.style.background = "url(./images/clouds.jpg) center";
        }
        if (main === "Snow") {
            body.style.background = "url(./images/snow.jpg) center";
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
        if (main === "smoke" || main === "dust" || main === "sand" || main === "ash") {
            body.style.background = "url(./images/dust.jpg)";
        }
    },

    convertUnits: function(){
        let city = document.querySelector('.city').textContent;
        let unit = document.querySelector('.units');
        if (unit.textContent === "Celsius") {
            unit.textContent = "Fahrenheit";
        } else {
            unit.textContent = "Celsius";
        }
        weatherAPI.getWeather(city);
    },

    getWindDirection(deg){
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

    unixToHoursMinutes(unix){
        let date = new Date(unix * 1000);
        let hour = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
        let minutes = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
        return hour + ":" + minutes;
    }
}

/* Search Bar Event Listeners (Click, Enter) */
document.querySelector('.search-btn').addEventListener('click', function(){
    let city = document.querySelector('.search-bar').value;
    weatherAPI.getWeather(city);
    document.querySelector('.search-bar').value = "";
})
document.querySelector('.search-bar').addEventListener('keydown', function(e){
    if (e.key === "Enter") {
        let city = document.querySelector('.search-bar').value;
        weatherAPI.getWeather(city);
        document.querySelector('.search-bar').value = "";
    }
})

/* Unit Converter */
document.querySelector('.units').addEventListener('click', function(){
    weatherAPI.convertUnits();
})

/* Initial Rendering */
weatherAPI.getWeather('Seoul');