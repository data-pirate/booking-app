const { HOST, availability, eventTypes, bookings } = require('./store')

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

const getEventType = (eventTypeId) => eventTypes.find((e) => e.id === eventTypeId)

const pad = (n) => String(n).padStart(2, '0')

const minutesOf = (hhmm) => {
    const [hours, minutes] = hhmm.split(':').map(Number)
    return hours * 60 + minutes
}

const asTime = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

// '2026-08-13' + '09:00' -> the UTC instant for that wall clock time in the host's timezone
const toInstant = (dateStr, hhmm) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const [hours, minutes] = hhmm.split(':').map(Number)
    const utc = Date.UTC(year, month - 1, day, hours, minutes)
    return new Date(utc - HOST.offsetMinutes * 60 * 1000)
}

// the reverse: a UTC instant -> the host's wall clock time, '18:00'
const toLocalTime = (instant) => {
    const shifted = new Date(instant.getTime() + HOST.offsetMinutes * 60 * 1000)
    return `${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}`
}

const dayKeyFor = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return DAY_KEYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
}

const overlaps = (slot, booking) => {
    const bookingStart = new Date(booking.startsAt)
    const bookingEnd = new Date(booking.endsAt)
    return slot.startsAt < bookingEnd && slot.endsAt > bookingStart
}

// the buffer is dead time after a meeting, so the last meeting of the day has to end
// early enough for its buffer to still fit inside working hours
const applyBuffer = (windows, eventType) => {
    windows.forEach((w) => {
        w.end = asTime(minutesOf(w.end) - eventType.bufferMinutes)
    })

    return windows
}

const getSlots = (eventTypeId, dateStr) => {
    const eventType = getEventType(eventTypeId)
    if (!eventType) return []

    const windows = availability.filter((w) => w.day === dayKeyFor(dateStr))
    if (!windows.length) return []

    applyBuffer(windows, eventType)

    const slots = []

    windows.forEach((window) => {
        const windowStart = toInstant(dateStr, window.start)
        const windowEnd = toInstant(dateStr, window.end)
        let cursor = windowStart

        while (cursor < windowEnd) {
            const endsAt = new Date(cursor.getTime() + eventType.durationMinutes * 60 * 1000)
            const slot = { startsAt: new Date(cursor), endsAt }

            const taken = bookings.some((b) => overlaps(slot, b))

            if (!taken) {
                slots.push({
                    startsAt: slot.startsAt.toISOString(),
                    endsAt: slot.endsAt.toISOString(),
                    localTime: toLocalTime(slot.startsAt)
                })
            }

            cursor = endsAt
        }
    })

    return slots
}

module.exports = { getSlots, getEventType, overlaps, toInstant, toLocalTime, applyBuffer }
