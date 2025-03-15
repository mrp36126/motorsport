document.addEventListener("DOMContentLoaded", function () {
    const weatherContainer = document.getElementById("weather");
    const currentDateTime = new Date(); // Real-time system date and time
    const currentDateTimeGMT2 = new Date(currentDateTime.getTime() + (2 * 60 * 60 * 1000) - (currentDateTime.getTimezoneOffset() * 60 * 1000)); // Adjust to GMT+2

    // Schedules data with session times, track records, winners, and poles for all F1 races
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
            { date: "2025-03-16", event: "Australia", location: "Melbourne,AU", flag: "AustraliaFlag.jpg", track: "AustraliaTrack.jpg", trackName: "Albert Park Grand Prix Circuit", practice1: "2025-03-14 12:30", practice2: "2025-03-14 16:00", practice3: "2025-03-15 12:30", qualifying: "2025-03-15 16:00", race: "2025-03-16 15:00", timezone: "AEDT", trackRecord: "1:20.235 (Lewis Hamilton, Mercedes, 2023)", lastWinner: "Carlos Sainz (Ferrari, 2024)", lastPole: "Max Verstappen (1:15.915, 2024)" },
            { date: "2025-03-23", event: "China", location: "Shanghai,CN", flag: "ChinaFlag.jpg", track: "ChinaTrack.jpg", trackName: "Shanghai International Circuit", practice1: "2025-03-21 11:30", sprintQualifying: "2025-03-21 15:30", sprintRace: "2025-03-22 11:00", qualifying: "2025-03-22 15:00", race: "2025-03-23 15:00", timezone: "CST", isSprint: true, trackRecord: "1:32.238 (Michael Schumacher, Ferrari, 2004)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Max Verstappen (1:33.660, 2024)" },
            { date: "2025-04-06", event: "Japan", location: "Suzuka,JP", flag: "JapanFlag.jpg", track: "JapanTrack.jpg", trackName: "Suzuka International Racing Course", practice1: "2025-04-04 11:30", practice2: "2025-04-04 15:00", practice3: "2025-04-05 12:30", qualifying: "2025-04-05 15:00", race: "2025-04-06 15:00", timezone: "JST", trackRecord: "1:30.983 (Lewis Hamilton, Mercedes, 2019)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Max Verstappen (1:28.197, 2024)" },
            { date: "2025-04-13", event: "Bahrain", location: "Sakhir,BH", flag: "BahrainFlag.jpg", track: "BahrainTrack.jpg", trackName: "Bahrain International Circuit", practice1: "2025-04-11 13:30", practice2: "2025-04-11 17:00", practice3: "2025-04-12 14:00", qualifying: "2025-04-12 17:00", race: "2025-04-13 17:00", timezone: "AST", trackRecord: "1:31.447 (Pedro de la Rosa, McLaren, 2005)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Max Verstappen (1:29.179, 2024)" },
            { date: "2025-04-20", event: "Saudi Arabia", location: "Jeddah,SA", flag: "SaudiArabiaFlag.jpg", track: "SaudiArabiaTrack.jpg", trackName: "Jeddah Corniche Circuit", practice1: "2025-04-18 15:30", practice2: "2025-04-18 19:00", practice3: "2025-04-19 15:30", qualifying: "2025-04-19 19:00", race: "2025-04-20 19:00", timezone: "AST", trackRecord: "1:30.734 (Lewis Hamilton, Mercedes, 2021)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Max Verstappen (1:27.472, 2024)" },
            { date: "2025-05-04", event: "Miami", location: "Miami,US", flag: "USFlag.jpg", track: "MiamiTrack.jpg", trackName: "Miami International Autodrome", practice1: "2025-05-02 12:30", sprintQualifying: "2025-05-02 16:30", sprintRace: "2025-05-03 12:00", qualifying: "2025-05-03 16:00", race: "2025-05-04 15:00", timezone: "EDT", isSprint: true, trackRecord: "1:29.708 (Max Verstappen, Red Bull, 2023)", lastWinner: "Lando Norris (McLaren, 2024)", lastPole: "Max Verstappen (1:27.241, 2024)" },
            { date: "2025-05-18", event: "Emilia-Romagna (Italy)", location: "Imola,IT", flag: "ItalyFlag.jpg", track: "EmiliaRomagnaTrack.jpg", trackName: "Autodromo Enzo e Dino Ferrari", practice1: "2025-05-16 13:30", practice2: "2025-05-16 17:00", practice3: "2025-05-17 12:30", qualifying: "2025-05-17 16:00", race: "2025-05-18 15:00", timezone: "CEST", trackRecord: "1:15.484 (Lewis Hamilton, Mercedes, 2020)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Max Verstappen (1:14.746, 2024)" },
            { date: "2025-05-25", event: "Monaco", location: "Monaco,MC", flag: "MonacoFlag.jpg", track: "MonacoTrack.jpg", trackName: "Circuit de Monaco", practice1: "2025-05-23 13:30", practice2: "2025-05-23 17:00", practice3: "2025-05-24 12:30", qualifying: "2025-05-24 16:00", race: "2025-05-25 15:00", timezone: "CEST", trackRecord: "1:12.909 (Lewis Hamilton, Mercedes, 2018)", lastWinner: "Charles Leclerc (Ferrari, 2024)", lastPole: "Charles Leclerc (1:10.270, 2024)" },
            { date: "2025-06-01", event: "Spain", location: "Barcelona,ES", flag: "SpainFlag.jpg", track: "SpainTrack.jpg", trackName: "Circuit de Barcelona-Catalunya", practice1: "2025-05-30 13:30", practice2: "2025-05-30 17:00", practice3: "2025-05-31 12:30", qualifying: "2025-05-31 16:00", race: "2025-06-01 15:00", timezone: "CEST", trackRecord: "1:16.330 (Max Verstappen, Red Bull, 2023)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Lando Norris (1:11.383, 2024)" },
            { date: "2025-06-15", event: "Canada", location: "Montreal,CA", flag: "CanadaFlag.jpg", track: "CanadaTrack.jpg", trackName: "Circuit Gilles Villeneuve", practice1: "2025-06-13 13:30", practice2: "2025-06-13 17:00", practice3: "2025-06-14 12:30", qualifying: "2025-06-14 16:00", race: "2025-06-15 14:00", timezone: "EDT", trackRecord: "1:13.078 (Valtteri Bottas, Mercedes, 2019)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "George Russell (1:12.000, 2024)" },
            { date: "2025-06-29", event: "Austria", location: "Spielberg,AT", flag: "AustriaFlag.jpg", track: "AustriaTrack.jpg", trackName: "Red Bull Ring", practice1: "2025-06-27 13:30", practice2: "2025-06-27 17:00", practice3: "2025-06-28 12:30", qualifying: "2025-06-28 16:00", race: "2025-06-29 15:00", timezone: "CEST", trackRecord: "1:05.619 (Carlos Sainz, Ferrari, 2020)", lastWinner: "George Russell (Mercedes, 2024)", lastPole: "Max Verstappen (1:04.314, 2024)" },
            { date: "2025-07-06", event: "Great Britain", location: "Silverstone,GB", flag: "GBFlag.jpg", track: "GreatBritainTrack.jpg", trackName: "Silverstone Circuit", practice1: "2025-07-04 13:30", practice2: "2025-07-04 17:00", practice3: "2025-07-05 12:30", qualifying: "2025-07-05 16:00", race: "2025-07-06 16:00", timezone: "BST", trackRecord: "1:27.097 (Max Verstappen, Red Bull, 2020)", lastWinner: "Lewis Hamilton (Mercedes, 2024)", lastPole: "George Russell (1:25.819, 2024)" },
            { date: "2025-07-27", event: "Belgium", location: "Spa,BE", flag: "BelgiumFlag.jpg", track: "BelgiumTrack.jpg", trackName: "Circuit de Spa-Francorchamps", practice1: "2025-07-25 13:30", sprintQualifying: "2025-07-25 17:30", sprintRace: "2025-07-26 11:00", qualifying: "2025-07-26 15:00", race: "2025-07-27 15:00", timezone: "CEST", isSprint: true, trackRecord: "1:41.252 (Lewis Hamilton, Mercedes, 2020)", lastWinner: "Lewis Hamilton (Mercedes, 2024)", lastPole: "Max Verstappen (1:53.159, 2024)" },
            { date: "2025-08-03", event: "Hungary", location: "Budapest,HU", flag: "HungaryFlag.jpg", track: "HungaryTrack.jpg", trackName: "Hungaroring", practice1: "2025-08-01 13:30", practice2: "2025-08-01 17:00", practice3: "2025-08-02 12:30", qualifying: "2025-08-02 16:00", race: "2025-08-03 15:00", timezone: "CEST", trackRecord: "1:16.627 (Lewis Hamilton, Mercedes, 2020)", lastWinner: "Oscar Piastri (McLaren, 2024)", lastPole: "Lando Norris (1:15.227, 2024)" },
            { date: "2025-08-31", event: "Netherlands", location: "Zandvoort,NL", flag: "NetherlandsFlag.jpg", track: "NetherlandsTrack.jpg", trackName: "Circuit Zandvoort", practice1: "2025-08-29 13:30", practice2: "2025-08-29 17:00", practice3: "2025-08-30 12:30", qualifying: "2025-08-30 16:00", race: "2025-08-31 15:00", timezone: "CEST", trackRecord: "1:11.097 (Lewis Hamilton, Mercedes, 2021)", lastWinner: "Lando Norris (McLaren, 2024)", lastPole: "Lando Norris (1:09.758, 2024)" },
            { date: "2025-09-07", event: "Monza (Italy)", location: "Monza,IT", flag: "ItalyFlag.jpg", track: "MonzaTrack.jpg", trackName: "Autodromo Nazionale Monza", practice1: "2025-09-05 13:30", practice2: "2025-09-05 17:00", practice3: "2025-09-06 12:30", qualifying: "2025-09-06 16:00", race: "2025-09-07 15:00", timezone: "CEST", trackRecord: "1:21.046 (Rubens Barrichello, Ferrari, 2004)", lastWinner: "Charles Leclerc (Ferrari, 2024)", lastPole: "Lando Norris (1:19.327, 2024)" },
            { date: "2025-09-21", event: "Azerbaijan", location: "Baku,AZ", flag: "AzerbaijanFlag.jpg", track: "AzerbaijanTrack.jpg", trackName: "Baku City Circuit", practice1: "2025-09-19 13:30", practice2: "2025-09-19 17:00", practice3: "2025-09-20 12:30", qualifying: "2025-09-20 16:00", race: "2025-09-21 15:00", timezone: "AZT", trackRecord: "1:43.009 (Charles Leclerc, Ferrari, 2019)", lastWinner: "Oscar Piastri (McLaren, 2024)", lastPole: "Charles Leclerc (1:40.203, 2024)" },
            { date: "2025-10-05", event: "Singapore", location: "Singapore,SG", flag: "SingaporeFlag.jpg", track: "SingaporeTrack.jpg", trackName: "Marina Bay Street Circuit", practice1: "2025-10-03 17:30", practice2: "2025-10-03 21:00", practice3: "2025-10-04 18:00", qualifying: "2025-10-04 21:00", race: "2025-10-05 20:00", timezone: "SGT", trackRecord: "1:41.905 (Kevin Magnussen, Haas, 2018)", lastWinner: "Lando Norris (McLaren, 2024)", lastPole: "Lando Norris (1:29.525, 2024)" },
            { date: "2025-10-19", event: "United States", location: "Austin,US", flag: "USFlag.jpg", track: "UnitedStatesTrack.jpg", trackName: "Circuit of the Americas", practice1: "2025-10-17 12:30", sprintQualifying: "2025-10-17 16:30", sprintRace: "2025-10-18 13:00", qualifying: "2025-10-18 17:00", race: "2025-10-19 14:00", timezone: "CDT", isSprint: true, trackRecord: "1:36.169 (Charles Leclerc, Ferrari, 2019)", lastWinner: "Charles Leclerc (Ferrari, 2024)", lastPole: "Lando Norris (1:32.330, 2024)" },
            { date: "2025-10-26", event: "Mexico", location: "Mexico City,MX", flag: "MexicoFlag.jpg", track: "MexicoTrack.jpg", trackName: "Autódromo Hermanos Rodríguez", practice1: "2025-10-24 12:30", practice2: "2025-10-24 16:00", practice3: "2025-10-25 11:30", qualifying: "2025-10-25 15:00", race: "2025-10-26 14:00", timezone: "CST", trackRecord: "1:17.774 (Valtteri Bottas, Mercedes, 2021)", lastWinner: "Carlos Sainz (Ferrari, 2024)", lastPole: "Carlos Sainz (1:15.563, 2024)" },
            { date: "2025-11-09", event: "Brazil", location: "Sao Paulo,BR", flag: "BrazilFlag.jpg", track: "BrazilTrack.jpg", trackName: "Autódromo José Carlos Pace", practice1: "2025-11-07 11:30", sprintQualifying: "2025-11-07 15:30", sprintRace: "2025-11-08 10:00", qualifying: "2025-11-08 14:00", race: "2025-11-09 13:00", timezone: "BRT", isSprint: true, trackRecord: "1:10.540 (Lewis Hamilton, Mercedes, 2021)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Lando Norris (1:23.405, 2024)" },
            { date: "2025-11-22", event: "Las Vegas", location: "Las Vegas,US", flag: "USFlag.jpg", track: "LasVegasTrack.jpg", trackName: "Las Vegas Street Circuit", practice1: "2025-11-20 18:00", practice2: "2025-11-20 22:00", practice3: "2025-11-21 18:00", qualifying: "2025-11-21 22:00", race: "2025-11-22 22:00", timezone: "PST", trackRecord: "1:35.490 (Charles Leclerc, Ferrari, 2023)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "George Russell (1:31.839, 2024)" },
            { date: "2025-11-30", event: "Qatar", location: "Lusail,QA", flag: "QatarFlag.jpg", track: "QatarTrack.jpg", trackName: "Lusail International Circuit", practice1: "2025-11-28 15:30", sprintQualifying: "2025-11-28 19:30", sprintRace: "2025-11-29 14:00", qualifying: "2025-11-29 18:00", race: "2025-11-30 18:00", timezone: "AST", isSprint: true, trackRecord: "1:24.319 (Max Verstappen, Red Bull, 2021)", lastWinner: "Max Verstappen (Red Bull, 2024)", lastPole: "Max Verstappen (1:20.235, 2024)" },
            { date: "2025-12-07", event: "Abu Dhabi", location: "Yas Marina,AE", flag: "AbuDhabiFlag.jpg", track: "AbuDhabiTrack.jpg", trackName: "Yas Marina Circuit", practice1: "2025-12-05 13:30", practice2: "2025-12-05 17:00", practice3: "2025-12-06 14:30", qualifying: "2025-12-06 18:00", race: "2025-12-07 17:00", timezone: "GST", trackRecord: "1:26.103 (Lewis Hamilton, Mercedes, 2021)", lastWinner: "Lando Norris (McLaren, 2024)", lastPole: "Lando Norris (1:22.595, 2024)" }
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
        const currentDate = new Date(currentDateTime);
        currentDate.setHours(0, 0, 0, 0); // Reset to start of day for date comparison
        return schedules.f1.find(event => new Date(event.date) >= currentDate) || schedules.f1[0];
    }

    function displayF1NextRace() {
        const nextRace = getNextF1Race();
        const city = nextRace.location.split(",")[0];
        document.getElementById("f1-next-race").textContent = `Next Race: ${nextRace.event} (${city})`;
        document.getElementById("f1-flag").src = `images/${nextRace.flag}`;
        document.getElementById("f1-track-name").textContent = nextRace.trackName;
        document.getElementById("f1-track").src = `images/${nextRace.track}`;

        // Display session times in GMT+2 with strikethrough/italic for completed
        const timezoneOffsets = {
            "AEDT": -9, "CST": -6, "JST": -7, "AST": -1, "EDT": 6, "CEST": 0, "BST": 1, "AZT": -2, "SGT": -6, "CDT": 7, "BRT": 5, "PST": 10, "GST": -2
        };
        const offset = timezoneOffsets[nextRace.timezone] || 0;
        const formatTime = (dateStr) => {
            const date = new Date(dateStr);
            date.setHours(date.getHours() + offset);
            return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        };
        
        let sessionHTML = "";
        const isSprint = nextRace.isSprint || false;
        const sessions = [
            { label: "Practise 1", time: nextRace.practice1 },
            { label: isSprint ? "Sprint Qualifying" : "Practise 2", time: isSprint ? nextRace.sprintQualifying : nextRace.practice2 },
            { label: isSprint ? "Sprint Race" : "Practise 3", time: isSprint ? nextRace.sprintRace : nextRace.practice3 },
            { label: "Qualifying", time: nextRace.qualifying },
            { label: "Race", time: nextRace.race }
        ];

        sessions.forEach(session => {
            if (session.time) {
                const sessionDate = new Date(session.time);
                sessionDate.setHours(sessionDate.getHours() + offset);
                const isCompleted = sessionDate < currentDateTimeGMT2;
                const timeStr = formatTime(session.time);
                sessionHTML += `${isCompleted ? "<s><i>" : ""}${session.label}: ${timeStr} (GMT+2)${isCompleted ? "</i></s>" : ""}<br>`;
            }
        });
        
        document.getElementById("f1-session-times").innerHTML = sessionHTML || "Session times TBD";

        // Display track record, last winner, and last pole position
        document.getElementById("f1-track-record").textContent = `Track Record: ${nextRace.trackRecord}`;
        document.getElementById("f1-last-winner").textContent = `Last Year's Winner: ${nextRace.lastWinner}`;
        document.getElementById("f1-last-pole").textContent = `Last Year's Pole Position: ${nextRace.lastPole}`;
    }

    function displaySchedules() {
        const currentDate = new Date(currentDateTime);
        currentDate.setHours(0, 0, 0, 0); // Reset to start of day for date comparison
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
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    }
                    scheduleList.appendChild(li);
                });
            }
        });
    }

    function displayUpcomingEvents() {
        const currentDate = new Date(currentDateTime);
        currentDate.setHours(0, 0, 0, 0); // Reset to start of day
        const thirtyDaysLater = new Date(currentDate);
        thirtyDaysLater.setDate(currentDate.getDate() + 30);

        const upcomingList = document.getElementById("upcoming-schedule");

        const allEvents = [];
        Object.keys(schedules).forEach(raceway => {
            schedules[raceway].forEach(event => {
                allEvents.push({ ...event, raceway });
            });
        });

        const upcomingEvents = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= currentDate && eventDate <= thirtyDaysLater;
        });

        if (upcomingEvents.length === 0) {
            upcomingList.innerHTML = "<strong>Upcoming Events:</strong> No events in the next 30 days";
        } else {
            upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
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

    showTab("motorsport");
});
