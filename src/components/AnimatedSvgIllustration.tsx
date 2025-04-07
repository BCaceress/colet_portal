import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Support SVG Illustration
 * Represents a customer support scenario with an agent and monitor
 */
const SupportSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="w-full h-full drop-shadow-xl">
        {/* Title label */}
        <text x="400" y="50" fontSize="34" fontWeight="bold" fill="white" textAnchor="middle">Helpdesk</text>

        {/* Base Environment */}
        <g id="environment">
            {/* Floor shadow for depth */}
            <ellipse cx="400" cy="460" rx="300" ry="20" fill="#333" opacity="0.2" />

            {/* Workspace desk structure */}
            <g id="desk">
                <rect x="200" y="280" width="400" height="20" rx="2" fill="#d0d0d0" stroke="#c0c0c0" strokeWidth="1" />
                <rect x="220" y="300" width="360" height="100" rx="2" fill="#e0e0e0" stroke="#d0d0d0" strokeWidth="1" />
            </g>
        </g>

        {/* Primary workspace equipment */}
        <g id="workspace-equipment">
            {/* Computer monitor */}
            <g id="monitor">
                <rect x="300" y="150" width="200" height="130" rx="5" fill="#333" stroke="#222" strokeWidth="2" />
                <rect x="310" y="160" width="180" height="110" rx="2" fill="#78d1c8" stroke="#09A08D" strokeWidth="1" />
                <rect x="370" y="280" width="60" height="20" fill="#444" />
                <rect x="350" y="300" width="100" height="5" rx="2" fill="#555" />

                {/* Screen content */}
                <g id="screen-content">
                    <rect x="330" y="180" width="140" height="10" rx="2" fill="white" opacity="0.6" />
                    <rect x="330" y="200" width="120" height="8" rx="2" fill="white" opacity="0.5" />
                    <rect x="330" y="220" width="130" height="8" rx="2" fill="white" opacity="0.5" />
                    <rect x="330" y="240" width="100" height="8" rx="2" fill="white" opacity="0.5" />
                </g>
            </g>

            {/* Input devices */}
            <g id="input-devices">
                <g id="keyboard">
                    <rect x="340" y="340" width="120" height="40" rx="4" fill="#f0f0f0" stroke="#ddd" strokeWidth="1" />
                    <rect x="350" y="350" width="100" height="20" rx="2" fill="#e6e6e6" stroke="#ddd" strokeWidth="0.5" />
                </g>

                <g id="phone">
                    <rect x="480" y="340" width="40" height="60" rx="5" fill="#444" stroke="#333" strokeWidth="1" />
                    <rect x="485" y="350" width="30" height="40" rx="2" fill="#78d1c8" stroke="#09A08D" strokeWidth="1" />
                </g>
            </g>
        </g>

        {/* Support agent visualization */}
        <g id="support-agent">
            {/* Agent avatar */}
            <g id="agent-avatar">
                <circle cx="550" cy="200" r="50" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
                <circle cx="550" cy="170" r="25" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
            </g>

            {/* Headset equipment */}
            <g id="headset">
                <path d="M525 160 Q550 140 575 160" fill="none" stroke="#444" strokeWidth="3" strokeLinecap="round" />
                <rect x="520" y="160" width="10" height="20" rx="5" fill="#444" />
                <rect x="570" y="160" width="10" height="20" rx="5" fill="#444" />
            </g>

            {/* Communication visualization */}
            <g id="speech-bubble">
                <path d="M470 150 Q440 160 450 190 Q455 220 480 215 L490 240 L500 210 Q530 210 540 190 Q550 170 520 155 Z" fill="#09A08D" stroke="#097f72" strokeWidth="1" />
                <circle cx="480" cy="185" r="5" fill="white" />
                <circle cx="500" cy="185" r="5" fill="white" />
                <circle cx="520" cy="185" r="5" fill="white" />
            </g>
        </g>
    </svg>
);

/**
 * Developer SVG Illustration
 * Represents a software development workspace
 */
const DeveloperSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="w-full h-full drop-shadow-xl">
        {/* Title label */}
        <text x="400" y="50" fontSize="34" fontWeight="bold" fill="white" textAnchor="middle">Desenvolvimento</text>

        {/* Base Environment */}
        <g id="environment">
            {/* Floor shadow for depth */}
            <ellipse cx="400" cy="460" rx="300" ry="20" fill="#333" opacity="0.2" />

            {/* Workspace desk structure */}
            <g id="desk">
                <rect x="150" y="300" width="500" height="20" rx="5" fill="#d0d0d0" stroke="#c0c0c0" strokeWidth="1" />
                <rect x="180" y="320" width="440" height="80" rx="2" fill="#e0e0e0" stroke="#d0d0d0" strokeWidth="1" />
            </g>
        </g>

        {/* Primary workspace equipment */}
        <g id="workspace-equipment">
            {/* Main coding monitor */}
            <g id="main-monitor">
                <rect x="280" y="150" width="240" height="150" rx="5" fill="#333" stroke="#222" strokeWidth="2" />
                <rect x="290" y="160" width="220" height="130" rx="2" fill="#252830" stroke="#1a1c22" strokeWidth="1" />
                <rect x="370" y="300" width="60" height="20" fill="#444" />
                <rect x="350" y="320" width="100" height="5" rx="2" fill="#555" />

                {/* Code visualization */}
                <g id="code-elements">
                    {/* Line 1 - Syntax highlighted code */}
                    <rect x="305" y="170" width="10" height="10" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="320" y="170" width="70" height="10" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="395" y="170" width="50" height="10" rx="1" fill="#f0c486" opacity="0.7" />

                    {/* Line 2 */}
                    <rect x="305" y="190" width="30" height="10" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="340" y="190" width="60" height="10" rx="1" fill="#f0c486" opacity="0.7" />
                    <rect x="405" y="190" width="40" height="10" rx="1" fill="white" opacity="0.6" />

                    {/* Line 3 */}
                    <rect x="320" y="210" width="30" height="10" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="355" y="210" width="90" height="10" rx="1" fill="white" opacity="0.6" />

                    {/* Line 4 */}
                    <rect x="320" y="230" width="40" height="10" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="365" y="230" width="60" height="10" rx="1" fill="#f0c486" opacity="0.7" />
                    <rect x="430" y="230" width="50" height="10" rx="1" fill="white" opacity="0.6" />

                    {/* Line 5 */}
                    <rect x="305" y="250" width="30" height="10" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="340" y="250" width="120" height="10" rx="1" fill="white" opacity="0.6" />

                    {/* Line 6 */}
                    <rect x="320" y="270" width="90" height="10" rx="1" fill="#09A08D" opacity="0.7" />
                </g>
            </g>

            {/* Secondary vertical monitor */}
            <g id="secondary-monitor">
                <rect x="550" y="170" width="100" height="130" rx="5" fill="#333" stroke="#222" strokeWidth="2" />
                <rect x="557" y="177" width="86" height="116" rx="2" fill="#252830" stroke="#1a1c22" strokeWidth="1" />
                <rect x="575" y="300" width="50" height="15" fill="#444" />
                <rect x="565" y="315" width="70" height="5" rx="2" fill="#555" />

                {/* Browser mockup on secondary display */}
                <g id="browser-mockup">
                    <rect x="565" y="185" width="70" height="10" rx="2" fill="#555" />
                    <rect x="565" y="200" width="70" height="80" rx="2" fill="#f8f8f8" stroke="#eee" strokeWidth="1" />
                    <rect x="570" y="205" width="60" height="5" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="570" y="215" width="50" height="5" rx="1" fill="#777" opacity="0.7" />
                    <rect x="570" y="225" width="55" height="5" rx="1" fill="#777" opacity="0.7" />
                    <rect x="570" y="235" width="45" height="5" rx="1" fill="#777" opacity="0.7" />
                    <rect x="570" y="245" width="40" height="20" rx="1" fill="#09A08D" opacity="0.5" />
                </g>
            </g>

            {/* Desk accessories */}
            <g id="accessories">
                <g id="coffee-mug">
                    <rect x="200" y="250" width="40" height="50" rx="5" fill="#555" stroke="#444" strokeWidth="1" />
                    <path d="M240 265 Q260 270 240 285" fill="none" stroke="#444" strokeWidth="3" strokeLinecap="round" />
                    <path d="M210 250 Q215 240 230 250" fill="none" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                    <ellipse cx="220" cy="255" rx="15" ry="5" fill="#333" opacity="0.3" />
                </g>
            </g>

            {/* Input devices */}
            <g id="input-devices">
                <g id="keyboard">
                    <rect x="330" y="340" width="140" height="40" rx="4" fill="#f0f0f0" stroke="#ddd" strokeWidth="1" />
                    <rect x="340" y="350" width="120" height="20" rx="2" fill="#e6e6e6" stroke="#ddd" strokeWidth="0.5" />
                </g>

                <g id="mouse">
                    <path d="M490 360 Q490 340 510 340 Q530 340 530 360 Q530 380 510 380 Q490 380 490 360" fill="#f0f0f0" stroke="#ddd" strokeWidth="1" />
                    <line x1="510" y1="340" x2="510" y2="350" stroke="#ddd" strokeWidth="1" />
                </g>
            </g>
        </g>
    </svg>
);

