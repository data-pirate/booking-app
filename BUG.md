# Bug report

**From:** Ananya (host)
**Priority:** high, I have lost three evening calls to this

My working hours are 09:00 to 19:00, Monday to Friday. I set that once months ago and
I have not touched it since.

## Steps to reproduce

1. Restart the server, open the dashboard. Every day correctly says 09:00 to 19:00.
2. Open the booking page, pick Strategy call and tomorrow's date. The latest slot
   offered is **5:00 pm**.
3. Refresh the booking page. The latest slot is now **4:00 pm**.
4. Refresh again. **3:00 pm**.
5. Open the dashboard. That one day now says I finish at **16:00**. The other four
   still say 19:00.

**Expected:** the same slots every time. Nobody changed anything between refreshes.
**Actual:** my day gets an hour shorter every time somebody opens my booking page.

## Other things I have noticed

- It is only ever the day I have been looking at. The other four days stay at 19:00
  until I look at them.
- Switching to Intro call makes it shrink in smaller steps instead of a full hour.
- Restarting the server puts everything back to 09:00 to 19:00, and then it starts
  sliding again.
- The day I posted my link on LinkedIn, my whole afternoon was gone by lunchtime.
- Separately, and I do not know if it is the same problem: even immediately after a
  restart, the last strategy call I am offered is 5:00 pm, not 6:00 pm. I work until
  19:00, so a 6:00 to 7:00 call should be bookable.

Kaushik asked me to check the obvious things first: I have not edited my availability,
there is only one host, and my laptop clock is fine.

Please find out why, and fix it so it stays fixed.
