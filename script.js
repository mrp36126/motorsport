document.addEventListener("DOMContentLoaded", function () {
    const weatherContainer = document.getElementById("weather");

    // Schedules data
    const schedules = {
        zwartkops: [
            { date: "2025-02-01", event: "Passion for Speed" },
            { date: "2025-03-01", event: "Regional" },
            { date: "2025-04-05", event: "Historic" },
            { date: "2025-05-17", event: "Regional" },
            { date: "2025-06-21", event: "Nationals" },
            { date: "2025-07-12", event: "500" },
            { date: "2025-08-09", event: "Historic" },
            { date: "2025-10-25", event: "Nationals" },
            { date: "2025-11-08", event: "Regionals" }
        ],
        ultimate: [
            { date: "2025-02-01", event: "Hot Rods SA vs UK" },
            { date: "2025-03-01", event: "SA vs USA" },
            { date: "2025-04-05", event: "" },
            { date: "2025-05-03", event: "" },
            { date: "2025-09-06", event: "" },
            { date: "2025-10-04", event: "" },
            { date: "2025-11-01", event: "" },
            { date: "2025-12-06", event: "" }
        ],
        rock: [
            { date: "2025-01-25", event: "Rock Mania" },
            { date: "2025-03-08", event: "SA vs USA" },
            { date: "2025-04-12", event: "" },
            { date: "2025-05-10", event: "" },
            { date: "2025-06-14", event: "" }
        ],
        mahem: [
            { date: "2025-02-08", event: "Hot Rods SA vs UK" },
            { date: "2025-03-01", event: "" },
            { date: "2025-04-05", event: "" },
            { date: "2025-05-31", event: "" },
            { date: "2025-06-28", event: "" },
            { date: "2025-07-26", event: "" },
            { date: "2025-08-16", event: "" },
            { date: "2025-09-06", event: "" },
            { date: "2025-10-04", event: "Hot Rods" },
            { date: "2025-11-15", event: "" },
            { date: "2025-12-06", event: "Fireworks" }
        ]
    };

    function showTab(tabId) {
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active", "bg-blue-500"));
        
        const activeTab = document.getElementById(tabId);
        activeTab.classList.remove("hidden");
        document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add("active", "bg-blue-500");

        if (tabId === "motorsport") {
            fetchWeather();
            displaySchedules();
        }
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

    function displaySchedules() {
        const currentDate = new Date("2025-03-14"); // Current date as per system info

        // Function to format date as "DD Month"
        function formatDate(dateStr) {
            const date = new Date(dateStr);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "long" });
            return `${day} ${month}`;
        }

        // Render schedules
        Object.keys(schedules).forEach(raceway => {
            const scheduleList = document.getElementById(`${raceway}-schedule`);
            scheduleList.innerHTML = ""; // Clear existing content

            const futureEvents = schedules[raceway].filter(event => new Date(event.date) >= currentDate);
            if (futureEvents.length === 0) {
                scheduleList.innerHTML = "<li>No upcoming events</li>";
            } else {
                futureEvents.forEach(event => {
                    const li = document.createElement("li");
                    li.textContent = event.event ? `${formatDate(event.date)} (${event.event})` : formatDate(event.date);
                    scheduleList.appendChild(li);
                });
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
