
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Users } from 'lucide-react';
import { translations } from './constants';
import { MatrixData, PersonProcessedData, PersonWithMatrix, LanguageKey } from './types';
import { calculateMatrix } from './services/numerologyService';

import AnimatedBackground from './components/AnimatedBackground';
import PersonalInputScreen from './components/PersonalInputScreen';
import CompatibilityInputScreen from './components/CompatibilityInputScreen';
import PersonalResultsScreen from './components/PersonalResultsScreen';
import CompatibilityResultsScreen from './components/CompatibilityResultsScreen';
import TabButton from './components/TabButton';

type ViewMode = 'input' | 'results';
type AppMode = 'personal' | 'compatibility';

const App: React.FC = () => {
    const [appMode, setAppMode] = useState<AppMode>('personal');
    const [view, setView] = useState<ViewMode>('input');
    const [personalData, setPersonalData] = useState<PersonWithMatrix | null>(null);
    const [compatData, setCompatData] = useState<{ p1: PersonWithMatrix, p2: PersonWithMatrix } | null>(null);
    
    const currentLang = 'vi' as LanguageKey; // Assuming Vietnamese for now
    const t = translations[currentLang];

    // Audio refs - assuming audio files are accessible via these URLs
    const personalAudioRef = useRef<HTMLAudioElement>(null);
    const compatAudioRef = useRef<HTMLAudioElement>(null);
    
    // Preload audio
    useEffect(() => {
        if (personalAudioRef.current) personalAudioRef.current.load();
        if (compatAudioRef.current) compatAudioRef.current.load();
    }, []);

    const handlePersonalCalculate = (name: string, date: Date) => {
        const matrix = calculateMatrix(date);
        if (matrix) {
            setPersonalData({ name, date, matrix });
            setView('results');
            personalAudioRef.current?.play().catch(e => console.error("Personal audio play failed:", e));
        } else {
            // Handle error, e.g. show a notification
            console.error("Failed to calculate personal matrix.");
        }
    };

    const handleCompatCalculate = (p1Data: PersonProcessedData, p2Data: PersonProcessedData) => {
        const matrix1 = calculateMatrix(p1Data.date);
        const matrix2 = calculateMatrix(p2Data.date);

        if (matrix1 && matrix2) {
            setCompatData({
                p1: { ...p1Data, matrix: matrix1 },
                p2: { ...p2Data, matrix: matrix2 }
            });
            setView('results');
            compatAudioRef.current?.play().catch(e => console.error("Compatibility audio play failed:", e));
        } else {
            console.error("Failed to calculate compatibility matrices.");
        }
    };

    const resetToInput = () => {
        setView('input');
        setPersonalData(null);
        setCompatData(null);
        // Optionally stop audio
        personalAudioRef.current?.pause();
        if (personalAudioRef.current) personalAudioRef.current.currentTime = 0;
        compatAudioRef.current?.pause();
        if (compatAudioRef.current) compatAudioRef.current.currentTime = 0;
    };
    
    const handleModeChange = (newMode: AppMode) => {
        setAppMode(newMode);
        resetToInput();
    }
    
    const pageVariants = {
        initial: { opacity: 0, x: appMode === 'personal' ? -100 : 100 }, // Increased X offset
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: appMode === 'personal' ? 100 : -100 } // Increased X offset
    };

    const pageTransition = { type: 'tween' as const, ease: 'anticipate' as const, duration: 0.5 }; // Slightly increased duration

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900 text-white flex flex-col items-center p-3 sm:p-4 lg:p-6 overflow-hidden relative">
            <AnimatedBackground />
            
            <audio ref={personalAudioRef} src="https://cdn.glitch.global/beae5651-aaf3-4898-bc23-03d225c96e25/VICKY%20NHUNG%20-%20VI%E1%BB%86T%20NAM%20NH%E1%BB%AENG%20CHUY%E1%BA%BEN%20%C4%90I%20(OFFICIAL%20MV)%20_%20V%C3%8C%20CU%E1%BB%98C%20%C4%90%E1%BB%9CI%20L%C3%80%20NH%E1%BB%AENG%20CHUY%E1%BA%BEN%20%C4%90I%20(mp3cut.net).mp3?v=1750066330317" preload="auto" />
            <audio ref={compatAudioRef} src="https://cdn.glitch.global/beae5651-aaf3-4898-bc23-03d225c96e25/H%C6%A1n%20C%E1%BA%A3%20Y%C3%AAu%20-%20%C4%90%E1%BB%A9c%20Ph%C3%BAc%20_%20Lyrics%20Video%20(mp3cut.net).mp3?v=1750066716999" preload="auto" />

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-2xl border border-white/10"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-5 border-b border-purple-500/20 pb-4">
                        <div className="flex items-center">
                            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 mr-2.5 sm:mr-3 shrink-0" />
                            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                                {t.appName}
                            </h1>
                        </div>
                        <div className="flex items-center border border-purple-500/20 rounded-lg p-1 bg-gray-900/40">
                            <TabButton isActive={appMode === 'personal'} onClick={() => handleModeChange('personal')}>
                                <User className="mr-1.5 h-4 w-4"/>{t.personalTab}
                            </TabButton>
                            <TabButton isActive={appMode === 'compatibility'} onClick={() => handleModeChange('compatibility')}>
                                <Users className="mr-1.5 h-4 w-4"/>{t.compatTab}
                            </TabButton>
                        </div>
                    </div>
                    
                    {/* "Tính Lại" button removed */}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view + appMode}
                            variants={pageVariants}
                            initial="initial"
                            animate="in"
                            exit="out"
                            transition={pageTransition}
                        >
                            {view === 'input' && appMode === 'personal' && <PersonalInputScreen onCalculate={handlePersonalCalculate} t={t} />}
                            {view === 'input' && appMode === 'compatibility' && <CompatibilityInputScreen onCalculate={handleCompatCalculate} t={t} />}
                            {view === 'results' && appMode === 'personal' && personalData && <PersonalResultsScreen userName={personalData.name} matrixData={personalData.matrix} t={t} />}
                            {view === 'results' && appMode === 'compatibility' && compatData && <CompatibilityResultsScreen p1={compatData.p1} p2={compatData.p2} t={t} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
            <footer className="text-center text-gray-500 text-xs py-4 mt-6 relative z-10">
                Made by Luis with <span className="text-purple-400">&hearts;</span>
            </footer>
        </div>
    );
}

export default App;
