// Define all functions in the global scope to ensure they're available for onclick handlers

// Show tab function
window.showTab = function(tabId) {
    console.log(`Switching to tab: ${tabId}`);

    // Hide all tab content and set default styling for all tabs
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
        console.log(`Hiding tab: ${tab.id}`);
    });
    document.querySelectorAll(".tab").forEach(tab => {
        // Remove all possible background classes to avoid conflicts
        tab.classList.remove("active", "bg-blue-500", "bg-gray-600", "bg-gray-700");
        tab.classList.add("bg-gray-600"); // Apply default gray background to all tabs
        console.log(`Setting default background for tab button: ${tab.textContent}`);
    });

    // Show the selected tab and style the active tab button
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        console.log(`Showing tab: ${tabId}`);
        activeTab.classList.remove("hidden");
        const activeTabButton = document.querySelector(`button[onclick="showTab('${tabId}')"]`);
        if (activeTabButton) {
            console.log(`Activating button for tab: ${tabId}`);
            activeTabButton.classList.remove("bg-gray-600"); // Remove default gray from active tab
            activeTabButton.classList.add("active", "bg-blue-500"); // Apply active and blue background
        } else {
            console.error(`Button for tab ${tabId} not found`);
        }
    } else {
        console.error(`Tab ${tabId} not found in DOM`);
    }

    // Tab-specific logic
    if (tabId === "motorsport") {
        console.log("Executing motorsport logic");
        fetchWeather("motorsport");
        displaySchedules();
        displayUpcomingEvents();
    } else if (tabId === "f1") {
        console.log("Executing F1 logic");
        fetchWeather("f1");
        displayF1Schedule();
        displayF1NextRace();
        displayF1StandingsTicker(); // Already correctly called here
    } else if (tabId === "sport") {
        console.log("Executing sport logic");
        displayRugbySchedules();
    } else if (tabId === "news") {
        console.log("Executing news logic");
        fetchNews().catch(error => {
            console.error("News fetch error:", error);
            const newsContainer = document.getElementById("news-content");
            if (newsContainer) {
                newsContainer.innerHTML = `<p class="text-red-400">Failed to load news: ${error.message}</p>`;
            }
        });
    } else {
        console.warn(`No specific logic defined for tab: ${tabId}`);
    }
};

// Global variables
const weatherContainer = document.getElementById("weather");
const currentDateTime = new Date();
const currentDateTimeGMT2 = new Date(currentDateTime.getTime() + (2 * 60 * 60 * 1000) - (currentDateTime.getTimezoneOffset() * 60 * 1000));

