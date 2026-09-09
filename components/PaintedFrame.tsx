/**
 * A photo frame whose BOTTOM edge is torn, as if the print were ripped or the
 * paint ran out — the treatment the reference design uses on its About-section
 * imagery, and the same visual language as the hero's painted foot.
 *
 * Implemented as a CSS mask rather than a white overlay, so the tear works on
 * any background. An overlay would have to match the section ground exactly and
 * would break the moment a section changed colour.
 */

/** Deterministic PRNG — the shape must match on server and client or React
 *  reports a hydration mismatch. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const W = 200;
const H = 260;
/** Where the tear sits. Everything above is solid photo. */
/**
 * Nominal tear line. Measured on the reference: its tear occupies roughly the
 * bottom 23% of the photograph, with the deepest bites reaching that far up —
 * so this sits well above the frame's foot, not hard against it.
 */
const EDGE = 244;

function tornMask(seed: number): string {
  const rand = seeded(seed);
  const pts: string[] = [];

  // Wildly uneven on purpose. Evenly spaced points of similar amplitude read as
  // pinking shears; paint tears in fits — long calm stretches, then a deep bite.
  for (let x = W + 8; x > -8; x -= 1.5 + rand() * 12) {
    const r = rand();
    let y: number;
    if (r > 0.9) {
      // A deep bite, taking a real chunk out of the photograph.
      y = EDGE - 14 - rand() * 24;
    } else if (r > 0.74) {
      // A tongue of paint hanging past the line.
      y = EDGE + 4 + rand() * 12;
    } else if (r > 0.46) {
      y = EDGE + (rand() * 16 - 8);
    } else {
      // A calmer run, so the edge is not uniformly jagged.
      y = EDGE + (rand() * 5 - 2.5);
    }
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  // The shape is bled well past every edge so the displacement below can only
  // chew the tear, never crop the top or sides of the photograph.
  const d = `M-60 -60L${W + 60} -60L${W + 60} ${EDGE}L${pts.join('L')}Z`;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' ` +
    `preserveAspectRatio='none'>` +
    `<filter id='t' x='-25%' y='-25%' width='150%' height='150%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.035 0.07' numOctaves='3' seed='${seed % 90}' result='n'/>` +
    `<feDisplacementMap in='SourceGraphic' in2='n' scale='24' xChannelSelector='R' yChannelSelector='G'/>` +
    `</filter>` +
    `<path d='${d}' fill='#fff' filter='url(#t)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Pre-built so the markup stays declarative and the shapes never change. */
const MASKS = [tornMask(20260921), tornMask(20260922), tornMask(20260923)];

export default function PaintedFrame({
  variant = 0,
  className = '',
  children,
}: {
  /** Picks one of the pre-built tears, so two frames never match. */
  variant?: 0 | 1 | 2;
  className?: string;
  children: React.ReactNode;
}) {
  const mask = MASKS[variant];
  return (
    <div
      className={className}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
}
