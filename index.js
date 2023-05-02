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

        /* Destructure API Data */
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, pressure, temp_min, temp_max} = data.main;
        const { speed, deg } = data.wind;
        const { sunrise, sunset } = data.sys;

        /* Set background image */
        document.querySelector('body').style.background = `url(https://source.unsplash.com/1600x900/?${name})`;
        
        /* Display Current Data */
        /* .weather__main */
        document.querySelector('.city').textContent = name;
        document.querySelector('.description').textContent = description;
        // document.querySelector('.icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector('.temperature').textContent = Math.round(temp) + '°';
        document.querySelector('.high').textContent = Math.round(temp_max);
        document.querySelector('.low').textContent = Math.round(temp_min);
        /* .weather__additional */
        /* Wind */
        // Wind Direction
        const windDirection = ((deg) => {
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
        })();
        document.querySelector('.wind-direction').textContent = windDirection;
        // Wind Speed
        let unit = document.querySelector('.units').textContent;
        document.querySelector('.wind-speed').textContent = unit === "Fahrenheit" ? Math.round(speed) + "mph" : Math.round(speed) + "kph";
        
        /* Sunrise & Sunset (Unix -> HH:MM) */
        // Sunrise
        let sunriseDate = new Date(sunrise * 1000);
        let sunriseHour = sunriseDate.getHours().toString().length === 1 ? "0" + sunriseDate.getHours() : sunriseDate.getHours();
        let sunriseMinutes = sunriseDate.getMinutes().toString().length === 1 ? "0" + sunriseDate.getMinutes() : sunriseDate.getMinutes();
        document.querySelector('.sunrise-time').textContent = sunriseHour + ":" + sunriseMinutes;

        // Sunset
        let sunsetDate = new Date(sunset * 1000);
        let sunsetHour = sunsetDate.getHours().toString().length === 1 ? "0" + sunsetDate.getHours() : sunsetDate.getHours();
        let sunsetMinutes = sunsetDate.getMinutes().toString().length === 1 ? "0" + sunsetDate.getMinutes() : sunsetDate.getMinutes();
        document.querySelector('.sunset-time').textContent = sunsetHour + ":" + sunsetMinutes;

        /* Humidity */
        document.querySelector('.humidity-value').textContent = humidity + "%";

        /* Pressure */
        // Hg (Rounded to 2 decimal places)
        document.querySelector('.pressure-value').textContent = (Math.round(pressure * 2.953) / 100);
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
    }
}

/* Search Bar Event Listeners */
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

document.querySelector('.units').addEventListener('click', function(){
    weatherAPI.convertUnits();
})

weatherAPI.getWeather('denver');
// https://api.openweathermap.org/data/2.5/weather?q=Denver&units=metric&appid=1c04d814fe5328098460e4663a46db86