// API Keys (For testing only - move to .env or server-side in production)
// Removed MEDIASTACK_API_KEY since we're now using the /api/news proxy

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
        { date: "2025-03-16", event: "Australia", location: "Melbourne,AU", flag: "AustraliaFlag.jpg", track: "AustraliaTrack.png", trackName: "Albert Park Grand Prix Circuit", practice1: "2025-03-14 12:30", practice2: "2025-03-14 16:00", practice3: "2025-03-15 12:30", qualifying: "2025-03-15 16:00", race: "2025-03-16 15:00", timezone: "AEDT" },
        { date: "2025-03-23", event: "China", location: "Shanghai,CN", flag: "ChinaFlag.jpg", track: "ChinaTrack.png", trackName: "Shanghai International Circuit", practice1: "2025-03-21 11:30", sprintQualifying: "2025-03-21 15:30", sprintRace: "2025-03-22 11:00", qualifying: "2025-03-22 15:00", race: "2025-03-23 15:00", timezone: "CST", isSprint: true },
        { date: "2025-04-06", event: "Japan", location: "Suzuka,JP", flag: "JapanFlag.jpg", track: "JapanTrack.png", trackName: "Suzuka International Racing Course", practice1: "2025-04-04 11:30", practice2: "2025-04-04 15:00", practice3: "2025-04-05 12:30", qualifying: "2025-04-05 15:00", race: "2025-04-06 15:00", timezone: "JST" },
        { date: "2025-04-13", event: "Bahrain", location: "Sakhir,BH", flag: "BahrainFlag.jpg", track: "BahrainTrack.png", trackName: "Bahrain International Circuit", practice1: "2025-04-11 13:30", practice2: "2025-04-11 17:00", practice3: "2025-04-12 14:00", qualifying: "2025-04-12 17:00", race: "2025-04-13 17:00", timezone: "AST" },
        { date: "2025-04-20", event: "Saudi Arabia", location: "Jeddah,SA", flag: "SaudiArabiaFlag.jpg", track: "SaudiArabiaTrack.png", trackName: "Jeddah Corniche Circuit", practice1: "2025-04-18 15:30", practice2: "2025-04-18 19:00", practice3: "2025-04-19 15:30", qualifying: "2025-04-19 19:00", race: "2025-04-20 19:00", timezone: "AST" },
        { date: "2025-05-04", event: "Miami", location: "Miami,US", flag: "USFlag.jpg", track: "MiamiTrack.png", trackName: "Miami International Autodrome", practice1: "2025-05-02 12:30", sprintQualifying: "2025-05-02 16:30", sprintRace: "2025-05-03 12:00", qualifying: "2025-05-03 16:00", race: "2025-05-04 15:00", timezone: "EDT", isSprint: true },
        { date: "2025-05-18", event: "Emilia-Romagna (Italy)", location: "Imola,IT", flag: "ItalyFlag.jpg", track: "EmiliaRomagnaTrack.png", trackName: "Autodromo Enzo e Dino Ferrari", practice1: "2025-05-16 13:30", practice2: "2025-05-16 17:00", practice3: "2025-05-17 12:30", qualifying: "2025-05-17 16:00", race: "2025-05-18 15:00", timezone: "CEST" },
        { date: "2025-05-25", event: "Monaco", location: "Monaco,MC", flag: "MonacoFlag.jpg", track: "MonacoTrack.png", trackName: "Circuit de Monaco", practice1: "2025-05-23 13:30", practice2: "2025-05-23 17:00", practice3: "2025-05-24 12:30", qualifying: "2025-05-24 16:00", race: "2025-05-25 15:00", timezone: "CEST" },
        { date: "2025-06-01", event: "Spain", location: "Barcelona,ES", flag: "SpainFlag.jpg", track: "SpainTrack.png", trackName: "Circuit de Barcelona-Catalunya", practice1: "2025-05-30 13:30", practice2: "2025-05-30 17:00", practice3: "2025-05-31 12:30", qualifying: "2025-05-31 16:00", race: "2025-06-01 15:00", timezone: "CEST" },
        { date: "2025-06-15", event: "Canada", location: "Montreal,CA", flag: "CanadaFlag.jpg", track: "CanadaTrack.png", trackName: "Circuit Gilles Villeneuve", practice1: "2025-06-13 13:30", practice2: "2025-06-13 17:00", practice3: "2025-06-14 12:30", qualifying: "2025-06-14 16:00", race: "2025-06-15 14:00", timezone: "EDT" },
        { date: "2025-06-29", event: "Austria", location: "Spielberg,AT", flag: "AustriaFlag.jpg", track: "AustriaTrack.png", trackName: "Red Bull Ring", practice1: "2025-06-27 13:30", practice2: "2025-06-27 17:00", practice3: "2025-06-28 12:30", qualifying: "2025-06-28 16:00", race: "2025-06-29 15:00", timezone: "CEST" },
        { date: "2025-07-06", event: "Great Britain", location: "Silverstone,GB", flag: "GBFlag.jpg", track: "GreatBritainTrack.png", trackName: "Silverstone Circuit", practice1: "2025-07-04 13:30", practice2: "2025-07-04 17:00", practice3: "2025-07-05 12:30", qualifying: "2025-07-05 16:00", race: "2025-07-06 16:00", timezone: "BST" },
        { date: "2025-07-27", event: "Belgium", location: "Spa,BE", flag: "BelgiumFlag.jpg", track: "BelgiumTrack.png", trackName: "Circuit de Spa-Francorchamps", practice1: "2025-07-25 13:30", sprintQualifying: "2025-07-25 17:30", sprintRace: "2025-07-26 11:00", qualifying: "2025-07-26 15:00", race: "2025-07-27 15:00", timezone: "CEST", isSprint: true },
        { date: "2025-08-03", event: "Hungary", location: "Budapest,HU", flag: "HungaryFlag.jpg", track: "HungaryTrack.png", trackName: "Hungaroring", practice1: "2025-08-01 13:30", practice2: "2025-08-01 17:00", practice3: "2025-08-02 12:30", qualifying: "2025-08-02 16:00", race: "2025-08-03 15:00", timezone: "CEST" },
        { date: "2025-08-31", event: "Netherlands", location: "Zandvoort,NL", flag: "NetherlandsFlag.jpg", track: "NetherlandsTrack.png", trackName: "Circuit Zandvoort", practice1: "2025-08-29 13:30", practice2: "2025-08-29 17:00", practice3: "2025-08-30 12:30", qualifying: "2025-08-30 16:00", race: "2025-08-31 15:00", timezone: "CEST" },
        { date: "2025-09-07", event: "Monza (Italy)", location: "Monza,IT", flag: "ItalyFlag.jpg", track: "MonzaTrack.png", trackName: "Autodromo Nazionale Monza", practice1: "2025-09-05 13:30", practice2: "2025-09-05 17:00", practice3: "2025-09-06 12:30", qualifying: "2025-09-06 16:00", race: "2025-09-07 15:00", timezone: "CEST" },
        { date: "2025-09-21", event: "Azerbaijan", location: "Baku,AZ", flag: "AzerbaijanFlag.jpg", track: "AzerbaijanTrack.png", trackName: "Baku City Circuit", practice1: "2025-09-19 13:30", practice2: "2025-09-19 17:00", practice3: "2025-09-20 12:30", qualifying: "2025-09-20 16:00", race: "2025-09-21 15:00", timezone: "AZT" },
        { date: "2025-10-05", event: "Singapore", location: "Singapore,SG", flag: "SingaporeFlag.jpg", track: "SingaporeTrack.png", trackName: "Marina Bay Street Circuit", practice1: "2025-10-03 17:30", practice2: "2025-10-03 21:00", practice3: "2025-10-04 18:00", qualifying: "2025-10-04 21:00", race: "2025-10-05 20:00", timezone: "SGT" },
        { date: "2025-10-19", event: "United States", location: "Austin,US", flag: "USFlag.jpg", track: "UnitedStatesTrack.png", trackName: "Circuit of the Americas", practice1: "2025-10-17 12:30", sprintQualifying: "2025-10-17 16:30", sprintRace: "2025-10-18 13:00", qualifying: "2025-10-18 17:00", race: "2025-10-19 14:00", timezone: "CDT", isSprint: true },
        { date: "2025-10-26", event: "Mexico", location: "Mexico City,MX", flag: "MexicoFlag.jpg", track: "MexicoTrack.png", trackName: "Autódromo Hermanos Rodríguez", practice1: "2025-10-24 12:30", practice2: "2025-10-24 16:00", practice3: "2025-10-25 11:30", qualifying: "2025-10-25 15:00", race: "2025-10-26 14:00", timezone: "CST" },
        { date: "2025-11-09", event: "Brazil", location: "Sao Paulo,BR", flag: "BrazilFlag.jpg", track: "BrazilTrack.png", trackName: "Autódromo José Carlos Pace", practice1: "2025-11-07 11:30", sprintQualifying: "2025-11-07 15:30", sprintRace: "2025-11-08 10:00", qualifying: "2025-11-08 14:00", race: "2025-11-09 13:00", timezone: "BRT", isSprint: true },
        { date: "2025-11-22", event: "Las Vegas", location: "Las Vegas,US", flag: "USFlag.jpg", track: "LasVegasTrack.png", trackName: "Las Vegas Street Circuit", practice1: "2025-11-20 18:00", practice2: "2025-11-20 22:00", practice3: "2025-11-21 18:00", qualifying: "2025-11-21 22:00", race: "2025-11-22 22:00", timezone: "PST" },
        { date: "2025-11-30", event: "Qatar", location: "Lusail,QA", flag: "QatarFlag.jpg", track: "QatarTrack.png", trackName: "Lusail International Circuit", practice1: "2025-11-28 15:30", sprintQualifying: "2025-11-28 19:30", sprintRace: "2025-11-29 14:00", qualifying: "2025-11-29 18:00", race: "2025-11-30 18:00", timezone: "AST", isSprint: true },
        { date: "2025-12-07", event: "Abu Dhabi", location: "Yas Marina,AE", flag: "AbuDhabiFlag.jpg", track: "AbuDhabiTrack.png", trackName: "Yas Marina Circuit", practice1: "2025-12-05 13:30", practice2: "2025-12-05 17:00", practice3: "2025-12-06 14:30", qualifying: "2025-12-06 18:00", race: "2025-12-07 17:00", timezone: "GST" }
    ],
    intRugby: [
        { date: "2025-01-31", event: "Six Nations: France vs Wales", venue: "Stade de France, Paris", time: "22:15 GMT+2" },
        { date: "2025-02-01", event: "Six Nations: Scotland vs Italy", venue: "Murrayfield, Edinburgh", time: "16:15 GMT+2" },
        { date: "2025-02-01", event: "Six Nations: Ireland vs England", venue: "Aviva Stadium, Dublin", time: "18:45 GMT+2" },
        { date: "2025-02-08", event: "Six Nations: Italy vs Wales", venue: "Stadio Olimpico, Rome", time: "16:15 GMT+2" },
        { date: "2025-02-08", event: "Six Nations: England vs France", venue: "Allianz Stadium, Twickenham, London", time: "18:45 GMT+2" },
        { date: "2025-02-09", event: "Six Nations: Scotland vs Ireland", venue: "Murrayfield, Edinburgh", time: "17:00 GMT+2" },
        { date: "2025-02-22", event: "Six Nations: Wales vs Ireland", venue: "Principality Stadium, Cardiff", time: "16:15 GMT+2" },
        { date: "2025-02-22", event: "Six Nations: England vs Scotland", venue: "Allianz Stadium, Twickenham, London", time: "18:45 GMT+2" },
        { date: "2025-02-23", event: "Six Nations: Italy vs France", venue: "Stadio Olimpico, Rome", time: "17:00 GMT+2" },
        { date: "2025-03-08", event: "Six Nations: Ireland vs France", venue: "Aviva Stadium, Dublin", time: "16:15 GMT+2" },
        { date: "2025-03-08", event: "Six Nations: Scotland vs Wales", venue: "Murrayfield, Edinburgh", time: "18:45 GMT+2" },
        { date: "2025-03-09", event: "Six Nations: England vs Italy", venue: "Allianz Stadium, Twickenham, London", time: "17:00 GMT+2" },
        { date: "2025-03-15", event: "Six Nations: Italy vs Ireland", venue: "Stadio Olimpico, Rome", time: "15:15 GMT+2" },
        { date: "2025-03-15", event: "Six Nations: Wales vs England", venue: "Principality Stadium, Cardiff", time: "19:45 GMT+2" },
        { date: "2025-03-15", event: "Six Nations: France vs Scotland", venue: "Stade de France, Paris", time: "22:00 GMT+2" },
        { date: "2025-06-20", event: "British & Irish Lions vs Argentina", venue: "Aviva Stadium, Dublin", time: "21:00 GMT+2" },
        { date: "2025-07-05", event: "South Africa vs Italy", venue: "TBC", time: "15:00 GMT+2" },
        { date: "2025-07-12", event: "South Africa vs Italy", venue: "TBC", time: "15:00 GMT+2" },
        { date: "2025-07-19", event: "Australia vs British & Irish Lions", venue: "Suncorp Stadium, Brisbane", time: "11:45 GMT+2" },
        { date: "2025-07-26", event: "Australia vs British & Irish Lions", venue: "Melbourne Cricket Ground, Melbourne", time: "11:45 GMT+2" },
        { date: "2025-08-02", event: "Australia vs British & Irish Lions", venue: "Stadium Australia, Sydney", time: "11:45 GMT+2" },
        { date: "2025-08-16", event: "Rugby Championship: South Africa vs Australia", venue: "TBC", time: "15:00 GMT+2" },
        { date: "2025-08-23", event: "Rugby Championship: South Africa vs Australia", venue: "TBC", time: "15:00 GMT+2" },
        { date: "2025-09-06", event: "Rugby Championship: New Zealand vs South Africa", venue: "TBC", time: "09:00 GMT+2" },
        { date: "2025-09-13", event: "Rugby Championship: New Zealand vs South Africa", venue: "TBC", time: "09:00 GMT+2" },
        { date: "2025-09-27", event: "Rugby Championship: South Africa vs Argentina", venue: "TBC", time: "15:00 GMT+2" },
        { date: "2025-10-04", event: "Rugby Championship: Australia vs New Zealand", venue: "TBC", time: "11:00 GMT+2" },
        { date: "2025-10-04", event: "Rugby Championship: Argentina vs South Africa", venue: "London (stadium TBC)", time: "15:00 GMT+2" },
        { date: "2025-11-01", event: "Autumn Nations: England vs Australia", venue: "Allianz Stadium, Twickenham, London", time: "17:00 GMT+2" },
        { date: "2025-11-09", event: "Autumn Nations: Wales vs Argentina", venue: "Principality Stadium, Cardiff", time: "17:10 GMT+2" },
        { date: "2025-11-15", event: "Autumn Nations: England vs New Zealand", venue: "Allianz Stadium, Twickenham, London", time: "17:00 GMT+2" },
        { date: "2025-11-15", event: "Autumn Nations: Ireland vs Australia", venue: "Aviva Stadium, Dublin", time: "19:40 GMT+2" },
        { date: "2025-11-15", event: "Autumn Nations: Scotland vs South Africa", venue: "Murrayfield, Edinburgh", time: "17:10 GMT+2" },
        { date: "2025-11-22", event: "Autumn Nations: Ireland vs South Africa", venue: "Aviva Stadium, Dublin", time: "20:40 GMT+2" },
        { date: "2025-11-22", event: "Autumn Nations: Wales vs New Zealand", venue: "Principality Stadium, Cardiff", time: "17:10 GMT+2" },
        { date: "2025-11-29", event: "Autumn Nations: Wales vs South Africa", venue: "Principality Stadium, Cardiff", time: "17:10 GMT+2" },
        { date: "2025-11-30", event: "Autumn Nations: England vs Argentina", venue: "Allianz Stadium, Twickenham, London", time: "17:00 GMT+2" }
    ]
};

