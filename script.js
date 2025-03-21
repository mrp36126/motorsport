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
        displayF1Standings(); // Ensure standings are up-to-date
        displayF1StandingsTicker(); // Update ticker
        displayF1NextRace(); // Ensure this is called to initialize the countdown
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
        { date: "2025-03-16", event: "Australia", location: "Melbourne,AU", flag: "AustraliaFlag.jpg", track: "AustraliaTrack.png", trackName: "Albert Park Grand Prix Circuit", practice1: "2025-03-14T12:30:00", practice2: "2025-03-14T16:00:00", practice3: "2025-03-15T12:30:00", qualifying: "2025-03-15T16:00:00", race: "2025-03-16T15:00:00", timezone: "AEDT" },
        { date: "2025-03-23", event: "China", location: "Shanghai,CN", flag: "ChinaFlag.jpg", track: "ChinaTrack.png", trackName: "Shanghai International Circuit", practice1: "2025-03-21T11:30:00", sprintQualifying: "2025-03-21T15:30:00", sprintRace: "2025-03-22T11:00:00", qualifying: "2025-03-22T15:00:00", race: "2025-03-23T15:00:00", timezone: "CST", isSprint: true },
        { date: "2025-04-06", event: "Japan", location: "Suzuka,JP", flag: "JapanFlag.jpg", track: "JapanTrack.png", trackName: "Suzuka International Racing Course", practice1: "2025-04-04T11:30:00", practice2: "2025-04-04T15:00:00", practice3: "2025-04-05T12:30:00", qualifying: "2025-04-05T15:00:00", race: "2025-04-06T15:00:00", timezone: "JST" },
        { date: "2025-04-13", event: "Bahrain", location: "Sakhir,BH", flag: "BahrainFlag.jpg", track: "BahrainTrack.png", trackName: "Bahrain International Circuit", practice1: "2025-04-11T13:30:00", practice2: "2025-04-11T17:00:00", practice3: "2025-04-12T14:00:00", qualifying: "2025-04-12T17:00:00", race: "2025-04-13T17:00:00", timezone: "AST" },
        { date: "2025-04-20", event: "Saudi Arabia", location: "Jeddah,SA", flag: "SaudiArabiaFlag.jpg", track: "SaudiArabiaTrack.png", trackName: "Jeddah Corniche Circuit", practice1: "2025-04-18T15:30:00", practice2: "2025-04-18T19:00:00", practice3: "2025-04-19T15:30:00", qualifying: "2025-04-19T19:00:00", race: "2025-04-20T19:00:00", timezone: "AST" },
        { date: "2025-05-04", event: "Miami", location: "Miami,US", flag: "USFlag.jpg", track: "MiamiTrack.png", trackName: "Miami International Autodrome", practice1: "2025-05-02T12:30:00", sprintQualifying: "2025-05-02T16:30:00", sprintRace: "2025-05-03T12:00:00", qualifying: "2025-05-03T16:00:00", race: "2025-05-04T15:00:00", timezone: "EDT", isSprint: true },
        { date: "2025-05-18", event: "Emilia-Romagna (Italy)", location: "Imola,IT", flag: "ItalyFlag.jpg", track: "EmiliaRomagnaTrack.png", trackName: "Autodromo Enzo e Dino Ferrari", practice1: "2025-05-16T13:30:00", practice2: "2025-05-16T17:00:00", practice3: "2025-05-17T12:30:00", qualifying: "2025-05-17T16:00:00", race: "2025-05-18T15:00:00", timezone: "CEST" },
        { date: "2025-05-25", event: "Monaco", location: "Monaco,MC", flag: "MonacoFlag.jpg", track: "MonacoTrack.png", trackName: "Circuit de Monaco", practice1: "2025-05-23T13:30:00", practice2: "2025-05-23T17:00:00", practice3: "2025-05-24T12:30:00", qualifying: "2025-05-24T16:00:00", race: "2025-05-25T15:00:00", timezone: "CEST" },
        { date: "2025-06-01", event: "Spain", location: "Barcelona,ES", flag: "SpainFlag.jpg", track: "SpainTrack.png", trackName: "Circuit de Barcelona-Catalunya", practice1: "2025-05-30T13:30:00", practice2: "2025-05-30T17:00:00", practice3: "2025-05-31T12:30:00", qualifying: "2025-05-31T16:00:00", race: "2025-06-01T15:00:00", timezone: "CEST" },
        { date: "2025-06-15", event: "Canada", location: "Montreal,CA", flag: "CanadaFlag.jpg", track: "CanadaTrack.png", trackName: "Circuit Gilles Villeneuve", practice1: "2025-06-13T13:30:00", practice2: "2025-06-13T17:00:00", practice3: "2025-06-14T12:30:00", qualifying: "2025-06-14T16:00:00", race: "2025-06-15T14:00:00", timezone: "EDT" },
        { date: "2025-06-29", event: "Austria", location: "Spielberg,AT", flag: "AustriaFlag.jpg", track: "AustriaTrack.png", trackName: "Red Bull Ring", practice1: "2025-06-27T13:30:00", practice2: "2025-06-27T17:00:00", practice3: "2025-06-28T12:30:00", qualifying: "2025-06-28T16:00:00", race: "2025-06-29T15:00:00", timezone: "CEST" },
        { date: "2025-07-06", event: "Great Britain", location: "Silverstone,GB", flag: "GBFlag.jpg", track: "GreatBritainTrack.png", trackName: "Silverstone Circuit", practice1: "2025-07-04T13:30:00", practice2: "2025-07-04T17:00:00", practice3: "2025-07-05T12:30:00", qualifying: "2025-07-05T16:00:00", race: "2025-07-06T16:00:00", timezone: "BST" },
        { date: "2025-07-27", event: "Belgium", location: "Spa,BE", flag: "BelgiumFlag.jpg", track: "BelgiumTrack.png", trackName: "Circuit de Spa-Francorchamps", practice1: "2025-07-25T13:30:00", sprintQualifying: "2025-07-25T17:30:00", sprintRace: "2025-07-26T11:00:00", qualifying: "2025-07-26T15:00:00", race: "2025-07-27T15:00:00", timezone: "CEST", isSprint: true },
        { date: "2025-08-03", event: "Hungary", location: "Budapest,HU", flag: "HungaryFlag.jpg", track: "HungaryTrack.png", trackName: "Hungaroring", practice1: "2025-08-01T13:30:00", practice2: "2025-08-01T17:00:00", practice3: "2025-08-02T12:30:00", qualifying: "2025-08-02T16:00:00", race: "2025-08-03T15:00:00", timezone: "CEST" },
        { date: "2025-08-31", event: "Netherlands", location: "Zandvoort,NL", flag: "NetherlandsFlag.jpg", track: "NetherlandsTrack.png", trackName: "Circuit Zandvoort", practice1: "2025-08-29T13:30:00", practice2: "2025-08-29T17:00:00", practice3: "2025-08-30T12:30:00", qualifying: "2025-08-30T16:00:00", race: "2025-08-31T15:00:00", timezone: "CEST" },
        { date: "2025-09-07", event: "Monza (Italy)", location: "Monza,IT", flag: "ItalyFlag.jpg", track: "MonzaTrack.png", trackName: "Autodromo Nazionale Monza", practice1: "2025-09-05T13:30:00", practice2: "2025-09-05T17:00:00", practice3: "2025-09-06T12:30:00", qualifying: "2025-09-06T16:00:00", race: "2025-09-07T15:00:00", timezone: "CEST" },
        { date: "2025-09-21", event: "Azerbaijan", location: "Baku,AZ", flag: "AzerbaijanFlag.jpg", track: "AzerbaijanTrack.png", trackName: "Baku City Circuit", practice1: "2025-09-19T13:30:00", practice2: "2025-09-19T17:00:00", practice3: "2025-09-20T12:30:00", qualifying: "2025-09-20T16:00:00", race: "2025-09-21T15:00:00", timezone: "AZT" },
        { date: "2025-10-05", event: "Singapore", location: "Singapore,SG", flag: "SingaporeFlag.jpg", track: "SingaporeTrack.png", trackName: "Marina Bay Street Circuit", practice1: "2025-10-03T17:30:00", practice2: "2025-10-03T21:00:00", practice3: "2025-10-04T18:00:00", qualifying: "2025-10-04T21:00:00", race: "2025-10-05T20:00:00", timezone: "SGT" },
        { date: "2025-10-19", event: "United States", location: "Austin,US", flag: "USFlag.jpg", track: "UnitedStatesTrack.png", trackName: "Circuit of the Americas", practice1: "2025-10-17T12:30:00", sprintQualifying: "2025-10-17T16:30:00", sprintRace: "2025-10-18T13:00:00", qualifying: "2025-10-18T17:00:00", race: "2025-10-19T14:00:00", timezone: "CDT", isSprint: true },
        { date: "2025-10-26", event: "Mexico", location: "Mexico City,MX", flag: "MexicoFlag.jpg", track: "MexicoTrack.png", trackName: "Autódromo Hermanos Rodríguez", practice1: "2025-10-24T12:30:00", practice2: "2025-10-24T16:00:00", practice3: "2025-10-25T11:30:00", qualifying: "2025-10-25T15:00:00", race: "2025-10-26T14:00:00", timezone: "CST" },
        { date: "2025-11-09", event: "Brazil", location: "Sao Paulo,BR", flag: "BrazilFlag.jpg", track: "BrazilTrack.png", trackName: "Autódromo José Carlos Pace", practice1: "2025-11-07T11:30:00", sprintQualifying: "2025-11-07T15:30:00", sprintRace: "2025-11-08T10:00:00", qualifying: "2025-11-08T14:00:00", race: "2025-11-09T13:00:00", timezone: "BRT", isSprint: true },
        { date: "2025-11-22", event: "Las Vegas", location: "Las Vegas,US", flag: "USFlag.jpg", track: "LasVegasTrack.png", trackName: "Las Vegas Street Circuit", practice1: "2025-11-20T18:00:00", practice2: "2025-11-20T22:00:00", practice3: "2025-11-21T18:00:00", qualifying: "2025-11-21T22:00:00", race: "2025-11-22T22:00:00", timezone: "PST" },
        { date: "2025-11-30", event: "Qatar", location: "Lusail,QA", flag: "QatarFlag.jpg", track: "QatarTrack.png", trackName: "Lusail International Circuit", practice1: "2025-11-28T15:30:00", sprintQualifying: "2025-11-28T19:30:00", sprintRace: "2025-11-29T14:00:00", qualifying: "2025-11-29T18:00:00", race: "2025-11-30T18:00:00", timezone: "AST", isSprint: true },
        { date: "2025-12-07", event: "Abu Dhabi", location: "Yas Marina,AE", flag: "AbuDhabiFlag.jpg", track: "AbuDhabiTrack.png", trackName: "Yas Marina Circuit", practice1: "2025-12-05T13:30:00", practice2: "2025-12-05T17:00:00", practice3: "2025-12-06T14:30:00", qualifying: "2025-12-06T18:00:00", race: "2025-12-07T17:00:00", timezone: "GST" }
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

