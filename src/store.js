// in memory data. no database, everything resets when the server restarts.

const HOST = {
    name: 'Ananya Rao',
    timezone: 'Asia/Kolkata',
    offsetMinutes: 330
}

const availability = [
    { day: 'mon', start: '09:00', end: '19:00' },
    { day: 'tue', start: '09:00', end: '19:00' },
    { day: 'wed', start: '09:00', end: '19:00' },
    { day: 'thu', start: '09:00', end: '19:00' },
    { day: 'fri', start: '09:00', end: '19:00' }
]

const eventTypes = [
    { id: 'intro-call', title: 'Intro call', durationMinutes: 30, bufferMinutes: 15 },
    { id: 'strategy-call', title: 'Strategy call', durationMinutes: 60, bufferMinutes: 60 }
]

const bookings = []

let nextId = 1

const nextBookingId = () => String(nextId++)

// the next weekday, so there is always a working day to look at
const nextWorkingDate = () => {
    const day = new Date(Date.now() + 24 * 60 * 60 * 1000)
    while (day.getUTCDay() === 0 || day.getUTCDay() === 6) {
        day.setUTCDate(day.getUTCDate() + 1)
    }
    return day.toISOString().split('T')[0]
}

// one existing booking so the dashboard is not empty on a fresh boot
const seed = () => {
    const date = nextWorkingDate()

    bookings.push({
        id: nextBookingId(),
        eventTypeId: 'intro-call',
        attendeeName: 'Rohit Menon',
        attendeeEmail: 'rohit@example.com',
        startsAt: `${date}T05:30:00.000Z`,
        endsAt: `${date}T06:00:00.000Z`,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    })
}

module.exports = { HOST, availability, eventTypes, bookings, nextBookingId, nextWorkingDate, seed }
