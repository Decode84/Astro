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
        start: "2022-04-20T08:15:00",
        end: "2022-04-20T15:30:00",
      },
      {
        id: 2,
        name: "Fest",
        start: "2022-04-20T19:00:00",
        end: "2022-04-20T23:30:00",
      },
      {
        id: 3,
        name: "Test",
        start: "2022-04-20T20:00:00",
        end: "2022-04-20T23:30:00",
      },
    ],
    dateChanged: (currentDate, events) => {
      document.getElementById("cal_events").innerHTML = "";
      document.getElementById("cal_events").classList.remove("bg-white");

      document.getElementById("cal_add").innerHTML = '<button id="plus"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg></button><p class="ml-1">Add Event</p>'

      if(events.length >= 1 ){
        let text = "";
        events.forEach((element) => {
          text += "<p>"+element.name+ " "+ element.start.slice(-8,-3) + "</p>";
        });
        document.getElementById("cal_events").innerHTML = "<h2>Events:</h2> " + text;
        document.getElementById("cal_events").classList.add("bg-white");
      }
    },
    selectedDateClicked: (currentDate, events) => {
     /*{
        console.log(calA.getSelectedDate());
        console.log(calA.getEventsData());
        calA.addEventsData([{
          start: ,
          end: ,
          name: 'test'
        }]); 
      } */
    },

    monthChanged: (currentDate, events) => {

    },
  });



let plus_svg = document.getElementById("plus").addEventListener('click', function () { 
  document.getElementById("cal_add").innerHTML = '<input type="datetime-local"></input>';

})