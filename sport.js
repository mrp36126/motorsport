// sport.js

function displayRugbySchedules() {
    console.log("Displaying rugby schedules");
    const currentDate = new Date(currentDateTime);
    currentDate.setHours(0, 0, 0, 0);

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        return `${day} ${month}`;
    }

    const category = "intRugby";
    const scheduleList = document.getElementById(`${category}-schedule`);
    console.log(`Looking for schedule list: ${category}-schedule, found: ${scheduleList ? "yes" : "no"}`);
    if (scheduleList) {
        scheduleList.innerHTML = "";
        const futureEvents = schedules[category].filter(event => new Date(event.date) >= currentDate);
        if (futureEvents.length === 0) {
            scheduleList.innerHTML = "<li>No upcoming events</li>";
        } else {
            futureEvents.forEach(event => {
                const li = document.createElement("li");
                let text = event.event ? `${formatDate(event.date)} (${event.event})` : formatDate(event.date);
                if (event.venue) text += ` at ${event.venue}`;
                if (event.time) text += `, ${event.time}`;
                li.textContent = text;

                if (event.event.includes("South Africa")) {
                    li.style.fontWeight = "bold";
                    li.style.color = "#00FF00";
                }

                scheduleList.appendChild(li);
            });
        }
    } else {
        console.error(`Schedule list for ${category} not found`);
    }
}
