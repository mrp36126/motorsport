// motorsport.js

function displaySchedules() {
    const categories = ["zwartkops", "ultimate", "rock", "mahem"];
    categories.forEach(category => {
        const scheduleList = document.getElementById(`${category}-schedule`);
        const nextRaceElement = document.getElementById(`${category}-next-race`);
        if (scheduleList && nextRaceElement && schedules[category]) {
            scheduleList.innerHTML = "";
            const now = new Date();
            let nextRace = null;

            schedules[category].forEach(event => {
                const eventDate = new Date(event.date);
                const li = document.createElement("li");
                li.textContent = `${event.date} - ${event.event || "TBC"}`;
                scheduleList.appendChild(li);

                if (!nextRace && eventDate >= now) {
                    nextRace = event;
                }
            });

            nextRaceElement.textContent = nextRace ? `${nextRace.date} - ${nextRace.event || "TBC"}` : "No upcoming races";
        }
    });
}

function displayUpcomingEvents() {
    const upcomingSchedule = document.getElementById("upcoming-schedule");
    if (upcomingSchedule && schedules) {
        const now = new Date();
        let upcomingText = "";

        ["zwartkops", "ultimate", "rock", "mahem"].forEach(category => {
            const nextEvent = schedules[category].find(event => new Date(event.date) >= now);
            if (nextEvent) {
                upcomingText += `${category.toUpperCase()}: ${nextEvent.date} - ${nextEvent.event || "TBC"} | `;
            }
        });

        upcomingSchedule.textContent = upcomingText || "No upcoming events";
    }
}
