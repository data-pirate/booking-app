// run everything in UTC so the server behaves the same on every machine
process.env.TZ = 'UTC'

const path = require('path')
const express = require('express')

const { HOST, eventTypes, availability, seed } = require('./src/store')
const { getSlots } = require('./src/slots')
const bookingsService = require('./src/bookings')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/host', (req, res) => {
    res.json({ success: true, data: { host: HOST, eventTypes, availability } })
})

app.get('/api/slots', (req, res) => {
    const slots = getSlots(req.query.eventTypeId, req.query.date)
    res.json({ success: true, data: slots })
})

app.post('/api/bookings', (req, res) => {
    try {
        const booking = bookingsService.create(req.body)
        res.json({ success: true, data: booking })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})

app.get('/api/bookings', (req, res) => {
    res.json({ success: true, data: bookingsService.list() })
})

app.delete('/api/bookings/:id', (req, res) => {
    try {
        const booking = bookingsService.cancel(req.params.id)
        res.json({ success: true, data: booking })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})

seed()

app.listen(4000, () => console.log('http://localhost:4000'))
