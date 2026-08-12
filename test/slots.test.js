const { expect } = require('chai')
const { getSlots, overlaps, toInstant, toLocalTime } = require('../src/slots')

describe('slots', () => {
    it('builds a slot list for a working day', () => {
        const slots = getSlots('strategy-call', '2026-09-14')
        expect(slots.length).to.be.greaterThan(0)
    })

    it('returns nothing on a weekend', () => {
        const slots = getSlots('strategy-call', '2026-09-13')
        expect(slots.length).to.equal(0)
    })

    it('converts a wall clock time to an instant and back', () => {
        const instant = toInstant('2026-09-14', '18:00')
        expect(toLocalTime(instant)).to.equal('18:00')
    })

    it('spots an overlapping booking', () => {
        const slot = {
            startsAt: toInstant('2026-09-14', '18:00'),
            endsAt: toInstant('2026-09-14', '19:00')
        }
        const booking = {
            startsAt: toInstant('2026-09-14', '18:30').toISOString(),
            endsAt: toInstant('2026-09-14', '19:30').toISOString()
        }
        expect(overlaps(slot, booking)).to.equal(true)
    })
})
