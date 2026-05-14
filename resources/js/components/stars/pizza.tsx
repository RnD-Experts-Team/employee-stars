import { memo, useMemo } from 'react';

type PizzaProps = {
    points: number;
    target: number;
    size?: number;
    employeeId?: number;
};

const VIEWBOX = 200;
const CENTER = VIEWBOX / 2;
const CRUST_RADIUS = 95;
const SAUCE_RADIUS = 78;
const CHEESE_RADIUS = 74;
const PEPPERONI_RADIUS = 7.5;

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

type Pepperoni = {
    x: number;
    y: number;
    rotation: number;
    scale: number;
};

function seededRandom(seed: number): () => number {
    let state = (seed * 9301 + 49297) % 233280;

    return () => {
        state = (state * 9301 + 49297) % 233280;

        return state / 233280;
    };
}

function generatePepperoniPositions(count: number, seed: number): Pepperoni[] {
    if (count <= 0) {
return [];
}

    const rand = seededRandom(seed);
    const positions: Pepperoni[] = [];
    const sizingThreshold = 22;
    const scale = count > sizingThreshold ? Math.max(0.55, 0.55 + (sizingThreshold - count) * 0.02) : 1;
    const effectiveRadius = PEPPERONI_RADIUS * scale;
    const maxRadius = CHEESE_RADIUS - effectiveRadius - 10;
    const angleOffset = rand() * Math.PI * 2;

    for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / Math.max(count, 8);
        const r = maxRadius * Math.sqrt(t);
        const theta = i * GOLDEN_ANGLE + angleOffset;
        const jitter = (rand() - 0.5) * 0.6;
        const finalR = Math.min(r + jitter, maxRadius);

        positions.push({
            x: CENTER + finalR * Math.cos(theta),
            y: CENTER + finalR * Math.sin(theta),
            rotation: rand() * 360,
            scale,
        });
    }

    return positions;
}

function generateOreganoFlecks(count: number, seed: number) {
    const rand = seededRandom(seed + 7);
    const flecks: { x: number; y: number; rotation: number }[] = [];
    const maxRadius = CHEESE_RADIUS - 6;

    for (let i = 0; i < count; i++) {
        const r = Math.sqrt(rand()) * maxRadius;
        const theta = rand() * Math.PI * 2;
        flecks.push({
            x: CENTER + r * Math.cos(theta),
            y: CENTER + r * Math.sin(theta),
            rotation: rand() * 180,
        });
    }

    return flecks;
}

function generateCheeseHoles(count: number, seed: number) {
    const rand = seededRandom(seed + 13);
    const holes: { x: number; y: number; r: number }[] = [];
    const maxRadius = CHEESE_RADIUS - 8;

    for (let i = 0; i < count; i++) {
        const r = Math.sqrt(rand()) * maxRadius;
        const theta = rand() * Math.PI * 2;
        holes.push({
            x: CENTER + r * Math.cos(theta),
            y: CENTER + r * Math.sin(theta),
            r: 1.2 + rand() * 2.8,
        });
    }

    return holes;
}

function generateCrustSpots(count: number, seed: number) {
    const rand = seededRandom(seed + 21);
    const spots: { x: number; y: number; r: number; opacity: number }[] = [];

    for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 + rand() * 0.3;
        const r = CRUST_RADIUS - 4 - rand() * 6;
        spots.push({
            x: CENTER + r * Math.cos(theta),
            y: CENTER + r * Math.sin(theta),
            r: 0.8 + rand() * 1.4,
            opacity: 0.18 + rand() * 0.3,
        });
    }

    return spots;
}

