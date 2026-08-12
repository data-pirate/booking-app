const API = 'http://localhost:4000/api'

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

let eventTypes = []
let availability = []
let host = null
let selectedSlot = null

const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
})

const loadHost = async () => {
    const res = await fetch(`${API}/host`)
    const body = await res.json()

    host = body.data.host
    eventTypes = body.data.eventTypes
    availability = body.data.availability
    document.getElementById('hostName').textContent = `Book time with ${host.name}`

    const select = document.getElementById('eventType')
    select.innerHTML = eventTypes
        .map((e) => `<option value="${e.id}">${e.title}</option>`)
        .join('')

    renderMeta()
}

const renderMeta = () => {
    const id = document.getElementById('eventType').value
    const eventType = eventTypes.find((e) => e.id === id)
    document.getElementById('eventMeta').textContent =
        `${eventType.durationMinutes} minutes, ${eventType.bufferMinutes} minute buffer after. All times in Asia/Kolkata.`

    const date = document.getElementById('date').value
    const dayKey = date ? DAY_KEYS[new Date(`${date}T00:00:00Z`).getUTCDay()] : null
    const workingDay = availability.find((w) => w.day === dayKey)

    document.getElementById('hostHours').textContent = workingDay
        ? `${host.name} works ${workingDay.start} to ${workingDay.end} on ${dayKey}, ${host.timezone}`
        : `${host.name} does not work on ${dayKey}`
}

const loadSlots = async () => {
    const eventTypeId = document.getElementById('eventType').value
    const date = document.getElementById('date').value
    if (!date) return

    const res = await fetch(`${API}/slots?eventTypeId=${eventTypeId}&date=${date}`)
    const body = await res.json()
    const slots = body.data

    selectedSlot = null
    document.getElementById('selected').textContent = 'No time selected yet.'

    const container = document.getElementById('slots')
    container.innerHTML = slots
        .map((s, i) => `<button class="slot" data-index="${i}">${formatTime(s.startsAt)}</button>`)
        .join('')

    document.getElementById('slotsEmpty').style.display = slots.length ? 'none' : 'block'

    container.querySelectorAll('.slot').forEach((el) => {
        el.addEventListener('click', () => {
            container.querySelectorAll('.slot').forEach((s) => s.classList.remove('selected'))
            el.classList.add('selected')
            selectedSlot = slots[Number(el.dataset.index)]
            document.getElementById('selected').textContent = `Selected ${formatTime(selectedSlot.startsAt)}`
        })
    })
}

const book = async () => {
    if (!selectedSlot) {
        alert('Pick a time first.')
        return
    }

    const payload = {
        eventTypeId: document.getElementById('eventType').value,
        startsAt: selectedSlot.startsAt,
        attendeeName: document.getElementById('name').value,
        attendeeEmail: document.getElementById('email').value
    }

    const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })

    const body = await res.json()

    if (!body.success) {
        alert(`Could not book: ${body.error}`)
        return
    }

    alert(`Booked for ${formatTime(body.data.startsAt)}. See you then.`)

    loadSlots()
}

document.getElementById('eventType').addEventListener('change', () => {
    renderMeta()
    loadSlots()
})

document.getElementById('date').addEventListener('change', () => {
    renderMeta()
    loadSlots()
})
document.getElementById('book').addEventListener('click', book)

const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000)
while (nextDay.getUTCDay() === 0 || nextDay.getUTCDay() === 6) {
    nextDay.setUTCDate(nextDay.getUTCDate() + 1)
}
document.getElementById('date').value = nextDay.toISOString().split('T')[0]

loadHost()
loadSlots()
