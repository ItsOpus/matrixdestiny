
import React from 'react';

const AnimatedBackground: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <style dangerouslySetInnerHTML={{ __html: `
            .bubbles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 0;
            }
            .bubble {
                position: absolute;
                bottom: -150px;
                background-color: rgba(192, 132, 252, 0.25); /* Lighter purple, higher alpha for visibility */
                border-radius: 50%;
                animation: floatUp 25s infinite linear;
                box-shadow: 0 0 15px rgba(192, 132, 252, 0.3); /* Slightly stronger shadow */
            }
            @keyframes floatUp {
                0% {
                    transform: translateY(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.9; /* Max opacity increased for visibility */
                }
                90% {
                    opacity: 0.9; /* Max opacity increased for visibility */
                }
                100% {
                    transform: translateY(-120vh) rotate(600deg);
                    opacity: 0;
                }
            }
        `}} />
        <div className="bubbles">
            {Array.from({ length: 12 }).map((_, i) => { // Slightly reduced number of bubbles if they are very visible
                const size = Math.random() * 45 + 15; // Max size slightly reduced
                const style = { 
                    width: `${size}px`, 
                    height: `${size}px`, 
                    left: `${Math.random() * 100}%`, 
                    animationDuration: `${Math.random() * 20 + 15}s`, 
                    animationDelay: `${Math.random() * 10}s` 
                };
                return <div key={i} className="bubble" style={style}></div>;
            })}
        </div>
    </div>
);

export default AnimatedBackground;