// Helper functions
function fetchWeather(tab) {
    fetch("/api/weather")
        .then(response => {
            if (!response.ok) throw new Error("Weather API error");
            return response.json();
        })
        .then(weatherData => displayWeather(weatherData, tab))
        .catch(error => {
            console.error("Weather fetch error:", error);
            if (tab === "motorsport" && weatherContainer) {
                weatherContainer.innerHTML = `<p class="text-red-400">Failed to load weather data.</p>`;
            } else if (tab === "f1") {
                const f1Temp = document.querySelector("#f1-temp .temp-value");
                const f1Condition = document.querySelector("#f1-condition .condition-value");
                if (f1Temp && f1Condition) {
                    f1Temp.textContent = "Failed to load";
                    f1Condition.textContent = "Failed to load";
                }
            }
        });
}

function displayWeather(data, tab) {
    const nextF1Location = getNextF1Race().location;
    data.forEach(location => {
        const iconUrl = location.icon ? `http://openweathermap.org/img/wn/${location.icon}@2x.png` : '';
        const iconHtml = iconUrl ? `<img src="${iconUrl}" alt="Weather Icon" class="weather-icon-inline">` : '';

        if (tab === "motorsport") {
            if (location.location === "Pretoria,ZA") {
                document.getElementById("zwartkops-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("zwartkops-condition").innerHTML = `Condition: ${iconHtml} ${location.description}`;
                document.getElementById("mahem-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("mahem-condition").innerHTML = `Condition: ${iconHtml} ${location.description}`;
            } else if (location.location === "Vereeniging,ZA") {
                document.getElementById("ultimate-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("ultimate-condition").innerHTML = `Condition: ${iconHtml} ${location.description}`;
            } else if (location.location === "Brakpan,ZA") {
                document.getElementById("rock-temp").textContent = `Temp: ${location.temp}°C`;
                document.getElementById("rock-condition").innerHTML = `Condition: ${iconHtml} ${location.description}`;
            }
        } else if (tab === "f1" && location.location === nextF1Location) {
            document.querySelector("#f1-temp .temp-value").textContent = `${location.temp}°C`;
            document.querySelector("#f1-condition .condition-value").innerHTML = `${iconHtml} ${location.description}`;
        }
    });
}

function getNextF1Race() {
    const now = new Date(currentDateTimeGMT2);
    const timezoneOffsets = {
        "AEDT": -9,
        "CST": -6,
        "JST": -7,
        "AST": -1,
        "EDT": 6,
        "CEST": 0,
        "BST": 1,
        "AZT": -2,
        "SGT": -6,
        "CDT": 7,
        "BRT": 5,
        "PST": 10,
        "GST": -2
    };
    return schedules.f1.find(event => {
        const raceDateTime = new Date(event.race);
        const offset = timezoneOffsets[event.timezone] || 0;
        raceDateTime.setHours(raceDateTime.getHours() + offset);
        return raceDateTime >= now;
    }) || schedules.f1[0];
}

function getNextZwartkopsRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.zwartkops.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.zwartkops[0];
}

function getNextUltimateRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.ultimate.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.ultimate[0];
}

function getNextRockRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.rock.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.rock[0];
}

function getNextMahemRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.mahem.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.mahem[0];
}

function displayF1NextRace() {
    const nextRace = getNextF1Race();
    const city = nextRace.location.split(",")[0];
    document.getElementById("f1-next-race").textContent = `Next Race: ${nextRace.event} (${city})`;
    document.getElementById("f1-flag").src = `images/${nextRace.flag}`;
    document.getElementById("f1-track-name").textContent = nextRace.trackName;
    document.getElementById("f1-track").src = `images/${nextRace.track}`;

    const timezoneOffsets = { "AEDT": -9, "CST": -6, "JST": -7, "AST": -1, "EDT": 6, "CEST": 0, "BST": 1, "AZT": -2, "SGT": -6, "CDT": 7, "BRT": 5, "PST": 10, "GST": -2 };
    const offset = timezoneOffsets[nextRace.timezone] || 0;
    const currentDateTimeGMT2 = new Date(); // Use current date/time adjusted to GMT+2
    currentDateTimeGMT2.setHours(currentDateTimeGMT2.getHours() + 2 - (currentDateTimeGMT2.getTimezoneOffset() / 60));

    // Function to format date with day, full date, and time in GMT+2
    const formatSessionTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        date.setHours(date.getHours() + offset); // Adjust to race timezone
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        const fullDate = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return `${time} (GMT+2) on ${day}, ${fullDate}`;
    };

    let sessionHTML = "";
    const isSprint = nextRace.isSprint || false;
    const sessions = [
        { label: "Practice 1", time: nextRace.practice1 },
        { label: isSprint ? "Sprint Qualifying" : "Practice 2", time: isSprint ? nextRace.sprintQualifying : nextRace.practice2 },
        { label: isSprint ? "Sprint Race" : "Practice 3", time: isSprint ? nextRace.sprintRace : nextRace.practice3 },
        { label: "Qualifying", time: nextRace.qualifying },
        { label: "Race", time: nextRace.race }
    ];

    sessions.forEach(session => {
        if (session.time) {
            const sessionDate = new Date(session.time);
            sessionDate.setHours(sessionDate.getHours() + offset); // Adjust to race timezone
            const isCompleted = sessionDate < currentDateTimeGMT2;
            const formattedTime = formatSessionTime(session.time);
            sessionHTML += `${session.label}: ${formattedTime}${isCompleted ? " <s>(Completed)</s>" : ""}<br>`;
        }
    });

    document.getElementById("f1-session-times").innerHTML = sessionHTML || "Session times TBD";
}

