import { useMemo } from 'react';

export default function PortalAtmosphere({ particles: showParticles = true, grid: showGrid = true }) {
    const particles = useMemo(() => {
        const arr = [];
        let seed = 42;
        const rnd = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        for (let i = 0; i < 60; i++) {
            arr.push({
                id: i,
                left: rnd() * 100,
                top: rnd() * 100,
                size: 1 + rnd() * 2.5,
                delay: rnd() * 8,
                duration: 6 + rnd() * 10,
                opacity: 0.2 + rnd() * 0.6,
            });
        }
        return arr;
    }, []);

    return (
        <>
            <style>{`
                @keyframes portal-float {
                    0%   { transform: translateY(0) translateX(0); opacity: 0; }
                    10%  { opacity: .8; }
                    90%  { opacity: .6; }
                    100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
                }
            `}</style>

            {/* Deep aurora */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(29,78,216,0.35), transparent 60%),' +
                        'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(14,116,144,0.28), transparent 65%),' +
                        'radial-gradient(ellipse 40% 30% at 90% 30%, rgba(56,189,248,0.15), transparent 60%)',
                }}
            />

            {/* Drifting particles */}
            {showParticles && (
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
                    {particles.map((p) => (
                        <span
                            key={p.id}
                            className="absolute rounded-full bg-cyan-200"
                            style={{
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                opacity: p.opacity,
                                filter: 'blur(0.5px)',
                                boxShadow: '0 0 6px rgba(103,232,249,0.9)',
                                animation: `portal-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Receding grid floor */}
            {showGrid && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed inset-x-0 bottom-0 h-[55vh] overflow-hidden"
                >
                    <div
                        className="absolute inset-x-[-50%] bottom-0 top-0"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(56,189,248,0.22) 1px, transparent 1px),' +
                                'linear-gradient(90deg, rgba(56,189,248,0.22) 1px, transparent 1px)',
                            backgroundSize: '56px 56px',
                            transform: 'perspective(500px) rotateX(62deg)',
                            transformOrigin: 'center bottom',
                            maskImage:
                                'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
                            WebkitMaskImage:
                                'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
                        }}
                    />
                </div>
            )}

            {/* Vignette */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.85) 100%)',
                }}
            />
        </>
    );
}