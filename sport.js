// sport.js

function displayRugbySchedules() {
    displayInternationalRugbySchedule();
    displayURCSchedule();
}

function displayInternationalRugbySchedule() {
    const scheduleList = document.getElementById("intRugby-schedule");
    if (scheduleList && schedules.intRugby) {
        scheduleList.innerHTML = "";
        schedules.intRugby.forEach(event => {
            const li = document.createElement("li");
            li.textContent = `${event.date} - ${event.event} at ${event.venue} (${event.time})`;
            scheduleList.appendChild(li);
        });
    }
}

function displayURCSchedule() {
    const scheduleList = document.getElementById("urc-schedule");
    if (scheduleList && schedules.urc) {
        scheduleList.innerHTML = "";
        schedules.urc.forEach(event => {
            const li = document.createElement("li");
            li.textContent = `${event.date} - ${event.event} at ${event.venue} (${event.time})`;
            scheduleList.appendChild(li);
        });
    }
}
