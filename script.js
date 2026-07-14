(() => {
  function beep(freq = 880, duration = 0.2, volume = 0.3) {
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
      console.log('[watcher] CHANGED:', lastValue, '→', current);
      lastValue = current;
      beep(400, 0.5);
    }
  });

  // watch text changes inside the element
  observer.observe(el, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  window.stopWatcher = () => {
    observer.disconnect();
    console.log('[watcher] stopped');
  };
  console.log('[watcher] observing. Call stopWatcher() to stop.');
})();
