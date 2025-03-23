// f1.js

function getNextF1Race() {
    const now = new Date(currentDateTimeGMT2);
    const timezoneOffsets = {
        "AEDT": 11, "CST": 8, "JST": 9, "AST": 3, "EDT": -4, "CEST": 2,
        "BST": 1, "AZT": 4, "SGT": 8, "CDT": -5, "BRT": -3, "PST": -8, "GST": 4
    };
    return schedules.f1.find(event => {
        const raceDateTime = new Date(event.race);
        const offset = timezoneOffsets[event.timezone] || 0;
        raceDateTime.setHours(raceDateTime.getHours() - offset + 2); // Convert to GMT+2
        return raceDateTime >= now;
    }) || schedules.f1[0];
}

function displayF1Schedule() {
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);
    const now = new Date(currentDateTimeGMT2);
    const nextF1Race = getNextF1Race();

    const timezoneOffsets = {
        "AEDT": 11, "CST": 8, "JST": 9, "AST": 3, "EDT": -4, "CEST": 2,
        "BST": 1, "AZT": 4, "SGT": 8, "CDT": -5, "BRT": -3, "PST": -8, "GST": 4
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

function displayF1Standings() {
    // Populate Driver Standings List
    const driverStandingsContainer = document.getElementById("f1-driver-standings");
    if (driverStandingsContainer) {
        driverStandingsContainer.innerHTML = `<strong>Driver Standings (After China Race, March 23, 2025):</strong><br>`;
        driverStandings.forEach(driver => {
            const imgTag = `<img src="images/${driver.driver.split(" ")[0]}.png" alt="${driver.driver}" class="driver-image">`;
            driverStandingsContainer.innerHTML += `${driver.position}. ${driver.driver} (${driver.team}) - <strong>${driver.points} pts</strong> ${imgTag}<br>`;
        });
    } else {
        console.error("Driver Standings container not found!");
    }

    // Populate Driver Standings Image
    const driverStandingsImageContainer = document.getElementById("f1-driver-standings-image");
    if (driverStandingsImageContainer) {
        driverStandingsImageContainer.innerHTML = `
            <img src="images/DStandings.png" alt="Driver Standings Image" class="driver-standings-image" style="max-width: 100%; height: auto; margin-top: 10px; margin-bottom: 10px;">
        `;
    } else {
        console.error("Driver Standings image container not found!");
    }

    // Populate Constructor Standings
    const constructorStandingsContainer = document.getElementById("f1-constructor-standings");
    if (constructorStandingsContainer) {
        constructorStandingsContainer.innerHTML = `
            <strong>Constructor Standings (After China, March 23, 2025):</strong><br>
            <img src="images/CStandings.png" alt="Constructor Standings Image" class="constructor-standings-image" style="max-width: 100%; height: auto; margin-top: 10px; margin-bottom: 10px;">
        `;
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
