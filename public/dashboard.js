const API = 'http://localhost:4000/api'

const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
})

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short'
})

const loadHost = async () => {
    const res = await fetch(`${API}/host`)
    const body = await res.json()

    document.getElementById('hours').innerHTML = body.data.availability
        .map((w) => `
            <div class="booking">
                <div><strong>${w.day}</strong></div>
                <span class="muted">${w.start} to ${w.end}</span>
            </div>
        `)
        .join('') + `<p class="muted">All times ${body.data.host.timezone}</p>`

    document.getElementById('eventTypes').innerHTML = body.data.eventTypes
        .map((e) => `
            <div class="booking">
                <div>
                    <strong>${e.title}</strong>
                    <span class="muted">${e.durationMinutes} min, ${e.bufferMinutes} min buffer</span>
                </div>
                <span class="pill">${e.id}</span>
            </div>
        `)
        .join('')
}

const loadBookings = async () => {
    const res = await fetch(`${API}/bookings`)
    const body = await res.json()
    const bookings = body.data

    document.getElementById('bookings').innerHTML = bookings
        .map((b) => `
            <div class="booking">
                <div>
                    <strong>${b.attendeeName}</strong>
                    <span class="muted">${b.attendeeEmail}</span>
                    <span class="muted">${formatDate(b.startsAt)} at ${formatTime(b.startsAt)}</span>
                </div>
                <button class="link" onclick="cancelBooking('${b.id}')">Cancel</button>
            </div>
        `)
        .join('')

    document.getElementById('bookingsEmpty').style.display = bookings.length ? 'none' : 'block'
}

const cancelBooking = async (id) => {
    const res = await fetch(`${API}/bookings/${id}`, { method: 'DELETE' })
    const body = await res.json()

    if (!body.success) {
        alert(`Could not cancel: ${body.error}`)
        return
    }

    loadBookings()
}

loadHost()
loadBookings()
