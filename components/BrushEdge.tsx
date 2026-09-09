/**
 * The painted edge at the foot of the hero.
 *
 * Reverse-engineered from `public/images/design.jpg`, viewed at a UNIFORM 6x
 * zoom. (A first pass zoomed 4x wide by 8x tall, which stretched the diagonal
 * bristle marks into vertical spikes and sent the whole implementation the
 * wrong way — the marks are diagonal, not spiky.)
 *
 * What the reference actually is:
 *   - a THICK white band, roughly the bottom half of the strip
 *   - whose top edge is TORN INTO STEPS: flat plateaus at differing heights
 *     with hard, ragged transitions between them, not a smooth curve
 *   - with long, thin, tapered bristle streaks raking up and to the RIGHT at
 *     roughly 25-40 degrees, thrown off the top of those steps
 *   - clustered, measured by scanning the reference baseline, at these
 *     fractions of hero width: 0.068, 0.301, 0.359, 0.539, 0.596, 0.988,
 *     with wide sparse stretches at 0.07-0.28 and 0.62-0.98
 *
 * Every step and streak is its own path, generated from a seeded PRNG, so
 * nothing repeats and no two marks are alike.
 */

/** Deterministic PRNG — the artwork must be identical on server and client or
 *  React reports a hydration mismatch. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const H = 64;
/** Top of the paint where no cluster raises it. */
const REST = 44;

/** Cluster centres and widths as fractions of width; lift in viewBox units. */
const CLUSTERS = [
  { cx: 0.068, w: 0.05, lift: 12 },
  { cx: 0.301, w: 0.1, lift: 17 },
  { cx: 0.359, w: 0.13, lift: 22 },
  { cx: 0.539, w: 0.07, lift: 20 },
  { cx: 0.596, w: 0.11, lift: 18 },
  { cx: 0.988, w: 0.06, lift: 15 },
];

/**
 * Builds one edge for a given viewBox width.
 *
 * The width is chosen per breakpoint: `preserveAspectRatio="none"` stretches
 * the artwork to the box, so a 1440-wide viewBox squashed into a 390px phone
 * tips the 30-degree rake up to about 55 and the streaks stop reading as a
 * drag. Matching the viewBox to the viewport keeps the distortion near 1.
 */
function buildArt(W: number, seed: number) {
  const rand = seeded(seed);

  /** How high the paint sits at x — clusters lift it, everything else rests. */
  function topAt(x: number): number {
    let lift = 0;
    for (const c of CLUSTERS) {
      const d = Math.abs(x / W - c.cx) / (c.w / 2);
      // Flat-topped falloff, so the cluster reads as a plateau, not a bell.
      if (d < 1) lift = Math.max(lift, c.lift * Math.min(1, (1 - d) * 2.2));
    }
    return REST - lift;
  }

  /** Marks scale with the box so a narrow viewBox is not covered in giants. */
  const k = W / 1440;

/**
 * The band, drawn as hard steps. Each segment holds one height and drops
 * vertically to the next, which is what gives the torn edge.
 */
  const BAND = (() => {
  const pts: string[] = [`-30 ${H + 16}`, `-30 ${REST + 2}`];
  let x = -30;
  while (x < W + 30) {
    const seg = (9 + rand() * 23) * k;
    const y = topAt(x + seg / 2) + (rand() * 11 - 5.5);
    // 2-4 jittered points across the plateau, and a skewed exit, so the step
    // tears like paint instead of notching like a battlement.
    const n = 2 + Math.floor(rand() * 3);
    for (let k = 0; k <= n; k += 1) {
      const px = x + (seg * k) / n;
      pts.push(`${px.toFixed(1)} ${(y + (rand() * 5 - 2.5)).toFixed(1)}`);
    }
    x += seg;
  }
  pts.push(`${W + 30} ${REST + 2}`, `${W + 30} ${H + 16}`);
  return `M${pts.join('L')}Z`;
})();

/** One bristle streak: long, thin, tapered, raking up and to the right. */
  function streak(x: number, y: number, len: number, thick: number): string {
  const a = (-(24 + rand() * 18) * Math.PI) / 180; // 24-42 degrees above horizontal
  const dx = Math.cos(a) * len;
  const dy = Math.sin(a) * len;
  // A quad that narrows to a point: two feet, one tip, one shoulder.
  return (
    `M${x.toFixed(1)} ${y.toFixed(1)}` +
    `L${(x + thick * 0.9).toFixed(1)} ${(y + thick * 0.5).toFixed(1)}` +
    `L${(x + dx + thick * 0.15).toFixed(1)} ${(y + dy).toFixed(1)}` +
    `L${(x + dx - thick * 0.35).toFixed(1)} ${(y + dy - thick * 0.2).toFixed(1)}Z`
  );
}

  const STREAKS: { d: string; o: number }[] = [];
// Dense along the clusters, where the reference throws most of its bristles.
for (const c of CLUSTERS) {
  const n = 9 + Math.floor(rand() * 8);
  for (let i = 0; i < n; i += 1) {
    const x = (c.cx + (rand() - 0.5) * c.w * 1.25) * W;
    const y = topAt(x) + rand() * 6 - 1;
    STREAKS.push({
      d: streak(x, y, (16 + rand() * 44) * k, (1.4 + rand() * 3.1) * k),
      o: 0.7 + rand() * 0.3,
    });
  }
}
// Sparse marks so the wide gaps still carry a little paint, as the reference does.
for (const gx of [0.152, 0.198, 0.242, 0.671, 0.735, 0.802, 0.878, 0.93]) {
  const x = gx * W;
  STREAKS.push({
    d: streak(x, topAt(x) + rand() * 4, (10 + rand() * 20) * k, (1.2 + rand() * 1.8) * k),
    o: 0.5 + rand() * 0.3,
  });
}

  return { W, BAND, STREAKS };
}

const WIDE = buildArt(1440, 20260908);
const NARROW = buildArt(480, 20260909);

function Edge({
  art,
  className,
  fill,
}: {
  art: ReturnType<typeof buildArt>;
  className: string;
  fill: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${art.W} ${H}`}
      /* `none` keeps every cluster on screen at any width — the brief asks for
         the same cluster count on mobile, which cropping would break. */
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <filter id="brush-rough" x="-4%" y="-50%" width="108%" height="210%">
          {/* Stretched horizontally so the roughening reads as drag, not grain */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.055"
            numOctaves="3"
            seed="53"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g fill={fill} filter="url(#brush-rough)">
        <path d={art.BAND} />
        {art.STREAKS.map((st, i) => (
          <path key={i} d={st.d} opacity={st.o} />
        ))}
      </g>
    </svg>
  );
}

export default function BrushEdge({
  className = '',
  /**
   * The colour of the paint. It must match the ground the edge hands off TO —
   * white where the neighbouring section is white, `ink-50` (#FAF9FC) where it
   * is tinted. Getting this wrong leaves a faint seam along the join.
   */
  fill = '#ffffff',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <>
      <Edge art={NARROW} className={`${className} sm:hidden`} fill={fill} />
      <Edge art={WIDE} className={`${className} hidden sm:block`} fill={fill} />
    </>
  );
}