// Standings data (updated after China Sprint, March 23, 2025)
let driverStandings = [
    { position: 1, driver: "Lando Norris", team: "McLaren", points: 26 },
    { position: 2, driver: "Max Verstappen", team: "Red Bull", points: 24 },
    { position: 3, driver: "George Russell", team: "Mercedes", points: 20 },
    { position: 4, driver: "Andrea Kimi Antonelli", team: "Mercedes", points: 14 },
    { position: 5, driver: "Alexander Albon", team: "Williams", points: 10 },
    { position: 6, driver: "Oscar Piastri", team: "McLaren", points: 9 },
    { position: 7, driver: "Lewis Hamilton", team: "Ferrari", points: 9 },
    { position: 8, driver: "Lance Stroll", team: "Aston Martin", points: 8 },
    { position: 9, driver: "Charles Leclerc", team: "Ferrari", points: 8 },
    { position: 10, driver: "Nico Hulkenberg", team: "Haas", points: 6 },
    { position: 11, driver: "Yuki Tsunoda", team: "RB", points: 3 },
    { position: 12, driver: "Pierre Gasly", team: "Alpine", points: 0 },
    { position: 13, driver: "Esteban Ocon", team: "Alpine", points: 0 },
    { position: 14, driver: "Oliver Bearman", team: "Haas", points: 0 },
    { position: 15, driver: "Jack Doohan", team: "Alpine", points: 0 },
    { position: 16, driver: "Fernando Alonso", team: "Aston Martin", points: 0 },
    { position: 17, driver: "Gabriel Bortoleto", team: "Sauber", points: 0 },
    { position: 18, driver: "Isack Hadjar", team: "RB", points: 0 },
    { position: 19, driver: "Liam Lawson", team: "Red Bull", points: 0 },
    { position: 20, driver: "Carlos Sainz", team: "Williams", points: 0 }
];

