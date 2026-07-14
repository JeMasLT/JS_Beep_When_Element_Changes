(() => {
  // auto-stop any previous instance (safe even on first run)
  if (window.stopWatcher) window.stopWatcher();

  // --- CONFIG ---
  const KEYWORD = 'StreetName';        // set your word here (case-insensitive)

  const TONE_MATCH = 1000;           // tone (Hz) when KEYWORD is in the value
  const DURATION_MATCH = 0.15;       // beep length (s) when matched
  const REPEAT_MATCH = 3;           // how many beeps when matched

  const TONE_NORMAL = 300;          // tone (Hz) when it's not
  const DURATION_NORMAL = 0.1;      // beep length (s) when not matched
  const REPEAT_NORMAL = 1;          // how many beeps when not matched

  const PAUSE_DURATION = 0.03;       // shared: silence (s) between beeps

  // --- helper: single beep ---
  function beep(freq = 880, duration = 0.5, volume = 0.3) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // --- helper: repeated beep ---
  function beepRepeat(freq, duration, times, pause) {
    for (let i = 0; i < times; i++) {
      setTimeout(
        () => beep(freq, duration),
        i * (duration + pause) * 1000
      );
    }
  }

  const el = document.querySelector('.DkEaL');
  if (!el) {
    console.warn('[watcher] .DkEaL not found at startup');
    return;
  }

  let lastValue = el.textContent;
  console.log('[watcher] initial value:', lastValue);

  const observer = new MutationObserver(() => {
    const current = el.textContent;
    if (current !== lastValue) {
      const hasKeyword = (current ?? '')
        .toLowerCase()
        .includes(KEYWORD.toLowerCase());

      console.log(
        '[watcher] CHANGED:', lastValue, '→', current,
        hasKeyword ? `(contains "${KEYWORD}")` : ''
      );

      lastValue = current;

      const freq   = hasKeyword ? TONE_MATCH : TONE_NORMAL;
      const dur    = hasKeyword ? DURATION_MATCH : DURATION_NORMAL;
      const times  = hasKeyword ? REPEAT_MATCH : REPEAT_NORMAL;
      beepRepeat(freq, dur, times, PAUSE_DURATION);
    }
  });

  observer.observe(el, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  window.stopWatcher = () => {
    observer.disconnect();
    console.log('[watcher] stopped');
  };
  console.log(`[watcher] observing. Keyword: "${KEYWORD}". Call stopWatcher() to stop.`);
})();
