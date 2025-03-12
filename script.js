document.addEventListener("DOMContentLoaded", function () {
    // Elements for displaying weather
    const weatherContainer = document.getElementById("weather");

    // Locations for motorsport events (update as needed)
    const locations = ["Silverstone,UK", "Monaco", "Suzuka,JP", "Daytona Beach,US"];

    // Function to fetch weather data
    async function fetchWeather() {
        try {
            const response = await fetch("/api/weather");
            if (!response.ok) throw new Error("Weather API error");
            
            const weatherData = await response.json();
            displayWeather(weatherData);
        } catch (error) {
            console.error("Weather fetch error:", error);
            weatherContainer.innerHTML = `<p>Failed to load weather data.</p>`;
        }
    }

    // Function to display weather data
    function displayWeather(data) {
        weatherContainer.innerHTML = ""; // Clear previous data

        data.forEach((location, index) => {
            const weatherHTML = `
                <div class="weather-card">
                    <h3>${locations[index]}</h3>
                    <p>Temp: ${location.temp}°C</p>
                    <p>Condition: ${location.description}</p>
                </div>
            `;
            weatherContainer.innerHTML += weatherHTML;
        });
    }

    // Function to fetch news
    async function fetchNews() {
        try {
            const response = await fetch("/api/news");
            if (!response.ok) throw new Error("News API error");
            
            const newsData = await response.json();
            displayNews(newsData);
        } catch (error) {
            console.error("News fetch error:", error);
            document.getElementById("news").innerHTML = `<p>Failed to load news.</p>`;
        }
    }

    // Function to display news
    function displayNews(data) {
        const newsContainer = document.getElementById("news");
        newsContainer.innerHTML = ""; // Clear previous data

        data.articles.forEach(article => {
            const newsHTML = `
                <div class="news-card">
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                </div>
            `;
            newsContainer.innerHTML += newsHTML;
        });
    }

    // Fetch both weather and news on page load
    fetchWeather();
    fetchNews();
});