function displaySchedules() {
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);
    const now = new Date(currentDateTimeGMT2);
    const nextZwartkopsRace = getNextZwartkopsRace();
    const nextUltimateRace = getNextUltimateRace();
    const nextRockRace = getNextRockRace();
    const nextMahemRace = getNextMahemRace();

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        return `${day} ${month}`;
    }

    // Exclude F1 from this function since it's handled in the F1 tab
    const raceways = ["zwartkops", "ultimate", "rock", "mahem"];
    raceways.forEach(raceway => {
        const scheduleList = document.getElementById(`${raceway}-schedule`);
        if (scheduleList) {
            scheduleList.innerHTML = "";
            const futureEvents = schedules[raceway].filter(event => new Date(event.date) >= currentDate);

            if (futureEvents.length === 0) {
                scheduleList.innerHTML = "<li>No upcoming events</li>";
            } else {
                futureEvents.forEach((event, index) => {
                    const li = document.createElement("li");
                    let text = event.event ? `${formatDate(event.date)} (${event.event})` : formatDate(event.date);
                    if (event.venue) text += ` at ${event.venue}`;
                    if (event.time) text += `, ${event.time}`;
                    li.textContent = text;

                    if (raceway === "zwartkops" && event.date === nextZwartkopsRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    } else if (raceway === "ultimate" && event.date === nextUltimateRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    } else if (raceway === "rock" && event.date === nextRockRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    } else if (raceway === "mahem" && event.date === nextMahemRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    }
                    scheduleList.appendChild(li);
                });
            }
        }

        if (raceway === "zwartkops") {
            const nextRace = getNextZwartkopsRace();
            document.getElementById("zwartkops-next-race").textContent = `Next Race: ${formatDate(nextRace.date)} (${nextRace.event})`;
        } else if (raceway === "ultimate") {
            const nextRace = getNextUltimateRace();
            const eventText = nextRace.event ? ` (${nextRace.event})` : "";
            document.getElementById("ultimate-next-race").textContent = `Next Race: ${formatDate(nextRace.date)}${eventText}`;
        } else if (raceway === "rock") {
            const nextRace = getNextRockRace();
            const eventText = nextRace.event ? ` (${nextRace.event})` : "";
            document.getElementById("rock-next-race").textContent = `Next Race: ${formatDate(nextRace.date)}${eventText}`;
        } else if (raceway === "mahem") {
            const nextRace = getNextMahemRace();
            const eventText = nextRace.event ? ` (${nextRace.event})` : "";
            document.getElementById("mahem-next-race").textContent = `Next Race: ${formatDate(nextRace.date)}${eventText}`;
        }
    });
}

