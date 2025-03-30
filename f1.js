// f1.js

function getNextF1Race() {
    const now = new Date();
    return schedules.f1.find(event => new Date(event.race) >= now) || schedules.f1[0];
}

function displayF1Schedule() {
    const scheduleList = document.getElementById("f1-schedule");
    if (scheduleList && schedules.f1) {
        scheduleList.innerHTML = "";
        const now = new Date();
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
        document.getElementById("f1-next-race").textContent = `${nextRace.event} - ${nextRace.date}`;
        document.getElementById("f1-flag").src = `images/${nextRace.flag}`;
        document.getElementById("f1-track").src = `images/${nextRace.track}`;
        document.getElementById("f1-track-name").textContent = nextRace.trackName;

        const sessionTimes = document.getElementById("f1-session-times");
        sessionTimes.innerHTML = `
            ${nextRace.practice1 ? `<p>Practice 1: ${new Date(nextRace.practice1).toLocaleString()}</p>` : ""}
            ${nextRace.practice2 ? `<p>Practice 2: ${new Date(nextRace.practice2).toLocaleString()}</p>` : ""}
            ${nextRace.practice3 ? `<p>Practice 3: ${new Date(nextRace.practice3).toLocaleString()}</p>` : ""}
            ${nextRace.qualifying ? `<p>Qualifying: ${new Date(nextRace.qualifying).toLocaleString()}</p>` : ""}
            ${nextRace.sprintQualifying ? `<p>Sprint Qualifying: ${new Date(nextRace.sprintQualifying).toLocaleString()}</p>` : ""}
            ${nextRace.sprintRace ? `<p>Sprint Race: ${new Date(nextRace.sprintRace).toLocaleString()}</p>` : ""}
            <p>Race: ${new Date(nextRace.race).toLocaleString()}</p>
        `;

        updateCountdown(nextRace);
    }
}

function updateCountdown(nextRace) {
    const countdownHours = document.getElementById("f1-countdown-hours");
    const countdownMinutes = document.getElementById("f1-countdown-minutes");
    const countdownSeconds = document.getElementById("f1-countdown-seconds");

    const targetTime = nextRace.isSprint && nextRace.sprintRace ? new Date(nextRace.sprintRace) : new Date(nextRace.race);
    const interval = setInterval(() => {
        const now = new Date();
        const timeLeft = targetTime - now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            countdownHours.textContent = "00";
            countdownMinutes.textContent = "00";
            countdownSeconds.textContent = "00";
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownHours.textContent = String(hours).padStart(2, "0");
        countdownMinutes.textContent = String(minutes).padStart(2, "0");
        countdownSeconds.textContent = String(seconds).padStart(2, "0");
    }, 1000);
}
