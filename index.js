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
        const { name } = data;
        const {icon, description} = data.weather[0];
        const { temp, humidity, temp_min, temp_max} = data.main;
        const {speed} = data.wind;        

        document.querySelector('.city').textContent = name;
        document.querySelector('.description').textContent = description;
        document.querySelector('.temperature').textContent = Math.round(temp) + '°';
        document.querySelector('.high').textContent = Math.round(temp_max);
        document.querySelector('.low').textContent = Math.round(temp_min);
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