// common.js

// Global variables
const weatherContainer = document.getElementById("weather");
const currentDateTime = new Date();
const currentDateTimeGMT2 = new Date(currentDateTime.getTime() + (2 * 60 * 60 * 1000) - (currentDateTime.getTimezoneOffset() * 60 * 1000));

// Schedules data
// common.js

// Global variables
const weatherContainer = document.getElementById("weather");
const currentDateTime = new Date();
const currentDateTimeGMT2 = new Date(currentDateTime.getTime() + (2 * 60 * 60 * 1000) - (currentDateTime.getTimezoneOffset() * 60 * 1000));

// Initialize data as empty
let schedules = {};
let driverStandings = [];
let constructorStandings = [];

// GitHub raw file base URL (replace with your repo)
const githubBaseUrl = "https://raw.githubusercontent.com/mrp36126/motorsport/edit/main/data";

// Function to fetch and parse CSV
async function fetchCSV(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const csvText = await response.text();
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
            error: (error) => reject(error)
        });
    });
}

// Load all data from CSVs
async function loadData() {
    try {
        // Load schedules
        const scheduleCategories = ["zwartkops", "ultimate", "rock", "mahem", "f1", "intRugby"];
        for (const category of scheduleCategories) {
            schedules[category] = await fetchCSV(`${githubBaseUrl}${category}.csv`);
            // Convert isSprint to boolean for F1
            if (category === "f1") {
                schedules[category].forEach(event => {
                    event.isSprint = event.isSprint === "true";
                });
            }
        }

        // Load standings
        driverStandings = await fetchCSV(`${githubBaseUrl}driverStandings.csv`);
        constructorStandings = await fetchCSV(`${githubBaseUrl}constructorStandings.csv`);

        // Convert numeric fields
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

// Update standings function remains the same
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
    await loadData(); // Load data before initializing
    displayF1Standings();
    window.showTab("motorsport");
});

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
    // Initialize F1 subtabs by showing the "Next Race" subtab
    showF1Subtab("f1-next-race-tab");

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
