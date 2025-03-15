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
        ],
        f1: [
            { date: "2025-03-16", event: "Australia", location: "Melbourne,AU", flag: "AustraliaFlag.jpg", track: "AustraliaTrack.jpg", trackName: "Albert Park Grand Prix Circuit" },
            { date: "2025-03-23", event: "China", location: "Shanghai,CN", flag: "ChinaFlag.jpg", track: "ChinaTrack.jpg", trackName: "Shanghai International Circuit" },
            { date: "2025-04-06", event: "Japan", location: "Suzuka,JP", flag: "JapanFlag.jpg", track: "JapanTrack.jpg", trackName: "Suzuka International Racing Course" },
            { date: "2025-04-13", event: "Bahrain", location: "Sakhir,BH", flag: "BahrainFlag.jpg", track: "BahrainTrack.jpg", trackName: "Bahrain International Circuit" },
            { date: "2025-04-20", event: "Saudi Arabia", location: "Jeddah,SA", flag: "SaudiArabiaFlag.jpg", track: "SaudiArabiaTrack.jpg", trackName: "Jeddah Corniche Circuit" },
            { date: "2025-05-04", event: "Miami", location: "Miami,US", flag: "USFlag.jpg", track: "MiamiTrack.jpg", trackName: "Miami International Autodrome" },
            { date: "2025-05-18", event: "Emilia-Romagna (Italy)", location: "Imola,IT", flag: "ItalyFlag.jpg", track: "EmiliaRomagnaTrack.jpg", trackName: "Autodromo Enzo e Dino Ferrari" },
            { date: "2025-05-25", event: "Monaco", location: "Monaco,MC", flag: "MonacoFlag.jpg", track: "MonacoTrack.jpg", trackName: "Circuit de Monaco" },
            { date: "2025-06-01", event: "Spain", location: "Barcelona,ES", flag: "SpainFlag.jpg", track: "SpainTrack.jpg", trackName: "Circuit de Barcelona-Catalunya" },
            { date: "2025-06-15", event: "Canada", location: "Montreal,CA", flag: "CanadaFlag.jpg", track: "CanadaTrack.jpg", trackName: "Circuit Gilles Villeneuve" },
            { date: "2025-06-29", event: "Austria", location: "Spielberg,AT", flag: "AustriaFlag.jpg", track: "AustriaTrack.jpg", trackName: "Red Bull Ring" },
            { date: "2025-07-06", event: "Great Britain", location: "Silverstone,GB", flag: "GBFlag.jpg", track: "GreatBritainTrack.jpg", trackName: "Silverstone Circuit" },
            { date: "2025-07-27", event: "Belgium", location: "Spa,BE", flag: "BelgiumFlag.jpg", track: "BelgiumTrack.jpg", trackName: "Circuit de Spa-Francorchamps" },
            { date: "2025-08-03", event: "Hungary", location: "Budapest,HU", flag: "HungaryFlag.jpg", track: "HungaryTrack.jpg", trackName: "Hungaroring" },
            { date: "2025-08-31", event: "Netherlands", location: "Zandvoort,NL", flag: "NetherlandsFlag.jpg", track: "NetherlandsTrack.jpg", trackName: "Circuit Zandvoort" },
            { date: "2025-09-07", event: "Monza (Italy)", location: "Monza,IT", flag: "ItalyFlag.jpg", track: "MonzaTrack.jpg", trackName: "Autodromo Nazionale Monza" },
            { date: "2025-09-21", event: "Azerbaijan", location: "Baku,AZ", flag: "AzerbaijanFlag.jpg", track: "AzerbaijanTrack.jpg", trackName: "Baku City Circuit" },
            { date: "2025-10-05", event: "Singapore", location: "Singapore,SG", flag: "SingaporeFlag.jpg", track: "SingaporeTrack.jpg", trackName: "Marina Bay Street Circuit" },
            { date: "2025-10-19", event: "United States", location: "Austin,US", flag: "USFlag.jpg", track: "UnitedStatesTrack.jpg", trackName: "Circuit of the Americas" },
            { date: "2025-10-26", event: "Mexico", location: "Mexico City,MX", flag: "MexicoFlag.jpg", track: "MexicoTrack.jpg", trackName: "Autódromo Hermanos Rodríguez" },
            { date: "2025-11-09", event: "Brazil", location: "Sao Paulo,BR", flag: "BrazilFlag.jpg", track: "BrazilTrack.jpg", trackName: "Autódromo José Carlos Pace" },
            { date: "2025-11-22", event: "Las Vegas", location: "Las Vegas,US", flag: "USFlag.jpg", track: "LasVegasTrack.jpg", trackName: "Las Vegas Street Circuit" },
            { date: "2025-11-30", event: "Qatar", location: "Lusail,QA", flag: "QatarFlag.jpg", track: "QatarTrack.jpg", trackName: "Lusail International Circuit" },
            { date: "2025-12-07", event: "Abu Dhabi", location: "Yas Marina,AE", flag: "AbuDhabiFlag.jpg", track: "AbuDhabiTrack.jpg", trackName: "Yas Marina Circuit" }
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
            displayUpcomingEvents();
            displayF1NextRace();
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
        const nextF1Location = getNextF1Race().location;
        data.forEach(location => {
            if (location.location === "Pretoria,ZA") {
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
            } else if (location.location === nextF1Location) {
                document.querySelector("#f1-temp .temp-value").textContent = `${location.temp}°C`;
                document.querySelector("#f1-condition .condition-value").textContent = location.description;
            }
        });
    }

    function getNextF1Race() {
        const currentDate = new Date("2025-03-14");
        return schedules.f1.find(event => new Date(event.date) >= currentDate) || schedules.f1[0];
    }

    function displayF1NextRace() {
        const nextRace = getNextF1Race();
        const city = nextRace.location.split(",")[0]; // Extract city from "City,Country"
        document.getElementById("f1-next-race").textContent = `Next Race: ${nextRace.event} (${city})`;
        document.getElementById("f1-flag").src = `images/${nextRace.flag}`;
        document.getElementById("f1-track-name").textContent = nextRace.trackName;
        document.getElementById("f1-track").src = `images/${nextRace.track}`;
    }

    function displaySchedules() {
        const currentDate = new Date("2025-03-14"); // Current date as per system info
        const nextRace = getNextF1Race();

        function formatDate(dateStr) {
            const date = new Date(dateStr);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "long" });
            return `${day} ${month}`;
        }

        Object.keys(schedules).forEach(raceway => {
            const scheduleList = document.getElementById(`${raceway}-schedule`);
            scheduleList.innerHTML = "";

            const futureEvents = schedules[raceway].filter(event => new Date(event.date) >= currentDate);
            if (futureEvents.length === 0) {
                scheduleList.innerHTML = "<li>No upcoming events</li>";
            } else {
                futureEvents.forEach(event => {
                    const li = document.createElement("li");
                    const text = event.event ? `${formatDate(event.date)} (${event.event})` : formatDate(event.date);
                    li.textContent = text;
                    if (raceway === "f1" && event.date === nextRace.date) {
                        li.style.color = "#FFFF00"; // Highlight next race in schedule
                    }
                    scheduleList.appendChild(li);
                });
            }
        });
    }

    function displayUpcomingEvents() {
        const currentDate = new Date("2025-03-14"); // Current date as per system info
        const thirtyDaysLater = new Date(currentDate);
        thirtyDaysLater.setDate(currentDate.getDate() + 30); // March 14 + 30 days = April 13

        const upcomingList = document.getElementById("upcoming-schedule");

        // Collect all events from all raceways
        const allEvents = [];
        Object.keys(schedules).forEach(raceway => {
            schedules[raceway].forEach(event => {
                allEvents.push({ ...event, raceway });
            });
        });

        // Filter events for the next 30 days
        const upcomingEvents = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= currentDate && eventDate <= thirtyDaysLater;
        });

        if (upcomingEvents.length === 0) {
            upcomingList.innerHTML = "<strong>Upcoming Events:</strong> No events in the next 30 days";
        } else {
            upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
            const eventText = "<strong>Upcoming Events:</strong> " + upcomingEvents.map(event => {
                const date = new Date(event.date);
                const day = date.getDate();
                const month = date.toLocaleString("default", { month: "long" });
                return `${day} ${month} - ${event.raceway.charAt(0).toUpperCase() + event.raceway.slice(1)} ${event.event ? `(${event.event})` : ""}`;
            }).join("      •      ");
            upcomingList.innerHTML = eventText;
        }
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
