// motorsport.js

function getNextZwartkopsRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.zwartkops.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.zwartkops[0];
}

function getNextUltimateRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.ultimate.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.ultimate[0];
}

function getNextRockRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.rock.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.rock[0];
}

function getNextMahemRace() {
    const now = new Date(currentDateTimeGMT2);
    now.setHours(0, 0, 0, 0);
    return schedules.mahem.find(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
    }) || schedules.mahem[0];
}

function displaySchedules() {
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);
    const now = new Date(currentDateTimeGMT2);
    const nextZwartkopsRace = getNextZwartkopsRace();
    const nextUltimateRace = getNextUltimateRace();
    const nextRockRace = getNextRockRace();
    const nextMahemRace = getNextMahemRace();

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        return `${day} ${month}`;
    }

    const raceways = ["zwartkops", "ultimate", "rock", "mahem"];
    raceways.forEach(raceway => {
        const scheduleList = document.getElementById(`${raceway}-schedule`);
        if (scheduleList) {
            scheduleList.innerHTML = "";
            const futureEvents = schedules[raceway].filter(event => new Date(event.date) >= currentDate);

            if (futureEvents.length === 0) {
                scheduleList.innerHTML = "<li>No upcoming events</li>";
            } else {
                futureEvents.forEach((event, index) => {
                    const li = document.createElement("li");
                    let text = event.event ? `${formatDate(event.date)} (${event.event})` : formatDate(event.date);
                    if (event.venue) text += ` at ${event.venue}`;
                    if (event.time) text += `, ${event.time}`;
                    li.textContent = text;

                    if (raceway === "zwartkops" && event.date === nextZwartkopsRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    } else if (raceway === "ultimate" && event.date === nextUltimateRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    } else if (raceway === "rock" && event.date === nextRockRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    } else if (raceway === "mahem" && event.date === nextMahemRace.date && index === 0) {
                        li.style.color = "#FFFF00";
                        li.classList.add("font-bold");
                    }
                    scheduleList.appendChild(li);
                });
            }
        }

        if (raceway === "zwartkops") {
            const nextRace = getNextZwartkopsRace();
            document.getElementById("zwartkops-next-race").textContent = `Next Race: ${formatDate(nextRace.date)} (${nextRace.event})`;
        } else if (raceway === "ultimate") {
            const nextRace = getNextUltimateRace();
            const eventText = nextRace.event ? ` (${nextRace.event})` : "";
            document.getElementById("ultimate-next-race").textContent = `Next Race: ${formatDate(nextRace.date)}${eventText}`;
        } else if (raceway === "rock") {
            const nextRace = getNextRockRace();
            const eventText = nextRace.event ? ` (${nextRace.event})` : "";
            document.getElementById("rock-next-race").textContent = `Next Race: ${formatDate(nextRace.date)}${eventText}`;
        } else if (raceway === "mahem") {
            const nextRace = getNextMahemRace();
            const eventText = nextRace.event ? ` (${nextRace.event})` : "";
            document.getElementById("mahem-next-race").textContent = `Next Race: ${formatDate(nextRace.date)}${eventText}`;
        }
    });
}

function displayUpcomingEvents() {
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(currentDate);
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const upcomingList = document.getElementById("upcoming-schedule");
    const allEvents = [];
    Object.keys(schedules).forEach(raceway => {
        schedules[raceway].forEach(event => {
            allEvents.push({ ...event, raceway });
        });
    });

    const upcomingEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= currentDate && eventDate <= sevenDaysLater;
    });

    if (upcomingList) {
        if (upcomingEvents.length === 0) {
            upcomingList.innerHTML = "<strong>Upcoming Events:</strong> No events in the next 7 days";
        } else {
            upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            const eventText = "<strong>Upcoming Events in the next 7 days:</strong> " + upcomingEvents.map(event => {
                const date = new Date(event.date);
                const day = date.getDate();
                const month = date.toLocaleString("default", { month: "long" });
                let text = `${day} ${month} - ${event.raceway.charAt(0).toUpperCase() + event.raceway.slice(1)}`;
                if (event.event) text += ` (${event.event})`;
                if (event.venue) text += ` at ${event.venue}`;
                if (event.time) text += `, ${event.time}`;
                return text;
            }).join("      •      ");
            upcomingList.innerHTML = eventText;
        }
    }
}