function displayF1Schedule() {
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);
    const now = new Date(currentDateTimeGMT2);
    const nextF1Race = getNextF1Race();

    const timezoneOffsets = {
        "AEDT": -9,
        "CST": -6,
        "JST": -7,
        "AST": -1,
        "EDT": 6,
        "CEST": 0,
        "BST": 1,
        "AZT": -2,
        "SGT": -6,
        "CDT": 7,
        "BRT": 5,
        "PST": 10,
        "GST": -2
    };

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        return `${day} ${month}`;
    }

    const scheduleList = document.getElementById("f1-schedule");
    if (scheduleList) {
        scheduleList.innerHTML = "";
        const futureEvents = schedules.f1.filter(event => {
            const raceDateTime = new Date(event.race);
            const offset = timezoneOffsets[event.timezone] || 0;
            raceDateTime.setHours(raceDateTime.getHours() + offset);
            return raceDateTime >= now;
        });

        if (futureEvents.length === 0) {
            scheduleList.innerHTML = "<li>No upcoming events</li>";
        } else {
            futureEvents.forEach((event, index) => {
                const li = document.createElement("li");
                let text = event.event ? `${formatDate(event.date)} (${event.event})` : formatDate(event.date);
                if (event.venue) text += ` at ${event.venue}`;
                if (event.time) text += `, ${event.time}`;
                li.textContent = text;

                if (event.date === nextF1Race.date) {
                    li.style.color = "#FFFF00";
                    li.classList.add("font-bold");
                }
                scheduleList.appendChild(li);
            });
        }
    }
}

