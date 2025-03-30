// common.js

// Global variables
const weatherContainer = document.getElementById("weather");
let currentDateTimeGMT2;

// Set currentDateTimeGMT2 to South African Standard Time (UTC+2) based on UTC
function updateSAST() {
    const nowUTC = new Date(); // Current UTC time from system
    currentDateTimeGMT2 = new Date(nowUTC.getTime() // + (2 * 60 * 60 * 1000)); // UTC + 2 hours
    console.log("Current SAST:", currentDateTimeGMT2.toISOString(), "Local Display:", currentDateTimeGMT2.toLocaleString("en-ZA"));
}

// Initialize and update SAST every second
updateSAST();
setInterval(updateSAST, 1000);

// Initialize data as empty
let schedules = {};
let driverStandings = [];
let constructorStandings = [];

// Load data from Vercel API
async function loadData() {
    try {
        const response = await fetch("/api/data");
        if (!response.ok) throw new Error("Failed to fetch data from API");
        const csvData = await response.json();

        schedules = {};
        for (const category of ["zwartkops", "ultimate", "rock", "mahem", "f1", "intRugby"]) {
            schedules[category] = Papa.parse(csvData[category], { header: true, skipEmptyLines: true }).data;
            if (category === "f1") {
                schedules[category].forEach(event => {
                    event.isSprint = event.isSprint === "true";
                });
            }
        }

        driverStandings = Papa.parse(csvData.driverStandings, { header: true, skipEmptyLines: true }).data;
        constructorStandings = Papa.parse(csvData.constructorStandings, { header: true, skipEmptyLines: true }).data;

        driverStandings.forEach(d => {
            d.position = parseInt(d.position);
            d.points = parseInt(d.points);
        });
        constructorStandings.forEach(c => {
            c.position = parseInt(c.position);
            c.points = parseInt(c.points);
        });

        console.log("Data loaded:", { schedules, driverStandings, constructorStandings });
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Show tab function
window.showTab = function(tabId) {
    console.log(`Switching to tab: ${tabId}`);
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active", "bg-blue-500", "bg-gray-600");
        tab.classList.add("bg-gray-600");
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.remove("hidden");
        const activeTabButton = document.querySelector(`button[onclick="showTab('${tabId}')"]`);
        if (activeTabButton) {
            activeTabButton.classList.remove("bg-gray-600");
            activeTabButton.classList.add("active", "bg-blue-500");
        }
    }

    if (tabId === "motorsport") {
        fetchWeather("motorsport");
        displaySchedules();
        displayUpcomingEvents();
    } else if (tabId === "f1") {
        fetchWeather("f1");
        displayF1Schedule();
        displayF1Standings();
        displayF1StandingsTicker();
        displayF1NextRace();
        showF1Subtab("f1-next-race-tab");
    } else if (tabId === "sport") {
        displayRugbySchedules();
    } else if (tabId === "news") {
        fetchNews().catch(error => {
            document.getElementById("news-content").innerHTML = `<p class="text-red-400">Failed to load news: ${error.message}</p>`;
        });
    }
};

// Show F1 subtab function
window.showF1Subtab = function(subtabId) {
    console.log(`Switching to F1 subtab: ${subtabId}`);
    document.querySelectorAll(".f1-subtab-content").forEach(subtab => subtab.classList.add("hidden"));
    document.querySelectorAll(".f1-subtab").forEach(subtab => {
        subtab.classList.remove("active", "bg-blue-500", "bg-gray-600");
        subtab.classList.add("bg-gray-600");
    });

    const activeSubtab = document.getElementById(subtabId);
    if (activeSubtab) {
        activeSubtab.classList.remove("hidden");
        const activeSubtabButton = document.querySelector(`button[onclick="showF1Subtab('${subtabId}')"]`);
        if (activeSubtabButton) {
            activeSubtabButton.classList.remove("bg-gray-600");
            activeSubtabButton.classList.add("active", "bg-blue-500");
        }
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
                document.querySelector("#f1-temp .temp-value").textContent = "Failed to load";
                document.querySelector("#f1-condition .condition-value").textContent = "Failed to load";
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
    displayF1Standings();
    const f1Tab = document.getElementById("f1");
    if (f1Tab && !f1Tab.classList.contains("hidden")) {
        displayF1StandingsTicker();
    }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async function() {
    console.log("DOM fully loaded and parsed");
    await loadData();
    displayF1Standings();
    window.showTab("motorsport");
});
