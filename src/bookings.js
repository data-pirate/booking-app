const { bookings, nextBookingId } = require('./store')
const { getEventType } = require('./slots')

const create = (payload) => {
    const eventType = getEventType(payload.eventTypeId)
    if (!eventType) throw new Error('unknown event type')

    const startsAt = new Date(payload.startsAt)
    const endsAt = new Date(startsAt.getTime() + eventType.durationMinutes * 60 * 1000)

    const clash = bookings.find((b) => b.startsAt === startsAt.toISOString())
    if (clash) throw new Error('that slot is already booked')

    const booking = {
        id: nextBookingId(),
        eventTypeId: payload.eventTypeId,
        attendeeName: payload.attendeeName,
        attendeeEmail: payload.attendeeEmail,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
    }

    bookings.push(booking)

    return booking
}

const list = () => {
    return [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

const cancel = (id) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) throw new Error('booking not found')

    booking.status = 'cancelled'

    return booking
}

module.exports = { create, list, cancel }