function displayF1Standings() {
    // Data as of March 20, 2025, after the Australian Grand Prix
    const driverStandingsData = [
        { position: 1, driver: "Lando Norris", team: "McLaren", points: 25 },
        { position: 2, driver: "Max Verstappen", team: "Red Bull", points: 18 },
        { position: 3, driver: "George Russell", team: "Mercedes", points: 15 },
        { position: 4, driver: "Andrea Kimi Antonelli", team: "Mercedes", points: 12 },
        { position: 5, driver: "Alexander Albon", team: "Williams", points: 10 },
        { position: 6, driver: "Lance Stroll", team: "Aston Martin", points: 8 },
        { position: 7, driver: "Nico Hulkenberg", team: "Haas", points: 6 },
        { position: 8, driver: "Charles Leclerc", team: "Ferrari", points: 4 },
        { position: 9, driver: "Oscar Piastri", team: "McLaren", points: 2 },
        { position: 10, driver: "Lewis Hamilton", team: "Ferrari", points: 1 },
        { position: 11, driver: "Pierre Gasly", team: "Alpine", points: 0 },
        { position: 12, driver: "Yuki Tsunoda", team: "RB", points: 0 },
        { position: 13, driver: "Esteban Ocon", team: "Alpine", points: 0 },
        { position: 14, driver: "Oliver Bearman", team: "Haas", points: 0 },
        { position: 15, driver: "Jack Doohan", team: "Alpine", points: 0 },
        { position: 16, driver: "Fernando Alonso", team: "Aston Martin", points: 0 },
        { position: 17, driver: "Gabriel Bortoleto", team: "Sauber", points: 0 },
        { position: 18, driver: "Isack Hadjar", team: "RB", points: 0 },
        { position: 19, driver: "Liam Lawson", team: "Red Bull", points: 0 },
        { position: 20, driver: "Carlos Sainz", team: "Williams", points: 0 }
    ];

    const constructorStandingsData = [
        { position: 1, team: "McLaren", points: 27 },
        { position: 2, team: "Mercedes", points: 27 },
        { position: 3, team: "Red Bull", points: 18 },
        { position: 4, team: "Williams", points: 10 },
        { position: 5, team: "Aston Martin", points: 8 },
        { position: 6, team: "Sauber", points: 6 },
        { position: 7, team: "Ferrari", points: 5 },
        { position: 8, team: "Alpine", points: 0 },
        { position: 9, team: "RB", points: 0 },
        { position: 10, team: "Haas", points: 0 }
    ];

    // Populate Driver Standings
    const driverStandingsContainer = document.getElementById("f1-driver-standings");
    if (driverStandingsContainer) {
        driverStandingsContainer.innerHTML = "<strong>Driver Standings (After Australian GP, March 16, 2025):</strong><br>";
        driverStandingsData.forEach(driver => {
            // Ensure no inline styles for size are applied; rely on CSS
            const imgTag = `<img src="images/${driver.driver.split(" ")[0]}.png" alt="${driver.driver}" class="driver-image">`;
            driverStandingsContainer.innerHTML += `${driver.position}. ${driver.driver} (${driver.team}) - <strong>${driver.points} pts</strong> ${imgTag}<br>`;
        });
    } else {
        console.error("Driver Standings container not found!");
    }

    // Populate Constructor Standings
    const constructorStandingsContainer = document.getElementById("f1-constructor-standings");
    if (constructorStandingsContainer) {
        constructorStandingsContainer.innerHTML = "<strong>Constructor Standings (After Australian GP, March 16, 2025):</strong><br>";
        constructorStandingsData.forEach(constructor => {
            // Ensure no inline styles for size are applied; rely on CSS
            const imgTag = `<img src="images/${constructor.team}.png" alt="${constructor.team} Car" class="constructor-image">`;
            constructorStandingsContainer.innerHTML += `${constructor.position}. ${constructor.team} - ${constructor.points} pts ${imgTag}<br>`;
        });
    } else {
        console.error("Constructor Standings container not found!");
    }
}
function displayF1StandingsTicker() {
    console.log("Entering displayF1StandingsTicker");
    const ticker = document.getElementById("f1-standings-ticker");
    if (!ticker) {
        console.error("F1 standings ticker element not found! Check if #f1-standings-ticker exists in the DOM.");
        return;
    }
    console.log("Ticker element found:", ticker);

    // Data as of March 20, 2025, after the Australian Grand Prix
    const driverStandingsData = [
        { position: 1, driver: "Lando Norris", team: "McLaren", points: 25 },
        { position: 2, driver: "Max Verstappen", team: "Red Bull", points: 18 },
        { position: 3, driver: "George Russell", team: "Mercedes", points: 15 }
    ];

    const constructorStandingsData = [
        { position: 1, team: "McLaren", points: 27, icon: "McLarenIcon.png" },
        { position: 2, team: "Mercedes", points: 27, icon: "MercedesIcon.png" },
        { position: 3, team: "Red Bull", points: 18, icon: "RedBullIcon.png" }
    ];

    // Construct driver text
    const driverText = driverStandingsData.map(driver => 
        `${driver.position}. ${driver.driver} (${driver.team}) - ${driver.points} pts`
    ).join("      •      ");

    // Construct constructor text with inline icons
    const constructorText = constructorStandingsData.map(constructor => {
        const imgTag = `<img src="images/${constructor.icon}" alt="${constructor.team} Icon" class="ticker-icon" style="display:inline; vertical-align:middle;" onerror="console.error('Failed to load icon: images/${constructor.icon}')">`;
        return `${constructor.position}. ${imgTag} ${constructor.team} - ${constructor.points} pts`;
    }).join("      •      ");

    // Combine into ticker content
    const tickerContent = `<strong>Top 3 Drivers:</strong> ${driverText}      •      <strong>Top 3 Constructors:</strong> ${constructorText}`;
    ticker.innerHTML = tickerContent;
    console.log("Ticker content set to:", tickerContent);

    // Verify image loading
    constructorStandingsData.forEach(constructor => {
        const img = new Image();
        img.src = `images/${constructor.icon}`;
        img.onload = () => console.log(`Successfully loaded ${constructor.icon}`);
        img.onerror = () => console.error(`Failed to load ${constructor.icon} - check file path or name`);
    });
}

