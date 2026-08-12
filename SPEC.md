# Booking app - requirements

A small Cal.com style scheduler. One host publishes a booking link, anyone opens it
and picks a free slot. Data lives in memory, there is no database and no login.

## The host
1. The host is Ananya Rao. She works Mon-Fri, 09:00 to 19:00, and she is in
   Asia/Kolkata. Every time shown anywhere in the product is her local time.
2. She has two event types. "Intro call" is 30 minutes with a 15 minute buffer.
   "Strategy call" is 60 minutes with a 60 minute buffer, because she writes up notes
   for an hour after every one. The buffer is dead time reserved after the meeting
   ends, so nothing can be booked into it.

## The booking page
3. Anyone can open the booking page, pick an event type and a date, and see the free
   slots for that date.
4. A slot is free only if it sits inside working hours and does not overlap an
   existing booking or that booking's buffer.
5. The time a visitor picks is the time that gets booked, and it is the same time the
   host sees on her dashboard.
6. Two people must never end up holding the same slot.
7. Booking asks for a name and an email, and both are required.
8. If a booking fails, the visitor is told it failed and why.

## The dashboard
9. The host sees her bookings, newest first, with the attendee name, email and time.
10. She can cancel any booking. A cancelled booking frees its slot immediately.
11. Cancelled bookings are not shown in the list.

## Not in scope
Login, calendar sync, emails, payments, recurring events, multiple hosts.
