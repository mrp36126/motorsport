document.addEventListener("DOMContentLoaded", function () {
    const weatherContainer = document.getElementById("weather");

    function showTab(tabId) {
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active", "bg-blue-500"));
        
        const activeTab = document.getElementById(tabId);
        activeTab.classList.remove("hidden");
        document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add("active", "bg-blue-500");

        if (tabId === "motorsport") fetchWeather();
        if (tabId === "news") fetchNews();
    }

    async function fetchWeather() {
        try {
            const response = await fetch("/api/weather");
            if (!response.ok) throw new Error("Weather API error");
            const weatherData = await response.json();
            displayWeather(weatherData);
        } catch (error) {
            console.error("Weather fetch error:", error);
            weatherContainer.innerHTML = `<p class="text-red-400">Failed to load weather data.</p>`;
        }
    }

    function displayWeather(data) {
        data.forEach(location => {
            if (location.location === "Pretoria,ZA") {
                // Update both Zwartkops and Mahem with Pretoria weather
                document.getElementById("zwartkops-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("zwartkops-condition").textContent = `Condition: ${location.description}`;
                document.getElementById("mahem-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("mahem-condition").textContent = `Condition: ${location.description}`;
            } else if (location.location === "Vereeniging,ZA") {
                document.getElementById("ultimate-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("ultimate-condition").textContent = `Condition: ${location.description}`;
            } else if (location.location === "Brakpan,ZA") {
                document.getElementById("rock-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("rock-condition").textContent = `Condition: ${location.description}`;
            }
        });
    }

    async function fetchNews() {
        try {
            const response = await fetch("/api/news");
            if (!response.ok) throw new Error("News API error");
            const newsData = await response.json();
            if (newsData.error) throw new Error(newsData.error);
            displayNews(newsData);
        } catch (error) {
            console.error("News fetch error:", error);
            document.getElementById("news").innerHTML = `<p class="text-red-400">${error.message}</p>`;
        }
    }

    function displayNews(data) {
        const newsContainer = document.getElementById("news");
        newsContainer.innerHTML = "";
        data.articles.forEach(article => {
            const newsHTML = `
                <div class="news-card bg-gray-800 p-4 rounded-lg shadow-md text-left">
                    <h3 class="text-lg font-bold">${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank" class="text-blue-400 hover:underline">Read more</a>
                </div>
            `;
            newsContainer.innerHTML += newsHTML;
        });
    }

    showTab("motorsport"); // Load default tab
});
