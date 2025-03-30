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

                // Get the country flag based on the venue (e.g., Suzuka, Japan)
                const countryFlag = event.venue ? event.venue.split(",")[1].toUpperCase() : "UNKNOWN";
                const flagImage = `/images/${countryFlag}Flag.png`; // Path to the flag image

                li.innerHTML = `${event.date} = <img src="${flagImage}" alt="${event.venue}" class="inline-block w-6 h-6"> ${event.event || "TBC"} (${event.venue || "TBC"})`;
                scheduleList.appendChild(li);

                if (!nextRace && eventDate >= now) {
                    nextRace = event;
                }
            });

            nextRaceElement.textContent = nextRace ? `${nextRace.date} - ${nextRace.event || "TBC"} (${nextRace.venue || "TBC"})` : "No upcoming races";
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
