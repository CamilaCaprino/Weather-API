const API_KEY = '081df59bef290f5d53b1c8a0ecd5d55b';

const fetchData = position => {
    const { latitude, longitude } = position.coords;
    fetchWeatherDataByCoords(latitude, longitude);
}

const fetchWeatherDataByCoords = (latitude, longitude) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => setWeatherData(data));
}

const fetchWeatherDataByCity = city => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                showAlert('City not found');
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setWeatherData(data);
            }
        })
        .catch(error => showAlert(error.message));
}

const setWeatherData = data => {
    const weatherData = {
        location: data.name,
        description: data.weather[0].description,
        humidity: `${data.main.humidity}%`,
        pressure: `${data.main.pressure} hPa`,
        temperature: `${Math.floor(data.main.temp)}°C`,
        date: getDate(),
    }

    Object.keys(weatherData).forEach(key => {
        document.getElementById(key).textContent = weatherData[key];
    });

    setWeatherBackground(data.weather[0].main.toLowerCase());

    cleanHtml();
}

const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const setWeatherBackground = condition => {
    let background;
    if (['rain', 'drizzle', 'thunderstorm', 'tornado', 'clouds', 'broken clouds', 'scattered clouds' , 'mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall'].includes(condition)) {
        background = 'linear-gradient(0deg, rgba(218,218,222,1) 0%, rgba(50,80,116,1) 91%)'; // Bad weather
    } else if (condition === 'clear') {
        background = 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'; // Sunny
    } else {
        background = 'radial-gradient(circle, rgba(255,249,109,1) 4%, rgba(28,179,255,1) 100%)'; // Good weather
    }
    document.body.style.background = background;
}

const cleanHtml = () => {
    let container = document.getElementById('container');
    let loader = document.getElementById('loader');

    loader.style.display = 'none';
    container.style.display = 'block'; 
}

const getDate = () => {
    let date = new Date();
    return `${date.getDate()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
}

const onLoad = () => {
    navigator.geolocation.getCurrentPosition(fetchData);

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', searchCity);
}

const searchCity = event => {
    event.preventDefault();
    const city = document.getElementById('city-searchbar').value.trim();
    if (city) {
        fetchWeatherDataByCity(city);
    } else {
        showAlert('Please enter a city name.');
    }
}

const showAlert = (message) => {
    const alert = document.getElementById('city-alert');
    alert.header = 'Alert';
    alert.message = message;
    alert.buttons = ['OK'];
    alert.present();
}
