/**
 * The journey's scroll length, made available before first paint.
 *
 * The homepage is one tall scroll spacer whose height is the GSAP
 * timeline's length — known only once the timeline is built, after
 * hydration. Until then the page would be about two screens tall, and a
 * browser restoring a deep scroll position on refresh (or jumping to a
 * hash) would be clamped to that.
 *
 * So Journey saves each built length, per layout class (the length
 * differs between phones and larger screens), and a tiny inline script in
 * the document <head> applies the saved value to the root element before
 * the body is laid out. On a first visit there's nothing saved yet;
 * Journey then sets the real length itself and travels to any hash.
 *
 * Plain module (no "use client"), so the root layout can inline the script.
 */

/** Must match Journey's `compact` media condition. */
export const COMPACT_QUERY = "(max-width: 47.99rem), (max-height: 31.25rem)";

export const journeyLengthKey = (compact: boolean) => `journey-length:${compact ? "compact" : "wide"}`;

export function saveJourneyLength(compact: boolean, length: number) {
  try {
    localStorage.setItem(journeyLengthKey(compact), String(length));
  } catch {
    // Storage can be unavailable (private modes, blocked site data); the
    // page still works, it just can't restore deep positions on refresh.
  }
}

export const journeyLengthScript = `(function(){try{var c=window.matchMedia(${JSON.stringify(
  COMPACT_QUERY
)}).matches;var v=localStorage.getItem(c?${JSON.stringify(journeyLengthKey(true))}:${JSON.stringify(
  journeyLengthKey(false)
)});if(v&&isFinite(+v))document.documentElement.style.setProperty("--journey-length",v)}catch(e){}})();`;
