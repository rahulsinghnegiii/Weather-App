const apiKey = 'ee898a7d238b05fbb0d3c62179c58715';
let unit = 'metric'; // Default to Celsius

document.getElementById('submitBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        document.getElementById('errorMsg').style.display = 'none'; // Hide error message
        getWeatherData(city);
    } else {
        alert("Please enter a city name.");
    }
});

document.getElementById('locationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('errorMsg').style.display = 'none'; // Hide error message
            getWeatherDataByLocation(lat, lon);
        }, () => {
            alert("Unable to retrieve your location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

document.getElementById('unitToggle').addEventListener('change', () => {
    unit = unit === 'metric' ? 'imperial' : 'metric';
    const city = document.getElementById('cityInput').value;
    if (city) {
        document.getElementById('errorMsg').style.display = 'none'; // Hide error message
        getWeatherData(city);
    }
});

function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found"); // Handle non-2xx responses
            }
            return response.json();
        })
        .then(data => {
            updateWeatherUI(data);
        })
        .catch(error => {
            document.getElementById('errorMsg').style.display = 'block';
            document.getElementById('errorMsg').textContent = `Error: ${error.message}`;
        });
}

function getWeatherDataByLocation(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Location not found"); // Handle non-2xx responses
            }
            return response.json();
        })
        .then(data => {
            updateWeatherUI(data);
        })
        .catch(error => {
            document.getElementById('errorMsg').style.display = 'block';
            document.getElementById('errorMsg').textContent = `Error: ${error.message}`;
        });
}

function updateWeatherUI(data) {
    document.getElementById('cityName').textContent = `City: ${data.name}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°${unit === 'metric' ? 'C' : 'F'}`;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    document.getElementById('weatherIcon').style.display = 'block';
    document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('visibility').textContent = `Visibility: ${data.visibility} m`;
    document.getElementById('sunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    document.getElementById('sunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

    // Update the weather description in the new section
    document.getElementById('weatherDescription').textContent = `Description: ${data.weather[0].description}`;
}
