const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key
const locations = ["Silverstone, UK", "Monza, Italy", "Suzuka, Japan", "Daytona, USA"];

function showTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("bg-blue-500"));
    
    document.getElementById(tabName).classList.remove("hidden");
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add("bg-blue-500");
    
    if (tabName === "motorsport") {
        getWeather();
    }
}

async function getWeather() {
    const weatherContainer = document.getElementById("weather");
    weatherContainer.innerHTML = "<p class='text-center text-gray-400'>Loading weather data...</p>";

    let weatherHTML = "";
    for (let location of locations) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.cod === 200) {
                weatherHTML += `
                    <div class="weather-card bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md text-center border border-gray-500">
                        <h3 class="text-xl font-semibold text-blue-300">${data.name}</h3>
                        <p class="text-gray-300">${data.weather[0].description}</p>
                        <p class="text-lg font-bold text-blue-400">${data.main.temp}°C</p>
                        <p class="text-gray-400">Wind: ${data.wind.speed} m/s</p>
                    </div>
                `;
            } else {
                weatherHTML += `<p class="text-red-400">Could not fetch data for ${location}</p>`;
            }
        } catch (error) {
            weatherHTML += `<p class="text-red-400">Error loading data for ${location}</p>`;
        }
    }
    
    weatherContainer.innerHTML = weatherHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    showTab('motorsport');
});