/**
 * Analyst SVG Illustration
 * Represents a data analysis and business intelligence workspace
 */
const AnalystSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="w-full h-full drop-shadow-xl">
        {/* Title label */}
        <text x="400" y="50" fontSize="34" fontWeight="bold" fill="white" textAnchor="middle">Analista</text>

        {/* Base Environment */}
        <g id="environment">
            {/* Floor shadow for depth */}
            <ellipse cx="400" cy="460" rx="300" ry="20" fill="#333" opacity="0.2" />

            {/* Workspace desk structure */}
            <g id="desk">
                <rect x="150" y="300" width="500" height="20" rx="5" fill="#d0d0d0" stroke="#c0c0c0" strokeWidth="1" />
                <rect x="180" y="320" width="440" height="80" rx="2" fill="#e0e0e0" stroke="#d0d0d0" strokeWidth="1" />
            </g>
        </g>

        {/* Primary workspace elements */}
        <g id="workspace-elements">
            {/* Document display tablet */}
            <g id="tablet-document">
                <rect x="300" y="180" width="200" height="120" rx="5" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="2" />
                <rect x="310" y="190" width="180" height="100" rx="2" fill="white" stroke="#eee" strokeWidth="1" />

                {/* Document structure guidelines */}
                <g id="document-structure">
                    <line x1="320" y1="210" x2="480" y2="210" stroke="#ddd" strokeWidth="1" />
                    <line x1="320" y1="230" x2="480" y2="230" stroke="#ddd" strokeWidth="1" />
                    <line x1="320" y1="250" x2="480" y2="250" stroke="#ddd" strokeWidth="1" />
                    <line x1="320" y1="270" x2="480" y2="270" stroke="#ddd" strokeWidth="1" />
                </g>

                {/* Document content visualization */}
                <g id="document-content">
                    <rect x="320" y="195" width="120" height="8" rx="1" fill="#09A08D" opacity="0.7" />
                    <rect x="320" y="215" width="150" height="5" rx="1" fill="#777" opacity="0.7" />
                    <rect x="320" y="235" width="140" height="5" rx="1" fill="#777" opacity="0.7" />
                    <rect x="320" y="255" width="130" height="5" rx="1" fill="#777" opacity="0.7" />
                    <rect x="320" y="275" width="90" height="5" rx="1" fill="#777" opacity="0.7" />
                </g>
            </g>

            {/* Pen accessory */}
            <g id="pen">
                <path d="M520 240 L580 220 L585 230 L525 250 Z" fill="#3a3a3a" stroke="#222" strokeWidth="1" />
                <path d="M515 242 L520 240 L525 250 L518 248 Z" fill="#777777" stroke="#666666" strokeWidth="1" />
            </g>
        </g>

        {/* Data visualization elements */}
        <g id="data-visualization">
            {/* Chart panel */}
            <g id="chart-panel">
                <rect x="180" y="170" width="100" height="120" rx="5" fill="#f8f8f8" stroke="#eee" strokeWidth="1" />

                {/* Chart title */}
                <rect x="195" y="180" width="70" height="8" rx="1" fill="#555" />

                {/* Bar chart visualization */}
                <g id="bar-chart">
                    <rect x="195" y="240" width="10" height="30" fill="#09A08D" opacity="0.7" />
                    <rect x="210" y="220" width="10" height="50" fill="#09A08D" opacity="0.8" />
                    <rect x="225" y="200" width="10" height="70" fill="#09A08D" opacity="0.9" />
                    <rect x="240" y="230" width="10" height="40" fill="#09A08D" opacity="0.7" />
                    <rect x="255" y="210" width="10" height="60" fill="#09A08D" opacity="0.8" />
                </g>
            </g>
        </g>

        {/* Planning and organization elements */}
        <g id="planning-elements">
            {/* Clipboard */}
            <g id="clipboard">
                <rect x="520" y="170" width="100" height="120" rx="5" fill="#f0c486" stroke="#d19e52" strokeWidth="1" />
                <rect x="530" y="180" width="80" height="100" rx="2" fill="white" stroke="#eee" strokeWidth="1" />
                <path d="M560 170 L580 170 L580 180 L560 180 Z" fill="#d19e52" stroke="#c08d42" strokeWidth="1" />

                {/* Checklist on clipboard */}
                <g id="checklist">
                    <rect x="540" y="190" width="60" height="5" rx="1" fill="#555" />

                    {/* Completed items */}
                    <rect x="540" y="205" width="40" height="5" rx="1" fill="#777" opacity="0.7" />
                    <circle cx="535" cy="207" r="3" fill="#09A08D" />

                    <rect x="540" y="220" width="50" height="5" rx="1" fill="#777" opacity="0.7" />
                    <circle cx="535" cy="222" r="3" fill="#09A08D" />

                    <rect x="540" y="235" width="45" height="5" rx="1" fill="#777" opacity="0.7" />
                    <circle cx="535" cy="237" r="3" fill="#09A08D" />

                    {/* Pending items */}
                    <rect x="540" y="250" width="55" height="5" rx="1" fill="#777" opacity="0.7" />
                    <circle cx="535" cy="252" r="3" stroke="#777" strokeWidth="1" fill="none" />

                    <rect x="540" y="265" width="40" height="5" rx="1" fill="#777" opacity="0.7" />
                    <circle cx="535" cy="267" r="3" stroke="#777" strokeWidth="1" fill="none" />
                </g>
            </g>
        </g>

        {/* Additional workspace equipment */}
        <g id="additional-equipment">
            {/* Laptop */}
            <g id="laptop">
                <path d="M280 340 L350 340 L360 380 L270 380 Z" fill="#333" stroke="#222" strokeWidth="1" />
                <rect x="280" y="320" width="70" height="20" rx="2" fill="#444" stroke="#333" strokeWidth="1" />
                <rect x="285" y="325" width="60" height="10" rx="1" fill="#252830" stroke="#1a1c22" strokeWidth="0.5" />
            </g>

            {/* Notebook */}
            <g id="notebook">
                <rect x="380" y="340" width="40" height="50" rx="2" fill="#f8f8f8" stroke="#ddd" strokeWidth="1" />
                <line x1="380" y1="350" x2="420" y2="350" stroke="#ddd" strokeWidth="1" />
                <line x1="380" y1="360" x2="420" y2="360" stroke="#ddd" strokeWidth="1" />
                <line x1="380" y1="370" x2="420" y2="370" stroke="#ddd" strokeWidth="1" />
                <line x1="380" y1="380" x2="420" y2="380" stroke="#ddd" strokeWidth="1" />
                <rect x="385" y="352" width="25" height="3" rx="1" fill="#777" opacity="0.3" />
                <rect x="385" y="362" width="20" height="3" rx="1" fill="#777" opacity="0.3" />
                <rect x="385" y="372" width="15" height="3" rx="1" fill="#777" opacity="0.3" />
            </g>
        </g>
    </svg>
);

/**
 * AnimatedSvgIllustration Component
 * Displays SVG illustrations with smooth transitions between them
 */
const AnimatedSvgIllustration = () => {
    // Track which SVG is currently displayed
    const [activeSvg, setActiveSvg] = useState('support');

    // Auto-rotate SVGs every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSvg(current => {
                if (current === 'support') return 'developer';
                if (current === 'developer') return 'analyst';
                return 'support';
            });
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    // Map of SVG components for easy reference
    const svgComponents = {
        support: <SupportSvg />,
        developer: <DeveloperSvg />,
        analyst: <AnalystSvg />
    };

    return (
        <div className="w-full h-full">
            <AnimatePresence mode="wait">
                {Object.entries(svgComponents).map(([key, component]) => (
                    key === activeSvg && (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut"
                            }}
                            className="w-full h-full"
                        >
                            {component}
                        </motion.div>
                    )
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedSvgIllustration;