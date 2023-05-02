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
        const { temp, humidity, temp_min, temp_max} = data.main;
        const { speed, deg } = data.wind;
        const { sunrise, sunset } = data.sys;
        
        /* Display Current Data */
        /* .weather__main */
        document.querySelector('.city').textContent = name;
        document.querySelector('.description').textContent = description;
        document.querySelector('.temperature').textContent = Math.round(temp) + '°';
        document.querySelector('.high').textContent = Math.round(temp_max);
        document.querySelector('.low').textContent = Math.round(temp_min);
        /* .weather__additional */
        // Wind
        
        // Sunrise & Sunset (Unix -> HH:MM)
        let sunriseDate = new Date(sunrise * 1000);
        let sunriseHour = sunriseDate.getHours().toString().length === 1 ? "0" + sunriseDate.getHours() : sunriseDate.getHours();
        let sunriseMinutes = sunriseDate.getMinutes().toString().length === 1 ? "0" + sunriseDate.getMinutes() : sunriseDate.getMinutes();
        document.querySelector('.sunrise-time').textContent = sunriseHour + ":" + sunriseMinutes;
        let sunsetDate = new Date(sunset * 1000);
        let sunsetHour = sunsetDate.getHours().toString().length === 1 ? "0" + sunsetDate.getHours() : sunsetDate.getHours();
        let sunsetMinutes = sunsetDate.getMinutes().toString().length === 1 ? "0" + sunsetDate.getMinutes() : sunsetDate.getMinutes();
        document.querySelector('.sunset-time').textContent = sunsetHour + ":" + sunsetMinutes;

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

document.querySelector('.search-btn').addEventListener('click', function(){
    let city = document.querySelector('.search-bar').value;
    weatherAPI.getWeather(city);
    document.querySelector('.search-bar').value = "";
})

document.querySelector('.units').addEventListener('click', function(){
    weatherAPI.convertUnits();
})

weatherAPI.getWeather('Denver');
// https://api.openweathermap.org/data/2.5/weather?q=Denver&units=metric&appid=1c04d814fe5328098460e4663a46db86