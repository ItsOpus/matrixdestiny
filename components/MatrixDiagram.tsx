
import React from 'react';
import { motion } from 'framer-motion';
import { MatrixData } from '../types';

interface MatrixDiagramProps {
    matrixData: MatrixData;
}

const MatrixDiagram: React.FC<MatrixDiagramProps> = ({ matrixData }) => {
    const size = 300; // Reduced size for better fit
    const centerPos = size / 2;
    const padding = 35; // Adjusted padding
    const nodeRadius = 18; // Smaller nodes

    // Adjusted positions for a more compact diagram
    const points = {
        b: { x: centerPos, y: padding, v: matrixData.b, label: 'B' },
        g: { x: centerPos + (centerPos - padding) * 0.6, y: centerPos - (centerPos - padding) * 0.6, v: matrixData.g, label: 'G' },
        c: { x: size - padding, y: centerPos, v: matrixData.c, label: 'C' },
        h: { x: centerPos + (centerPos - padding) * 0.6, y: centerPos + (centerPos - padding) * 0.6, v: matrixData.h, label: 'H' },
        d: { x: centerPos, y: size - padding, v: matrixData.d, label: 'D' },
        i: { x: centerPos - (centerPos - padding) * 0.6, y: centerPos + (centerPos - padding) * 0.6, v: matrixData.i, label: 'I' },
        a: { x: padding, y: centerPos, v: matrixData.a, label: 'A' },
        f: { x: centerPos - (centerPos - padding) * 0.6, y: centerPos - (centerPos - padding) * 0.6, v: matrixData.f, label: 'F' },
        e: { x: centerPos, y: centerPos, v: matrixData.center, label: 'E' } // Center point often referred to as 'e' or center
    };

    const containerVariants = { 
        hidden: { opacity: 0 }, 
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } 
    };
    const itemVariants = { 
        hidden: { scale: 0, opacity: 0 }, 
        visible: { scale: 1, opacity: 1, transition: { type: "spring" as const, stiffness: 260, damping: 20 } } 
    };

    return (
        <motion.svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs mx-auto h-auto" variants={containerVariants} initial="hidden" animate="visible">
            <motion.text 
                x={centerPos} 
                y={padding * 0.5} // Adjusted Y: Positioned higher, e.g., 35 * 0.5 = 17.5
                textAnchor="middle" 
                fill="rgb(192 132 252)" 
                className="font-semibold text-sm" 
                variants={itemVariants}
            >
                Life Path: {matrixData.lifePathNumber}
            </motion.text>
            
            {/* Main square (Destiny Square) */}
            <motion.path 
                d={`M ${points.a.x} ${points.a.y} L ${points.b.x} ${points.b.y} L ${points.c.x} ${points.c.y} L ${points.d.x} ${points.d.y} Z`} 
                stroke="rgba(168, 85, 247, 0.7)" 
                strokeWidth="1.5" 
                fill="none" 
                initial={{ pathLength: 0 }} 
                animate={{ pathLength: 1 }} 
                transition={{ duration: 1, ease: "easeInOut" }} 
            />
            {/* Inner square (Personal Square) */}
             <motion.path 
                d={`M ${points.f.x} ${points.f.y} L ${points.g.x} ${points.g.y} L ${points.h.x} ${points.h.y} L ${points.i.x} ${points.i.y} Z`} 
                stroke="rgba(192, 132, 252, 0.5)" 
                strokeWidth="1" 
                fill="none" 
                initial={{ pathLength: 0 }} 
                animate={{ pathLength: 1 }} 
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }} 
            />
            {/* Cross lines */}
            <motion.path d={`M ${points.a.x} ${points.a.y} L ${points.c.x} ${points.c.y}`} stroke="rgba(192,132,252,0.2)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
            <motion.path d={`M ${points.b.x} ${points.b.y} L ${points.d.x} ${points.d.y}`} stroke="rgba(192,132,252,0.2)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />


            {Object.entries(points).map(([key, p]) => (
                <motion.g key={key} variants={itemVariants}>
                    <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={nodeRadius} 
                        fill={key === 'e' ? "rgba(168, 85, 247, 0.6)" : "rgba(55, 65, 81, 0.7)"} // Highlight center
                        stroke="rgba(192, 132, 252, 0.6)" 
                        strokeWidth="1" 
                    />
                    <text 
                        x={p.x} 
                        y={p.y + (nodeRadius / 2.5)} // Adjust for better vertical centering
                        textAnchor="middle" 
                        fill={key === 'e' ? "#FFFFFF" : "#E5E7EB"} 
                        className="text-base font-medium" // Slightly smaller text
                    >
                        {p.v}
                    </text>
                     {/* Optional: Add labels for points A, B, C, etc. */}
                    {/* <text x={p.x} y={p.y - nodeRadius - 3} textAnchor="middle" fill="#a78bfa" className="text-xs">{p.label}</text> */}
                </motion.g>
            ))}
        </motion.svg>
    );
};

export default MatrixDiagram;
