
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, Heart } from 'lucide-react';
import { PersonWithMatrix, Translations, CompatibilityGuideResponse, CompatibilityMatrix, LanguageKey } from '../types';
import { generateCompatibilityGuide } from '../services/geminiService';
import { calculateCompatibility } from '../services/numerologyService';
import MarkdownRenderer from './MarkdownRenderer';

interface CompatibilityResultsScreenProps {
    p1: PersonWithMatrix;
    p2: PersonWithMatrix;
    t: Translations;
}

const resultsScreenVariants = {
  gridContainer: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  },
  leftColumnContainer: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  },
  rightColumn: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  },
  cardItem: {
    hidden: { opacity: 0, scale: 0.95, y:10 },
    visible: {
      opacity: 1,
      scale: 1,
      y:0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  },
};


const CompatibilityResultsScreen: React.FC<CompatibilityResultsScreenProps> = ({ p1, p2, t }) => {
    const [selectedTopic, setSelectedTopic] = useState<keyof CompatibilityGuideResponse | string>('overview');
    const [aiGuide, setAiGuide] = useState<CompatibilityGuideResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    const compatMatrix: CompatibilityMatrix = useMemo(() => calculateCompatibility(p1.matrix, p2.matrix), [p1.matrix, p2.matrix]);

    useEffect(() => {
        const fetchGuide = async () => {
            setIsLoading(true);
            setApiError(null);
            try {
                if (process.env.API_KEY) {
                    const content = await generateCompatibilityGuide(p1, p2, compatMatrix, 'vi' as LanguageKey);
                    setAiGuide(content);
                } else {
                     setApiError(t.apiError);
                }
            } catch (err) {
                 setApiError(t.apiError);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGuide();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [p1, p2, compatMatrix, t.apiError]); // t.apiError added to deps

    const renderCompatValue = (label: string, value: number) => (
      <div className="text-center bg-purple-800/30 p-3 rounded-lg">
        <div className="text-xs text-purple-300 mb-0.5">{label}</div>
        <div className="text-2xl font-bold text-purple-200">{value}</div>
      </div>
    );


    return (
        <motion.div 
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6"
            variants={resultsScreenVariants.gridContainer}
            initial="hidden"
            animate="visible"
        >
            <motion.div 
                className="lg:col-span-4 space-y-6"
                variants={resultsScreenVariants.leftColumnContainer}
            >
                <motion.div 
                    layout 
                    className="bg-gray-800/50 backdrop-blur-md p-5 rounded-xl shadow-xl border border-white/10 text-center"
                    variants={resultsScreenVariants.cardItem}
                >
                    <h2 className="text-xl font-semibold text-purple-300 mb-4">Tổng quan Tương hợp</h2>
                    <div className="flex justify-around items-center text-white mb-4">
                        <div className="text-center w-2/5">
                            <div className="text-3xl font-bold text-purple-300">{p1.matrix.lifePathNumber}</div>
                            <div className="text-xs text-gray-400 truncate" title={p1.name}>{p1.name}</div>
                        </div>
                        <Heart className="w-8 h-8 text-red-400/80 shrink-0" />
                        <div className="text-center w-2/5">
                            <div className="text-3xl font-bold text-purple-300">{p2.matrix.lifePathNumber}</div>
                            <div className="text-xs text-gray-400 truncate" title={p2.name}>{p2.name}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {renderCompatValue("Trung Tâm", compatMatrix.center)}
                        {renderCompatValue("Mục Đích", compatMatrix.purpose)}
                        {renderCompatValue("Hòa Hợp", compatMatrix.harmony)}
                    </div>
                </motion.div>

                <motion.div 
                    layout 
                    className="bg-gray-800/50 backdrop-blur-md p-5 rounded-xl shadow-xl border border-white/10"
                    variants={resultsScreenVariants.cardItem}
                >
                    <h2 className="text-xl font-semibold text-purple-300 mb-4">{t.compatTopics}</h2>
                    <div className="space-y-1.5">
                        {Object.entries(t.compatAnalysisTopics).map(([key, { title, icon: Icon }]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedTopic(key)}
                                className={`w-full flex items-center text-left px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out group
                                            ${selectedTopic === key ? 'bg-purple-600/70 text-white shadow-md' : 'hover:bg-purple-500/30 text-gray-300 hover:text-purple-200'}`}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-colors ${selectedTopic === key ? 'text-white' : 'text-purple-400 group-hover:text-purple-300'}`} />
                                <span className="text-sm font-medium">{title}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
            <motion.div 
                className="lg:col-span-8 bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/10 min-h-[500px] lg:min-h-[calc(100vh-200px)] flex flex-col"
                variants={resultsScreenVariants.rightColumn}
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                         <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-center flex-grow">
                            <motion.div
                                key="loader-icon-compat"
                                animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sparkles className="h-12 w-12 text-purple-400" />
                            </motion.div>
                            <p className="mt-4 text-gray-400 text-sm">{t.loadingCompat}</p>
                        </motion.div>
                    ) : apiError ? (
                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-center text-red-400 flex-grow p-4">
                            <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
                             <p className="font-semibold text-lg mb-2">Lỗi Kết Nối AI</p>
                            {/* Render error message which might contain HTML */}
                            <div className="text-sm max-w-md text-gray-300" dangerouslySetInnerHTML={{ __html: apiError }} />
                        </motion.div>
                    ) : (
                         <motion.div 
                            key={selectedTopic} 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }} 
                            transition={{ duration: 0.25 }}
                            className="overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-purple-700/50 scrollbar-track-gray-800/30"
                        >
                            <h3 className="text-2xl font-bold text-purple-300 mb-4 sticky top-0 bg-gray-800/80 backdrop-blur-sm py-2 z-10">
                                {t.compatAnalysisTopics[selectedTopic]?.title || "Phân tích"}
                            </h3>
                            <MarkdownRenderer text={aiGuide?.[selectedTopic as keyof CompatibilityGuideResponse]} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default CompatibilityResultsScreen;