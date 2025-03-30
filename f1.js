function displayF1NextRace() {
    const nextRace = getNextF1Race();
    if (nextRace) {
        const nextSession = getNextSession(nextRace);
        document.getElementById("f1-next-race").textContent = `${nextRace.event} - ${nextRace.date}`;
        
        // Assuming flags are in the format like 'JapanFlag.png' for Suzuka, and so on.
        const countryFlag = nextRace.location ? nextRace.location.split(",")[1].toUpperCase() : "UNKNOWN"; // Extract country code from location
        const flagImage = `/images/${countryFlag}Flag.png`; // Path to the flag image
        
        // Set the flag image and track info
        document.getElementById("f1-flag").src = flagImage;
        document.getElementById("f1-track").src = `images/${nextRace.track}`; // Assuming track image is handled similarly
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
