/**
 * The 2D stand-in for the particle field, used when WebGL isn't
 * available: the same sparse, soft, translucent spheres on the ivory
 * ground — mostly neutral ink, one pink and one green — drawn once in
 * SVG. Spheres get the same gentle shading (lit from the upper right)
 * and the nearer, larger ones are softened, as in the 3D field. With
 * motion allowed they drift very slowly (globals.css, .static-field).
 *
 * Positions are fixed (fractions of a 1000×1000 box, cropped to cover
 * the viewport) so server and client render the same thing.
 */

type Sphere = { x: number; y: number; r: number; tone?: "pink" | "green"; soft?: boolean; o: number };

const SPHERES: Sphere[] = [
  { x: 120, y: 160, r: 9, o: 0.55 },
  { x: 300, y: 90, r: 5, o: 0.4 },
  { x: 860, y: 140, r: 14, o: 0.5 },
  { x: 930, y: 420, r: 6, o: 0.35 },
  { x: 70, y: 520, r: 6, o: 0.4 },
  { x: 220, y: 760, r: 22, o: 0.4, soft: true },
  { x: 410, y: 880, r: 7, o: 0.45 },
  { x: 640, y: 70, r: 7, o: 0.4, tone: "pink" },
  { x: 780, y: 690, r: 10, o: 0.5 },
  { x: 960, y: 880, r: 28, o: 0.35, soft: true },
  { x: 540, y: 620, r: 4, o: 0.35 },
  { x: 700, y: 930, r: 6, o: 0.4, tone: "green" },
  { x: 40, y: 940, r: 5, o: 0.35 },
  { x: 500, y: 300, r: 3, o: 0.3 },
];

const FILL = { pink: "url(#sf-pink)", green: "url(#sf-green)", ink: "url(#sf-ink)" };

function Shade({ id, color }: { id: string; color: string }) {
  return (
    <radialGradient id={id} cx="62%" cy="36%" r="70%">
      <stop offset="0" stopColor="var(--color-paper)" stopOpacity="0.9" />
      <stop offset="0.55" stopColor={color} stopOpacity="0.75" />
      <stop offset="1" stopColor={color} />
    </radialGradient>
  );
}

export function StaticField() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="static-field absolute inset-0 h-full w-full"
    >
      <defs>
        <Shade id="sf-ink" color="var(--color-ink-muted)" />
        <Shade id="sf-pink" color="var(--color-pink)" />
        <Shade id="sf-green" color="var(--color-green)" />
        <filter id="sf-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      {SPHERES.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={FILL[s.tone ?? "ink"]}
          opacity={s.o}
          filter={s.soft ? "url(#sf-soft)" : undefined}
          style={{ animationDelay: `${-i * 2.3}s` }}
        />
      ))}
    </svg>
  );
}
