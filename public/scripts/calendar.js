const calendar = new Calendar({
    id: '#calendar-a',
    theme: 'glass',
    weekdayType: 'long-upper',
    monthDisplayType: 'long',
    primaryColor: 'var(--acc-color)',
    headerBackgroundColor: 'var(--pri-color)',
    calendarSize: 'small',
    borderRadius: '0.5rem',
    layoutModifiers: ['month-left-align'],
    dateChanged: (currentDate, events) => updateEventList(events)
})

calendar.monthChanged = () => upperCaseMonth(calendar)
updateAvailableEvents(calendar)
setInterval(updateAvailableEvents, 2000, calendar)
upperCaseMonth(calendar)

async function updateAvailableEvents(calendar) {
    calendar.setEventsData(await getEventsArray())
    upperCaseMonth(calendar)
}

function upperCaseMonth(calendar) {
    calendar.monthDisplay.innerHTML = calendar.monthDisplay.innerHTML.charAt(0).toUpperCase() + calendar.monthDisplay.innerHTML.slice(1)
}

function formatDate(date) {
    const d = new Date(date)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    const year = d.getFullYear()
    return [year, month, day].join('-')
}

async function getEventsArray () {
    const eventArray = []
    const projectId = document.URL.split('/').at(-1)
    const response = await fetch(`/get-events/${projectId}`)
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

function addEventBtnClicked() {
    document
        .getElementById('submit-event-btn-container')
        .classList.remove('hidden')
    document
        .getElementById('add-event-btn-container')
        .classList.add('hidden')
    document
        .getElementById('time')
        .setAttribute('value', formatDate(calendar.currentDate) + 'T12:00')
}

async function submitEventBtnClicked() {
    const time = document
        .getElementById('time').value
    const name = document
        .getElementById('name').value

    const data = {
        time: time,
        name: name
    }

    const projectId = document.URL.split('/').at(-1)
    await fetch(`/add-event/${projectId}`, {
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

    updateAvailableEvents(calendar)
}

function cancelEventBtnClicked() {
    document
        .getElementById('submit-event-btn-container')
        .classList.add('hidden')
    document
        .getElementById('add-event-btn-container')
        .classList.remove('hidden')
}

function updateEventList(events) {
    const calEventsContainer = document.getElementById('cal-events-container')
    const calEvents = document.getElementById('cal-events')
    if (events.length > 0) {
        calEventsContainer.classList.remove('hidden')
        calEvents.innerHTML = ''
        events.forEach((element) => {
            const d = new Date(element.start)
            const dString = `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
            calEvents.innerHTML += `<p class="truncate ...">${dString} - ${element.name}</p>`
        })
    } else {
        calEventsContainer.classList.add('hidden')
    }
}
