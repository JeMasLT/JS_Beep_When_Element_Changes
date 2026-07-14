# DkEaL Value Watcher

A console script that watches the text of a `.DkEaL` element and beeps when it changes.

## Usage

1. Open your browser DevTools console on the target page.
2. Paste and run the script.
3. It stores the current value and alerts you on any change.

## How it works

- Reads `document.querySelector('.DkEaL').textContent` and saves it.
- Watches for changes using a `MutationObserver` (event-driven, instant) or `setInterval` (polling, every 1 minute).
- On change, plays a 400 Hz tone for 0.5s via the Web Audio API.

## Stopping

Call `stopWatcher()` in the console to stop watching.

## Notes

- Audio may be blocked until you interact with the page (click anywhere), due to browser autoplay rules.
- The `DkEaL` class looks auto-generated and may change on reload — rerun with the new selector if it stops matching.
- If the page *replaces* the element instead of editing its text (common in single-page apps like Google Maps), observe a stable parent container with `subtree: true` and re-query inside the callback.
