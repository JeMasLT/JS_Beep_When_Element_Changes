(() => {
  // --- CONFIG ---
  const KEYWORD = 'StreetName';   // set your word here (case-insensitive)
  const TONE_MATCH = 700;      // tone when KEYWORD is in the value
  const TONE_NORMAL = 400;     // tone when it's not

  // --- helper: beep ---
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
      beep(hasKeyword ? TONE_MATCH : TONE_NORMAL, 0.5);
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
