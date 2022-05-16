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
const update_events = setInterval(() => {
    try{
        updateAvailableEvents(calendar)
    } 
    catch(error){
        console.log(error);
        clearInterval(update_events)
}}, 2000, calendar)
upperCaseMonth(calendar)

async function updateAvailableEvents (calendar) {
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

    const data = {
        projectId: projectId
    }

    const response = await fetch('/get-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    const events = await response.json()
    events.forEach((event) => {
        eventArray.push({
            id: event._id.toString(),
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

    const projectId = document.URL.split('/').at(-1)
    const data = {
        projectId: projectId,
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

    updateAvailableEvents(calendar)
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
        const eventOriginalTemplate = document.getElementById('event-template').cloneNode(true)
        calEventsContainer.classList.remove('hidden')
        calEvents.innerHTML = ''
        events.sort((a, b) => new Date(a.start) - new Date(b.start))
        events.forEach((event) => {
            const eventTemplate = eventOriginalTemplate.cloneNode(true)
            eventTemplate.classList.remove('hidden')

            const d = new Date(event.start)
            const dString = `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
            eventTemplate.querySelector('.event-time').innerHTML = dString
            eventTemplate.querySelector('.event-name').innerHTML = event.name
            eventTemplate.setAttribute('id', event.id)
            calEvents.appendChild(eventTemplate)
            eventTemplate.querySelector('.event-delete').addEventListener('click', async (e) => await deleteEventBtnClicked(e.currentTarget), false)
        })
        calEvents.appendChild(eventOriginalTemplate)
    } else {
        calEventsContainer.classList.add('hidden')
    }
}

async function deleteEventBtnClicked (e) {
    const projectId = document.URL.split('/').at(-1)
    const eventId = e.parentElement.getAttribute('id')

    const data = {
        projectId: projectId,
        eventId: eventId
    }

    await fetch('/del-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    await updateAvailableEvents(calendar)
}