function displayRugbySchedules() {
    console.log("Displaying rugby schedules");
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        return `${day} ${month}`;
    }

    const category = "intRugby";
    const scheduleList = document.getElementById(`${category}-schedule`);
    console.log(`Looking for schedule list: ${category}-schedule, found: ${scheduleList ? "yes" : "no"}`);
    if (scheduleList) {
        scheduleList.innerHTML = "";
        const futureEvents = schedules[category].filter(event => new Date(event.date) >= currentDate);
        if (futureEvents.length === 0) {
            scheduleList.innerHTML = "<li>No upcoming events</li>";
        } else {
            futureEvents.forEach(event => {
                const li = document.createElement("li");
                let text = event.event ? `${formatDate(event.date)} (${event.event})` : formatDate(event.date);
                if (event.venue) text += ` at ${event.venue}`;
                if (event.time) text += `, ${event.time}`;
                li.textContent = text;

                if (event.event.includes("South Africa")) {
                    li.style.fontWeight = "bold";
                    li.style.color = "#00FF00";
                }

                scheduleList.appendChild(li);
            });
        }
    } else {
        console.error(`Schedule list for ${category} not found`);
    }
}

function displayUpcomingEvents() {
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(currentDate);
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const upcomingList = document.getElementById("upcoming-schedule");
    const allEvents = [];
    Object.keys(schedules).forEach(raceway => {
        schedules[raceway].forEach(event => {
            allEvents.push({ ...event, raceway });
        });
    });

    const upcomingEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= currentDate && eventDate <= sevenDaysLater;
    });

    if (upcomingList) {
        if (upcomingEvents.length === 0) {
            upcomingList.innerHTML = "<strong>Upcoming Events:</strong> No events in the next 7 days";
        } else {
            upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            const eventText = "<strong>Upcoming Events in the next 7 days:</strong> " + upcomingEvents.map(event => {
                const date = new Date(event.date);
                const day = date.getDate();
                const month = date.toLocaleString("default", { month: "long" });
                let text = `${day} ${month} - ${event.raceway.charAt(0).toUpperCase() + event.raceway.slice(1)}`;
                if (event.event) text += ` (${event.event})`;
                if (event.venue) text += ` at ${event.venue}`;
                if (event.time) text += `, ${event.time}`;
                return text;
            }).join("      •      ");
            upcomingList.innerHTML = eventText;
        }
    }
}

function fetchNews() {
    const url = "/api/news"; // Proxy through the serverless function
    console.log("Fetching news from proxy URL:", url); // Log the URL for debugging
    return fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "User-Agent": navigator.userAgent // Mimic the browser's User-Agent
        }
    })
        .then(response => {
            console.log("Response status:", response.status); // Log the status
            console.log("Response headers:", Object.fromEntries(response.headers.entries())); // Log all headers
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Proxy response data:", data); // Log the response data
            // Check for Mediastack response structure
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error("Mediastack API error: Invalid response format");
            }
            displayNews(data);
        })
        .catch(error => {
            console.error("News fetch error:", error);
            const newsContainer = document.getElementById("news-content");
            if (newsContainer) {
                newsContainer.innerHTML = `<p class="text-red-400">Failed to load news: ${error.message}</p>`;
            }
        });
}

function displayNews(data) {
    const newsContainer = document.getElementById("news-content");
    if (newsContainer) {
        newsContainer.innerHTML = "";
        // Use data.data for Mediastack (instead of data.articles for NewsAPI)
        if (data && data.data && data.data.length > 0) {
            data.data.forEach(article => {
                const title = article.title || "No title available";
                const description = article.description || "No description available";
                const url = article.url || "#";
                const source = article.source || "Unknown source";

                const newsHTML = `
                    <div class="news-card bg-gray-800 p-4 rounded-lg shadow-md text-left mb-4">
                        <h3 class="text-lg font-bold">${title}</h3>
                        <p class="text-sm text-gray-400">Source: ${source}</p>
                        <p class="text-sm">${description}</p>
                        <a href="${url}" target="_blank" class="text-blue-400 hover:underline text-sm">Read more</a>
                    </div>
                `;
                newsContainer.innerHTML += newsHTML;
            });
        } else {
            newsContainer.innerHTML = `<p class="text-gray-400">No news articles available.</p>`;
        }
    }
}

// Initialize the page
// Replace the existing DOMContentLoaded listener with this:
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    window.showTab("motorsport"); // Default tab remains motorsport
    displayF1Standings(); // Ensure standings are populated
    if (document.getElementById("f1").classList.contains("active")) {
        console.log("F1 tab is active on load, initializing ticker");
        displayF1StandingsTicker();
    }
});
