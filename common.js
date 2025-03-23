// common.js

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

// Updated Driver Standings (after China, March 23, 2025)
let driverStandings = [
    { position: 1, driver: "Lando Norris", team: "McLaren", points: 44 },
    { position: 2, driver: "Max Verstappen", team: "Red Bull", points: 36 },
    { position: 3, driver: "George Russell", team: "Mercedes", points: 35 },
    { position: 4, driver: "Oscar Piastri", team: "McLaren", points: 34 },
    { position: 5, driver: "Andrea Kimi Antonelli", team: "Mercedes", points: 22 },
    { position: 6, driver: "Alexander Albon", team: "Williams", points: 16 },
    { position: 7, driver: "Lance Stroll", team: "Aston Martin", points: 10 },
    { position: 8, driver: "Esteban Ocon", team: "Alpine", points: 10 },
    { position: 9, driver: "Lewis Hamilton", team: "Ferrari", points: 9 },
    { position: 10, driver: "Charles Leclerc", team: "Ferrari", points: 8 },
    { position: 11, driver: "Nico Hulkenberg", team: "Haas", points: 6 },
    { position: 12, driver: "Oliver Bearman", team: "Haas", points: 4 },
    { position: 13, driver: "Yuki Tsunoda", team: "RB", points: 3 },
    { position: 14, driver: "Carlos Sainz", team: "Williams", points: 1 },
    { position: 15, driver: "Pierre Gasly", team: "Alpine", points: 0 },
    { position: 16, driver: "Jack Doohan", team: "Alpine", points: 0 },
    { position: 17, driver: "Fernando Alonso", team: "Aston Martin", points: 0 },
    { position: 18, driver: "Gabriel Bortoleto", team: "Sauber", points: 0 },
    { position: 19, driver: "Isack Hadjar", team: "RB", points: 0 },
    { position: 20, driver: "Liam Lawson", team: "Red Bull", points: 0 }
    
];

// Updated Constructor Standings (after China, March 23, 2025)
let constructorStandings = [
    { position: 1, team: "McLaren", points: 78, icon: "McLarenIcon.png" },
    { position: 2, team: "Mercedes", points: 57, icon: "MercedesIcon.png" },
    { position: 3, team: "Red Bull", points: 36, icon: "RedBullIcon.png" },
    { position: 4, team: "Ferrari", points: 17, icon: "FerrariIcon.png" },
    { position: 5, team: "Williams", points: 17, icon: "WilliamIcon.png" },
    { position: 6, team: "Haas", points: 14, icon: "HaasIcon.png" },
    { position: 7, team: "Aston Martin", points: 10, icon: "AstonMartinIcon.png" },
    { position: 8, team: "Sauber", points: 6, icon: "SauberIcon.png" },
    { position: 9, team: "RB", points: 3, icon: "RBIcon.png" },
    { position: 10, team: "Alpine", points: 0, icon: "AlpineIcon.png" }
];

// Show tab function
window.showTab = function(tabId) {
    console.log(`Switching to tab: ${tabId}`);

    // Hide all tab content and set default styling for all tabs
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
        console.log(`Hiding tab: ${tab.id}`);
    });
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active", "bg-blue-500", "bg-gray-600", "bg-gray-700");
        tab.classList.add("bg-gray-600");
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
            activeTabButton.classList.remove("bg-gray-600");
            activeTabButton.classList.add("active", "bg-blue-500");
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
        displayF1Standings();
        displayF1StandingsTicker();
        displayF1NextRace();
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
// Show F1 subtab function
window.showF1Subtab = function(subtabId) {
    console.log(`Switching to F1 subtab: ${subtabId}`);

    // Hide all F1 subtab content and set default styling for all subtab buttons
    document.querySelectorAll(".f1-subtab-content").forEach(subtab => {
        subtab.classList.add("hidden");
        console.log(`Hiding F1 subtab: ${subtab.id}`);
    });
    document.querySelectorAll(".f1-subtab").forEach(subtab => {
        subtab.classList.remove("active", "bg-blue-500", "bg-gray-600", "bg-gray-700");
        subtab.classList.add("bg-gray-600");
        console.log(`Setting default background for F1 subtab button: ${subtab.textContent}`);
    });

    // Show the selected subtab and style the active subtab button
    const activeSubtab = document.getElementById(subtabId);
    if (activeSubtab) {
        console.log(`Showing F1 subtab: ${subtabId}`);
        activeSubtab.classList.remove("hidden");
        const activeSubtabButton = document.querySelector(`button[onclick="showF1Subtab('${subtabId}')"]`);
        if (activeSubtabButton) {
            console.log(`Activating button for F1 subtab: ${subtabId}`);
            activeSubtabButton.classList.remove("bg-gray-600");
            activeSubtabButton.classList.add("active", "bg-blue-500");
        } else {
            console.error(`Button for F1 subtab ${subtabId} not found`);
        }
    } else {
        console.error(`F1 subtab ${subtabId} not found in DOM`);
    }
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

// Initialize the page
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    displayF1Standings(); // Initialize standings
    window.showTab("motorsport"); // Default tab
});
