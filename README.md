# booking-app

Node + Express scheduler. `SPEC.md` says what it is supposed to do.
`BUG.md` is the open bug report.

## Running

    npm install
    npm start

Booking page: http://localhost:4000
Host dashboard: http://localhost:4000/dashboard.html

Data is in memory and reseeded on boot, so restarting the server clears everything.

## Layout

    server.js        express app and API routes
    src/store.js     in memory data and seed
    src/slots.js     slot generation and timezone conversion
    src/bookings.js  booking create / list / cancel
    public/          booking page and dashboard
    test/            mocha tests