let constructorStandings = [
    { position: 1, team: "McLaren", points: 35, icon: "McLarenIcon.png" },
    { position: 2, team: "Mercedes", points: 34, icon: "MercedesIcon.png" },
    { position: 3, team: "Red Bull", points: 24, icon: "RedBullIcon.png" },
    { position: 4, team: "Ferrari", points: 22 },
    { position: 5, team: "Williams", points: 10 },
    { position: 6, team: "Aston Martin", points: 8 },
    { position: 7, team: "Sauber", points: 6 },
    { position: 8, team: "RB", points: 3 },
    { position: 9, team: "Alpine", points: 0 },
    { position: 10, team: "Haas", points: 0 }
];

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
        "AEDT": 11,
        "CST": 8,
        "JST": 9,
        "AST": 3,
        "EDT": -4,
        "CEST": 2,
        "BST": 1,
        "AZT": 4,
        "SGT": 8,
        "CDT": -5,
        "BRT": -3,
        "PST": -8,
        "GST": 4
    };
    return schedules.f1.find(event => {
        const raceDateTime = new Date(event.race);
        const offset = timezoneOffsets[event.timezone] || 0;
        raceDateTime.setHours(raceDateTime.getHours() - offset + 2); // Convert to GMT+2
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

    // Timezone offsets (hours to add to GMT to get local time)
    const timezoneOffsets = {
        "AEDT": 11, "CST": 8, "JST": 9, "AST": 3, "EDT": -4, "CEST": 2, 
        "BST": 1, "AZT": 4, "SGT": 8, "CDT": -5, "BRT": -3, "PST": -8, "GST": 4
    };

    // Current time in GMT+2 (SAST)
    const now = new Date();
    const currentDateTimeGMT2 = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));

    // Function to format date with day, full date, and time in GMT+2
    const formatSessionTime = (dateStr, timezone) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const offset = timezoneOffsets[timezone] || 0;
        date.setHours(date.getHours() - offset + 2); // Convert to GMT+2
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        const fullDate = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return `${time} (GMT+2) on ${day}, ${fullDate}`;
    };

    // Define all sessions for the race
    const isSprint = nextRace.isSprint || false;
    const sessions = [
        { label: "Practice 1", time: nextRace.practice1 },
        { label: isSprint ? "Sprint Qualifying" : "Practice 2", time: isSprint ? nextRace.sprintQualifying : nextRace.practice2 },
        { label: isSprint ? "Sprint" : "Practice 3", time: isSprint ? nextRace.sprintRace : nextRace.practice3 },
        { label: "Qualifying", time: nextRace.qualifying },
        { label: "Race", time: nextRace.race }
    ];

    // Update session times display
    let sessionHTML = "";
    sessions.forEach(session => {
        if (session.time) {
            const sessionDate = new Date(session.time);
            const offset = timezoneOffsets[nextRace.timezone] || 0;
            sessionDate.setHours(sessionDate.getHours() - offset + 2); // Convert to GMT+2
            const isCompleted = sessionDate < currentDateTimeGMT2;
            const formattedTime = formatSessionTime(session.time, nextRace.timezone);
            sessionHTML += `${session.label}: ${formattedTime}${isCompleted ? " <s>(Completed)</s>" : ""}<br>`;
        }
    });
    document.getElementById("f1-session-times").innerHTML = sessionHTML || "Session times TBD";

    // Countdown logic
    const countdownContainer = document.getElementById("f1-countdown");
    if (!countdownContainer) {
        console.error("Countdown container not found!");
        return;
    }

    const countdownTitle = countdownContainer.querySelector(".countdown-title");
    const hoursElement = document.getElementById("f1-countdown-hours");
    const minutesElement = document.getElementById("f1-countdown-minutes");
    const secondsElement = document.getElementById("f1-countdown-seconds");

    if (!countdownTitle || !hoursElement || !minutesElement || !secondsElement) {
        console.error("Countdown elements not found!");
        return;
    }

    let currentSessionIndex = -1;
    let countdownInterval = null;

    const updateCountdown = () => {
        const now = new Date();
        const currentDateTimeGMT2 = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));

        // Find the next uncompleted session
        let nextSession = null;
        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].time) {
                const sessionDate = new Date(sessions[i].time);
                const offset = timezoneOffsets[nextRace.timezone] || 0;
                sessionDate.setHours(sessionDate.getHours() - offset + 2); // Convert to GMT+2
                if (sessionDate > currentDateTimeGMT2) {
                    nextSession = sessions[i];
                    if (i !== currentSessionIndex) {
                        currentSessionIndex = i;
                        countdownTitle.textContent = nextSession.label.toUpperCase();
                    }
                    break;
                }
            }
        }

        if (!nextSession) {
            // All sessions for this race are completed, reset to zeros and stop
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            countdownTitle.textContent = "RACE OVER";
            clearInterval(countdownInterval);
            // Check for the next race
            const nextF1Race = getNextF1Race();
            if (nextF1Race.date !== nextRace.date) {
                console.log("Current race completed, switching to next race");
                setTimeout(() => displayF1NextRace(), 1000); // Restart for next race after 1 second
            }
            return;
        }

        const sessionTime = new Date(nextSession.time);
        const offset = timezoneOffsets[nextRace.timezone] || 0;
        sessionTime.setHours(sessionTime.getHours() - offset + 2); // Convert to GMT+2
        const timeDiff = sessionTime - currentDateTimeGMT2;

        if (timeDiff <= 0) {
            // Session has started, move to next session on next tick
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
        } else {
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            hoursElement.textContent = String(hours).padStart(2, "0");
            minutesElement.textContent = String(minutes).padStart(2, "0");
            secondsElement.textContent = String(seconds).padStart(2, "0");
        }
    };

    // Clear any existing interval to avoid duplicates
    if (countdownInterval) clearInterval(countdownInterval);

    // Initial update
    updateCountdown();
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
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
        "AEDT": 11,
        "CST": 8,
        "JST": 9,
        "AST": 3,
        "EDT": -4,
        "CEST": 2,
        "BST": 1,
        "AZT": 4,
        "SGT": 8,
        "CDT": -5,
        "BRT": -3,
        "PST": -8,
        "GST": 4
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
            raceDateTime.setHours(raceDateTime.getHours() - offset + 2); // Convert to GMT+2
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
    // Populate Driver Standings
    const driverStandingsContainer = document.getElementById("f1-driver-standings");
    if (driverStandingsContainer) {
        driverStandingsContainer.innerHTML = "<strong>Driver Standings (After China Sprint, March 23, 2025):</strong><br>";
        driverStandings.forEach(driver => {
            const imgTag = `<img src="images/${driver.driver.split(" ")[0]}.png" alt="${driver.driver}" class="driver-image">`;
            driverStandingsContainer.innerHTML += `${driver.position}. ${driver.driver} (${driver.team}) - <strong>${driver.points} pts</strong> ${imgTag}<br>`;
        });
    } else {
        console.error("Driver Standings container not found!");
    }

    // Populate Constructor Standings
    const constructorStandingsContainer = document.getElementById("f1-constructor-standings");
    if (constructorStandingsContainer) {
        constructorStandingsContainer.innerHTML = "<strong>Constructor Standings (After China Sprint, March 23, 2025):</strong><br>";
        constructorStandings.forEach(constructor => {
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

    // Get top 3 drivers and constructors from shared data
    const topDrivers = driverStandings.slice(0, 3);
    const topConstructors = constructorStandings.slice(0, 3);

    // Construct driver text
    const driverText = topDrivers.map(driver => 
        `${driver.position}. ${driver.driver} (${driver.team}) - ${driver.points} pts`
    ).join("      •      ");

    // Construct constructor text with inline icons
    const constructorText = topConstructors.map(constructor => {
        const imgTag = constructor.icon 
            ? `<img src="images/${constructor.icon}" alt="${constructor.team} Icon" class="ticker-icon" style="display:inline; vertical-align:middle;" onerror="console.error('Failed to load icon: images/${constructor.icon}')">`
            : '';
        return `${constructor.position}. ${imgTag} ${constructor.team} - ${constructor.points} pts`;
    }).join("      •      ");

    // Combine into ticker content
    const tickerContent = `<strong>Top 3 Drivers:</strong> ${driverText}      •      <strong>Top 3 Constructors:</strong> ${constructorText}`;
    ticker.innerHTML = tickerContent;
    console.log("Ticker content set to:", tickerContent);

    // Verify image loading for constructors with icons
    topConstructors.forEach(constructor => {
        if (constructor.icon) {
            const img = new Image();
            img.src = `images/${constructor.icon}`;
            img.onload = () => console.log(`Successfully loaded ${constructor.icon}`);
            img.onerror = () => console.error(`Failed to load ${constructor.icon} - check file path or name`);
        }
    });
}

function updateF1Standings(newDriverStandings, newConstructorStandings) {
    driverStandings = newDriverStandings;
    constructorStandings = newConstructorStandings;

    // Update the standings display
    displayF1Standings();

    // Update the ticker if the F1 tab is active
    const f1Tab = document.getElementById("f1");
    if (f1Tab && !f1Tab.classList.contains("hidden")) {
        displayF1StandingsTicker();
    }
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
    const url = "/api/news";
    console.log("Fetching news from proxy URL:", url);
    return fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "User-Agent": navigator.userAgent
        }
    })
        .then(response => {
            console.log("Response status:", response.status);
            console.log("Response headers:", Object.fromEntries(response.headers.entries()));
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Proxy response data:", data);
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
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    displayF1Standings(); // Initialize standings
    window.showTab("motorsport"); // Default tab remains motorsport
});
