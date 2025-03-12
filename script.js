const API_KEY = "YOUR_API_KEY"; // Replace with your API key
const locations = ["Silverstone, UK", "Monza, Italy", "Suzuka, Japan", "Daytona, USA"]; 

function showTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add("active");

    if (tabName === "motorsport") {
        getWeather();
    }
}

async function getWeather() {
    const weatherContainer = document.getElementById("weather");
    weatherContainer.innerHTML = "<p>Loading weather data...</p>";

    let weatherHTML = "";
    for (let location of locations) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.cod === 200) {
                weatherHTML += `
                    <div class="weather-card">
                        <h3>${data.name}</h3>
                        <p>${data.weather[0].description}</p>
                        <p>Temp: ${data.main.temp}°C</p>
                        <p>Wind: ${data.wind.speed} m/s</p>
                    </div>
                `;
            } else {
                weatherHTML += `<p>Could not fetch data for ${location}</p>`;
            }
        } catch (error) {
            weatherHTML += `<p>Error loading data for ${location}</p>`;
        }
    }
    
    weatherContainer.innerHTML = weatherHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    showTab('motorsport');
});
