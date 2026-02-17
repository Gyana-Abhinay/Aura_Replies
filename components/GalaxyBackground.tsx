import React, { useMemo } from 'react';
import './GalaxyBackground.css';

const GalaxyBackground: React.FC = () => {
    // Generate random star coordinates for box-shadow
    const generateStars = (count: number) => {
        let shadow = "";
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * 2000);
            const y = Math.floor(Math.random() * 2000);
            shadow += `${x}px ${y}px #FFF, `;
        }
        return shadow.slice(0, -2); // Remove trailing comma
    };

    const smallStars = useMemo(() => generateStars(700), []);
    const mediumStars = useMemo(() => generateStars(200), []);
    const largeStars = useMemo(() => generateStars(100), []);

    return (
        <div className="galaxy-container">
            <div className="deep-space-overlay"></div>
            <div className="stars-small" style={{ boxShadow: smallStars }}></div>
            <div className="stars-medium" style={{ boxShadow: mediumStars }}></div>
            <div className="stars-large" style={{ boxShadow: largeStars }}></div>

            {/* Dynamic Shooting Stars */}
            <div className="shooting-star" style={{ top: '10%', left: '50%', animationDelay: '2s' }}></div>
            <div className="shooting-star" style={{ top: '30%', left: '20%', animationDelay: '5s' }}></div>
            <div className="shooting-star" style={{ top: '70%', left: '80%', animationDelay: '8s' }}></div>
        </div>
    );
};

export default GalaxyBackground;
