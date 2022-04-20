  let calA = new Calendar({
    id: "#calendar-a",
    theme: "glass",
    weekdayType: "long-upper",
    monthDisplayType: "long",
    // headerColor: "yellow",
    headerBackgroundColor: "var(--acc-color)",
    primaryColor: "var(--acc-color)",
    calendarSize: "small",
    borderRadius: "0.25rem",
    layoutModifiers: ["month-left-align"],
    eventsData: [
      {
        id: 1,
        name: "Gruppearbejde",
        start: "2022-04-20T06:00:00",
        end: "2022-04-21T20:30:00",
      },
    ],
    dateChanged: (currentDate, events) => {
      console.log("date change", currentDate, events);
    },
    monthChanged: (currentDate, events) => {
      console.log("month change", currentDate, events);
    },
  });