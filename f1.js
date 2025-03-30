// f1.js

function getNextF1Race() {
    const now = currentDateTimeGMT2; // Use GMT+2 time from common.js
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
            .filter(event => new Date(event.race) >= now)
            .forEach(event => {
                const li = document.createElement("li");
                li.textContent = `${event.date} - ${event.event} (${event.location})`;
                scheduleList.appendChild(li);
            });
    }
}

function displayF1Standings() {
    const driverStandingsDiv = document.getElementById("f1-driver-standings");
    const constructorStandingsDiv = document.getElementById("f1-constructor-standings");

    if (driverStandingsDiv && driverStandings) {
        driverStandingsDiv.innerHTML = driverStandings
            .map(d => `${d.position}. ${d.driver} (${d.team}) - ${d.points} pts`)
            .join("<br>");
    }

    if (constructorStandingsDiv && constructorStandings) {
        constructorStandingsDiv.innerHTML = constructorStandings
            .map(c => `<img src="images/${c.icon}" class="constructor-image"> ${c.position}. ${c.team} - ${c.points} pts`)
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
            .map(c => `${c.position}. ${c.team} - ${c.points}`)
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
            ${nextRace.practice1 ? `<p>Practice 1: ${new Date(nextRace.practice1).toLocaleString()}</p>` : ""}
            ${nextRace.practice2 ? `<p>Practice 2: ${new Date(nextRace.practice2).toLocaleString()}</p>` : ""}
            ${nextRace.practice3 ? `<p>Practice 3: ${new Date(nextRace.practice3).toLocaleString()}</p>` : ""}
            ${nextRace.sprintQualifying ? `<p>Sprint Qualifying: ${new Date(nextRace.sprintQualifying).toLocaleString()}</p>` : ""}
            ${nextRace.sprintRace ? `<p>Sprint Race: ${new Date(nextRace.sprintRace).toLocaleString()}</p>` : ""}
            ${nextRace.qualifying ? `<p>Qualifying: ${new Date(nextRace.qualifying).toLocaleString()}</p>` : ""}
            <p>Race: ${new Date(nextRace.race).toLocaleString()}</p>
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
        const now = new Date(); // Use system time, adjusted to GMT+2 in common.js
        const targetTime = new Date(nextSession.date);
        const timeLeft = targetTime - now;

        // Update current time
        currentTimeDisplay.textContent = currentDateTimeGMT2.toLocaleString();

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
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownDays.textContent = String(days).padStart(2, "0");
        countdownHours.textContent = String(hours).padStart(2, "0");
        countdownMinutes.textContent = String(minutes).padStart(2, "0");
        countdownSeconds.textContent = String(seconds).padStart(2, "0");
    }, 1000);
}
