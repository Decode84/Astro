createCal();

async function eventArray() {
  let eventArray = [];
  const response = await fetch("/get_events");
  const events = await response.json();
  events.forEach((event) => {
    eventArray.push({ name: event.name, start: event.start, end: event.end });
  });
  return eventArray;
}

async function createCal() {
  let calA = new Calendar({
    id: "#calendar-a",
    theme: "glass",
    weekdayType: "long-upper",
    monthDisplayType: "long",
    headerBackgroundColor: "var(--acc-color)",
    primaryColor: "var(--acc-color)",
    calendarSize: "small",
    borderRadius: "0.25rem",
    layoutModifiers: ["month-left-align"],
    eventsData: await eventArray(),

    dateChanged: (currentDate, events) => {
      document.getElementById("cal_events").innerHTML = "";
      document.getElementById("cal_events").classList.remove("bg-white");

      document.getElementById("cal_add").innerHTML =
        '<button id="plus"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg></button><p class="ml-1">Add Event</p>';
      let plus_svg = document
        .getElementById("plus")
        .addEventListener("click", function () {
          document.getElementById("cal_add").innerHTML =
            '<form action="/add_event "method="post">' +
            '<input type="datetime-local" class="my-1 " id="time" name="time">' +
            '<input type="text" class="my-1" name="name" id="name" placeholder="eventname" required />' +
            '<button class="text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" style="background-color: var(--acc-color)" id="submit" type="submit">Add</button>' +
            "</form>";
        });

      if (events.length >= 1) {
        let text = "";
        events.forEach((element) => {
          text +=
            "<p>" + element.name + " " + element.start.slice(-8, -3) + "</p>";
        });
        document.getElementById("cal_events").innerHTML =
          "<h2>Events:</h2> " + text;
        document.getElementById("cal_events").classList.add("bg-white");
      }
    },
    selectedDateClicked: (currentDate, events) => {},

    monthChanged: (currentDate, events) => {},
  });
}