function PizzaInner({ points, target, size = 200, employeeId = 1 }: PizzaProps) {
    const isComplete = points >= target;
    const cappedPoints = Math.min(points, Math.max(target, 30));

    const pepperonis = useMemo(
        () => generatePepperoniPositions(cappedPoints, employeeId),
        [cappedPoints, employeeId],
    );
    const oregano = useMemo(() => generateOreganoFlecks(38, employeeId), [employeeId]);
    const cheeseHoles = useMemo(() => generateCheeseHoles(28, employeeId), [employeeId]);
    const crustSpots = useMemo(() => generateCrustSpots(24, employeeId), [employeeId]);

    const gradId = `pizza-${employeeId}`;

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
            width={size}
            height={size}
            className="block"
            role="img"
            aria-label={`Pizza showing ${points} of ${target} points`}
        >
            <defs>
                <radialGradient id={`${gradId}-crust`} cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stopColor={isComplete ? '#F5D061' : '#E0AE6F'} />
                    <stop offset="65%" stopColor={isComplete ? '#D4A017' : '#B07A3E'} />
                    <stop offset="100%" stopColor={isComplete ? '#8B6914' : '#7A4E22'} />
                </radialGradient>

                <radialGradient id={`${gradId}-sauce`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#C0392B" />
                    <stop offset="70%" stopColor="#A93226" />
                    <stop offset="100%" stopColor="#8B1F18" />
                </radialGradient>

                <radialGradient id={`${gradId}-cheese`} cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFE7A0" />
                    <stop offset="60%" stopColor="#F5C868" />
                    <stop offset="100%" stopColor="#D9A23C" />
                </radialGradient>

                <radialGradient id={`${gradId}-pepperoni`} cx="35%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#E74C3C" />
                    <stop offset="55%" stopColor="#B83227" />
                    <stop offset="100%" stopColor="#7B1F17" />
                </radialGradient>

                <filter id={`${gradId}-shadow`} x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="2" />
                </filter>

                {isComplete && (
                    <filter id={`${gradId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                )}
            </defs>

            <ellipse
                cx={CENTER}
                cy={CENTER + 4}
                rx={CRUST_RADIUS + 2}
                ry={CRUST_RADIUS - 2}
                fill="rgba(0, 0, 0, 0.18)"
                filter={`url(#${gradId}-shadow)`}
            />

            <circle
                cx={CENTER}
                cy={CENTER}
                r={CRUST_RADIUS}
                fill={`url(#${gradId}-crust)`}
                filter={isComplete ? `url(#${gradId}-glow)` : undefined}
            />

            {crustSpots.map((spot, i) => (
                <circle
                    key={`crust-${i}`}
                    cx={spot.x}
                    cy={spot.y}
                    r={spot.r}
                    fill="#3a2410"
                    opacity={spot.opacity}
                />
            ))}

            <circle cx={CENTER} cy={CENTER} r={SAUCE_RADIUS} fill={`url(#${gradId}-sauce)`} />

            <circle cx={CENTER} cy={CENTER} r={CHEESE_RADIUS} fill={`url(#${gradId}-cheese)`} opacity="0.92" />

            {cheeseHoles.map((hole, i) => (
                <circle
                    key={`hole-${i}`}
                    cx={hole.x}
                    cy={hole.y}
                    r={hole.r}
                    fill="#B5611E"
                    opacity="0.25"
                />
            ))}

            {oregano.map((fleck, i) => (
                <rect
                    key={`oreg-${i}`}
                    x={fleck.x - 0.7}
                    y={fleck.y - 0.3}
                    width="1.4"
                    height="0.6"
                    fill="#2D5016"
                    opacity="0.7"
                    transform={`rotate(${fleck.rotation} ${fleck.x} ${fleck.y})`}
                />
            ))}

            {pepperonis.map((pep, i) => {
                const baseR = PEPPERONI_RADIUS * pep.scale;

                return (
                    <g
                        key={`pep-${i}`}
                        transform={`translate(${pep.x} ${pep.y}) rotate(${pep.rotation})`}
                    >
                        <ellipse
                            cx="0.6"
                            cy="0.8"
                            rx={baseR + 0.5}
                            ry={baseR}
                            fill="rgba(0, 0, 0, 0.25)"
                        />
                        <circle cx="0" cy="0" r={baseR} fill={`url(#${gradId}-pepperoni)`} />
                        <circle cx={-baseR * 0.45} cy={-baseR * 0.45} r={baseR * 0.28} fill="#FFB099" opacity="0.55" />
                        <circle cx={baseR * 0.3} cy={-baseR * 0.1} r={baseR * 0.12} fill="#7B1F17" opacity="0.7" />
                        <circle cx={-baseR * 0.1} cy={baseR * 0.4} r={baseR * 0.1} fill="#7B1F17" opacity="0.6" />
                    </g>
                );
            })}

            {isComplete && (
                <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={CRUST_RADIUS - 1}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="1.5"
                    opacity="0.5"
                />
            )}
        </svg>
    );
}

export const Pizza = memo(PizzaInner);
