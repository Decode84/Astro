createCal()

async function createCal() {
    const calendar = new Calendar({
        id: '#calendar-a',
        theme: 'glass',
        weekdayType: 'long-upper',
        monthDisplayType: 'long',
        primaryColor: 'var(--acc-color)',
        headerBackgroundColor: 'var(--pri-color)',
        headerColor: 'var(--acc-color)',
        calendarSize: 'small',
        borderRadius: '0.25rem',
        layoutModifiers: ['month-left-align'],
        eventsData: await getEventsArray(),

        dateChanged: (currentDate, events) => {
            updateEventList(events)
            document
                .getElementById('time')
                .setAttribute('value', formatDate(currentDate) + 'T12:00')
        },
        selectedDateClicked: (currentDate, events) => { },
        monthChanged: (currentDate, events) => { }
    })
    setInterval(updateAvailableEvents, 2000, calendar)
}

async function updateAvailableEvents (calendar) {
    calendar.setEventsData(await getEventsArray())
}

function formatDate (date) {
    const d = new Date(date)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    const year = d.getFullYear()
    return [year, month, day].join('-')
}

async function getEventsArray () {
    const eventArray = []
    const response = await fetch('/get-events')
    const events = await response.json()
    events.forEach((event) => {
        eventArray.push({
            name: event.name,
            start: event.start,
            end: event.end
        })
    })
    return eventArray
}

function addEventBtnClicked () {
    document
        .getElementById('submit-event-btn-container')
        .classList.remove('hidden')
    document
        .getElementById('add-event-btn-container')
        .classList.add('hidden')
}

async function submitEventBtnClicked () {
    const time = document
        .getElementById('time').value
    const name = document
        .getElementById('name').value

    const data = {
        time: time,
        name: name
    }

    await fetch('/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    document
        .getElementById('submit-event-btn-container')
        .classList.add('hidden')
    document
        .getElementById('add-event-btn-container')
        .classList.remove('hidden')
}

function cancelEventBtnClicked () {
    document
        .getElementById('submit-event-btn-container')
        .classList.add('hidden')
    document
        .getElementById('add-event-btn-container')
        .classList.remove('hidden')
}

function updateEventList (events) {
    const calEventsContainer = document.getElementById('cal-events-container')
    const calEvents = document.getElementById('cal-events')
    if (events.length > 0) {
        calEventsContainer.classList.remove('hidden')
        calEvents.innerHTML = ''
        events.forEach((element) => {
            calEvents.innerHTML += `<p>${element.name} ${element.start.slice(-8, -3)} </p>`
        })
    } else {
        calEventsContainer.classList.add('hidden')
    }
}
