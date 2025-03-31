// f1.js

function getNextF1Race() {
    const now = currentDateTimeGMT2; // Use live SAST from common.js
    return schedules.f1.find(event => {
        const sessionDates = [
            event.practice1,
            event.practice2,
            event.practice3,
            event.sprintQualifying,
            event.sprintRace,
            event.qualifying,
            event.race
        ].filter(Boolean).map(date => new Date(date));
        return sessionDates.some(date => date >= now);
    }) || schedules.f1[0];
}

function getNextSession(event) {
    const now = currentDateTimeGMT2;
    const sessions = [
        { name: "Practice 1", date: event.practice1 },
        { name: "Practice 2", date: event.practice2 },
        { name: "Practice 3", date: event.practice3 },
        { name: "Sprint Qualifying", date: event.sprintQualifying },
        { name: "Sprint Race", date: event.sprintRace },
        { name: "Qualifying", date: event.qualifying },
        { name: "Race", date: event.race }
    ].filter(session => session.date);

    const nextSession = sessions.find(session => new Date(session.date) >= now) || sessions[sessions.length - 1];
    return nextSession;
}

function displayF1Schedule() {
    const scheduleList = document.getElementById("f1-schedule");
    if (scheduleList && schedules.f1) {
        scheduleList.innerHTML = "";
        const now = currentDateTimeGMT2;
        schedules.f1
            .filter(event => new Date(event.race) >= now) // Filter for upcoming races
            .forEach(event => {
                const li = document.createElement("li");
                // Format the date as YYYY/MM/DD
                const eventDate = new Date(event.race); // Assuming 'race' is the main race date
                const formattedDate = `${eventDate.getFullYear()}/${String(eventDate.getMonth() + 1).padStart(2, "0")}/${String(eventDate.getDate()).padStart(2, "0")}`;
                
                // Create the flag image element (assumes 'flag' field exists in CSV)
                const flagImg = event.flag 
                    ? `<img src="images/${event.flag}" alt="${event.event} Flag" class="h-5 w-7 inline-block mr-2">`
                    : ""; // Fallback if no flag is provided
                
                // Construct the text with flag: "YYYY/MM/DD - [flag] Event (Location)"
                li.innerHTML = `${formattedDate} - ${flagImg} ${event.event} (${event.location})`;
                scheduleList.appendChild(li);
            });
    }
}

function displayF1Standings() {
    const driverStandingsDiv = document.getElementById("f1-driver-standings");
    const constructorStandingsDiv = document.getElementById("f1-constructor-standings");

    if (driverStandingsDiv && driverStandings) {
        driverStandingsDiv.innerHTML = driverStandings
            .map(d => `
                ${d.position}. ${d.driver} (${d.team}) - ${d.points} pts
                <br><img src="images/${d.driver}.png" alt="${d.driver} Image" class="driver-image">
            `)
            .join("<br>");
    }

    if (constructorStandingsDiv && constructorStandings) {
        constructorStandingsDiv.innerHTML = constructorStandings
            .map(c => `${c.position}. ${c.team} - ${c.points} pts<br><img src="images/${c.team}.png" alt="${c.team} Logo" class="mt-2">`)
            .join("<br>");
    }
}

function displayF1StandingsTicker() {
    const ticker = document.getElementById("f1-standings-ticker");
    if (ticker && driverStandings && constructorStandings) {
        const driverText = driverStandings
            .slice(0, 5)
            .map(d => `${d.position}. ${d.driver} - ${d.points}`)
            .join(" | ");
        const constructorText = constructorStandings
            .slice(0, 5)
            .map(c => `${c.position}. <img src="images/${c.team}Icon.png" alt="${c.team} Icon" class="ticker-icon"> ${c.team} - ${c.points}`)
            .join(" | ");
        ticker.innerHTML = `Drivers: ${driverText} | Constructors: ${constructorText}`;
    }
}

function displayF1NextRace() {
    const nextRace = getNextF1Race();
    if (nextRace) {
        const nextSession = getNextSession(nextRace);
        document.getElementById("f1-next-race").textContent = `${nextRace.event} - ${nextRace.date}`;
        document.getElementById("f1-flag").src = `images/${nextRace.flag}`;
        document.getElementById("f1-track").src = `images/${nextRace.track}`;
        document.getElementById("f1-track-name").textContent = nextRace.trackName;

        const sessionTimes = document.getElementById("f1-session-times");
        sessionTimes.innerHTML = `
            ${nextRace.practice1 ? `<p>Practice 1: ${nextRace.practice1}</p>` : ""}
            ${nextRace.practice2 ? `<p>Practice 2: ${nextRace.practice2}</p>` : ""}
            ${nextRace.practice3 ? `<p>Practice 3: ${nextRace.practice3}</p>` : ""}
            ${nextRace.sprintQualifying ? `<p>Sprint Qualifying: ${nextRace.sprintQualifying}</p>` : ""}
            ${nextRace.sprintRace ? `<p>Sprint Race: ${nextRace.sprintRace}</p>` : ""}
            ${nextRace.qualifying ? `<p>Qualifying: ${nextRace.qualifying}</p>` : ""}
            <p>Race: ${nextRace.race}</p>
        `;

        updateCountdown(nextSession);
    }
}

function updateCountdown(nextSession) {
    const countdownTitle = document.getElementById("f1-countdown-title");
    const countdownDays = document.getElementById("f1-countdown-days");
    const countdownHours = document.getElementById("f1-countdown-hours");
    const countdownMinutes = document.getElementById("f1-countdown-minutes");
    const countdownSeconds = document.getElementById("f1-countdown-seconds");
    const currentTimeDisplay = document.getElementById("f1-current-time");

    countdownTitle.textContent = `NEXT EVENT: ${nextSession.name.toUpperCase()}`;

    const interval = setInterval(() => {
        const now = currentDateTimeGMT2; // Live SAST from common.js
        const targetTime = new Date(nextSession.date); // SAST from CSV
        const timeLeft = targetTime - now;

        // Display current SAST time directly from currentDateTimeGMT2
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = now.getFullYear();
        currentTimeDisplay.textContent = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;

        // Log for debugging
        console.log("Countdown Now (SAST):", now.toISOString(), "Target:", targetTime.toISOString(), "Time Left (ms):", timeLeft);

        if (timeLeft <= 0) {
            clearInterval(interval);
            countdownDays.textContent = "00";
            countdownHours.textContent = "00";
            countdownMinutes.textContent = "00";
            countdownSeconds.textContent = "00";
            countdownTitle.textContent = "EVENT STARTED";
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownDays.textContent = String(days).padStart(2, "0");
        countdownHours.textContent = String(hoursLeft).padStart(2, "0");
        countdownMinutes.textContent = String(minutesLeft).padStart(2, "0");
        countdownSeconds.textContent = String(secondsLeft).padStart(2, "0");
    }, 1000);
}
