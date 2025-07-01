// sport.js

function displayRugbySchedules() {
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

//British and Irish Lions
function displayBILSchedules(){
    const scheduleList = document.getElementById("bil-schedule");
    if (scheduleList && schedules.bil){
        scheduleList.innerHTML = "";
        schedules.bil.forEach(event => {
            const li = document.createElement("li");
            li.textContent = `${event.date} - ${event.event} at ${event.venue} (${event.tome})`;
            scheduleList.appendChild(li);
        });
    }
}
