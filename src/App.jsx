import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Heart, Zap, Gem, AlertTriangle, Briefcase, HeartHandshake, GraduationCap, Dna, Users } from 'lucide-react';

// --- CONFIGURATION & TRANSLATIONS ---
const API_KEY = "AIzaSyBzWjg04MyOZlNGNa7HyHiT21pAGxw_O1w"; 

const translations = {
    vi: {
        appName: "Ma Trận Vận Mệnh AI",
        welcome: "Chào mừng đến với Cẩm Nang Ma Trận Vận Mệnh",
        personalDescription: "Khám phá bản thân sâu sắc hơn với những phân tích được tạo bởi AI dành riêng cho bạn. Hãy nhập tên và ngày sinh để bắt đầu.",
        compatDescription: "Khám phá sự hòa hợp diệu kỳ giữa hai người. Hãy nhập thông tin của cặp đôi để AI phân tích nhé!",
        nameLabel: "Tên của bạn",
        dobLabel: "Ngày sinh của bạn (dd/mm/yyyy)",
        p1NameLabel: "Tên Người 1",
        p2NameLabel: "Tên Người 2",
        p1DobLabel: "Ngày sinh Người 1 (dd/mm/yyyy)",
        p2DobLabel: "Ngày sinh Người 2 (dd/mm/yyyy)",
        calculate: "Tạo Cẩm Nang Cá Nhân",
        calculateCompat: "Xem Tương Hợp",
        error: "Vui lòng nhập ngày hợp lệ.",
        loadingGuide: "AI đang soạn cẩm nang dành riêng cho bạn, chờ một chút xíu nha...",
        loadingCompat: "AI đang phân tích sự kết nối của cặp đôi, bạn chờ tí nhé...",
        apiError: "Ôi, có lỗi nhỏ xảy ra khi kết nối với AI. Bạn thử lại nhé!",
        diagram: "Sơ đồ Ma trận Vận mệnh",
        analysisTopics: "Cẩm Nang Cá Nhân",
        compatTopics: "Cẩm Nang Tương Hợp",
        personalTab: "Cá Nhân",
        compatTab: "Tương Hợp",
        topics: {
            personality: { title: "Tổng quan Tính cách", icon: User },
            destiny: { title: "Sứ Mệnh & Tiền Kiếp", icon: Zap },
            talents: { title: "Tài năng & Sức mạnh", icon: Gem },
            career: { title: "Sự Nghiệp & Học Tập", icon: GraduationCap },
            relationships: { title: "Tình duyên & Đối tác", icon: HeartHandshake },
            health: { title: "Sức Khỏe & Năng Lượng", icon: Dna }
        },
        compatAnalysisTopics: {
            overview: { title: "Tổng quan Mối quan hệ", icon: Heart },
            harmony: { title: "Hòa hợp & Thách thức", icon: Zap },
            purpose: { title: "Mục đích chung", icon: Gem },
        },
        interpretations: { 1: "The Magician", 2: "The High Priestess", 3: "The Empress", 4: "The Emperor", 5: "The Hierophant", 6: "The Lovers", 7: "The Chariot", 8: "Strength", 9: "The Hermit", 10: "Wheel of Fortune", 11: "Justice", 12: "The Hanged Man", 13: "Death", 14: "Temperance", 15: "The Devil", 16: "The Tower", 17: "The Star", 18: "The Moon", 19: "The Sun", 20: "Judgement", 21: "The World", 22: "The Fool" },
        lifePathInterpretations: { 1: "Nhà lãnh đạo", 2: "Người hòa giải", 3: "Người truyền cảm hứng", 4: "Nhà kiến tạo", 5: "Người tìm kiếm tự do", 6: "Người chăm sóc", 7: "Nhà tư tưởng", 8: "Người điều hành", 9: "Nhà nhân đạo", 11: "Bậc thầy trực giác", 22: "Kiến trúc sư vĩ đại" }
    }
};

// --- UTILITY & CALCULATION ---
const sumDigits = (numStr) => String(numStr).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
const reduceToSingleDigitOrMaster = (num) => {
    if (num === 11 || num === 22) return num;
    let sum = sumDigits(String(num));
    while (sum > 9 && sum !== 11 && sum !== 22) { sum = sumDigits(String(sum)); }
    return sum;
};
const reduceTo22 = (num) => {
    let currentNum = num;
    while (currentNum > 22) { currentNum = sumDigits(String(currentNum)); }
    return currentNum;
};
const calculateMatrix = (date) => {
    if (!date) return null;
    const day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    const a = reduceTo22(day), b = reduceTo22(month), c = reduceTo22(year);
    const d = reduceTo22(a + b + c), e = reduceTo22(a + b + c + d);
    const f = reduceTo22(a + b), g = reduceTo22(b + c), h = reduceTo22(c + d), i = reduceTo22(d + a);
    const lifePathNumber = reduceToSingleDigitOrMaster(sumDigits(String(day)) + sumDigits(String(month)) + sumDigits(String(year)));
    return { a, b, c, d, e, f, g, h, i, center: e, lifePathNumber };
};
const calculateCompatibility = (m1, m2) => ({
    center: reduceTo22(m1.center + m2.center),
    purpose: reduceTo22(m1.c + m2.c),
    harmony: reduceTo22(m1.d + m2.d)
});

// --- AI INTEGRATION ---
const generatePersonalGuide = async (matrixData, userName, lang) => {
    const t = translations[lang];
    const getEnergyName = (num) => `${num} - ${t.interpretations[num] || ''}`;
    const getLifePathName = (num) => `${num} - ${t.lifePathInterpretations[num] || ''}`;
    const prompt = `Bạn là một AI chuyên gia thần số học dễ thương, ấm áp và sâu sắc. Nhiệm vụ của bạn là tạo ra một cẩm nang hoàn chỉnh cho người dùng tên ${userName}, kết hợp Ma Trận Vận Mệnh và Số Chủ Đạo.
    Ngôn ngữ: Tiếng Việt. Giọng điệu: cực kỳ thân thiện, đáng yêu. Sử dụng emoji.
    Định dạng output: Một đối tượng JSON hợp lệ duy nhất.
    Dữ liệu người dùng:
    - Số Chủ Đạo: ${getLifePathName(matrixData.lifePathNumber)}
    - Năng lượng A: ${getEnergyName(matrixData.a)}
    - Năng lượng B: ${getEnergyName(matrixData.b)}
    - Năng lượng C (Nghiệp quá khứ): ${getEnergyName(matrixData.c)}
    - Năng lượng D (Tài năng thuần thục): ${getEnergyName(matrixData.d)}
    - Năng lượng E (Vùng thoải mái): ${getEnergyName(matrixData.center)}
    **Hãy phân tích sâu sắc, kết hợp Số Chủ Đạo và các năng lượng Ma Trận trong mỗi chủ đề.**
    Sử dụng tag <highlight>Số X - Tên</highlight> để nhấn mạnh các con số.
    Schema JSON: { "personality": "...", "destiny": "...", "talents": "...", "career": "...", "relationships": "...", "health": "..." }`;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const result = await response.json();
        const rawText = result.candidates[0].content.parts[0].text;
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Could not find a valid JSON object in the AI's response.");
        let jsonString = jsonMatch[0];
        jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(jsonString);
    } catch (error) { console.error("AI Generation Error:", error); throw error; }
};
const generateCompatibilityGuide = async (p1, p2, compatMatrix, lang) => {
    const t = translations[lang];
    const getEnergyName = (num) => `${num} - ${t.interpretations[num] || ''}`;
    const getLifePathName = (num) => `${num} - ${t.lifePathInterpretations[num] || ''}`;
    const prompt = `Bạn là một AI chuyên gia thần số học tình yêu, dễ thương và sâu sắc. Nhiệm vụ của bạn là tạo ra một cẩm nang tương hợp chi tiết và đa chiều cho cặp đôi ${p1.name} và ${p2.name}.
    Ngôn ngữ: Tiếng Việt. Giọng điệu: cực kỳ thân thiện, đáng yêu, sử dụng emoji.
    Định dạng output: Một đối tượng JSON hợp lệ duy nhất.
    Dữ liệu cặp đôi:
    - ${p1.name}: Số Chủ Đạo ${getLifePathName(p1.matrix.lifePathNumber)}, Trung tâm ${getEnergyName(p1.matrix.center)}, Tài năng (D) ${getEnergyName(p1.matrix.d)}, Nghiệp (C) ${getEnergyName(p1.matrix.c)}.
    - ${p2.name}: Số Chủ Đạo ${getLifePathName(p2.matrix.lifePathNumber)}, Trung tâm ${getEnergyName(p2.matrix.center)}, Tài năng (D) ${getEnergyName(p2.matrix.d)}, Nghiệp (C) ${getEnergyName(p2.matrix.c)}.
    Dữ liệu tương hợp:
    - Trung tâm chung: ${getEnergyName(compatMatrix.center)}
    - Mục đích chung: ${getEnergyName(compatMatrix.purpose)}
    - Hòa hợp/Thử thách chung: ${getEnergyName(compatMatrix.harmony)}
    **Hãy phân tích sâu sắc từng phần, kết hợp cả chỉ số cá nhân và chỉ số chung.**
    Schema JSON: { "overview": "...", "harmony": "...", "purpose": "..." }`;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const result = await response.json();
        const rawText = result.candidates[0].content.parts[0].text;
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Could not find a valid JSON object in the AI's response.");
        let jsonString = jsonMatch[0];
        jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(jsonString);
    } catch (error) { console.error("AI Generation Error:", error); throw error; }
};

// --- COMPONENTS ---
const AnimatedBackground = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
        <style dangerouslySetInnerHTML={{ __html: `.bubbles{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;z-index:0}.bubble{position:absolute;bottom:-150px;background-color:rgba(168,85,247,0.2);border-radius:50%;animation:floatUp 25s infinite linear;box-shadow:0 0 15px rgba(168,85,247,0.3)}@keyframes floatUp{0%{transform:translateY(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-120vh) rotate(600deg);opacity:0}}` }}/>
        <div className="bubbles">
            {Array.from({ length: 20 }).map((_, i) => {
                const size = Math.random() * 60 + 20;
                const style = { width: `${size}px`, height: `${size}px`, left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 15 + 10}s`, animationDelay: `${Math.random() * 10}s` };
                return <div key={i} className="bubble" style={style}></div>;
            })}
        </div>
    </div>
);

const MatrixDiagram = ({ matrixData }) => {
    const size = 500, centerPos = size / 2, padding = 60;
    const points = { b: { x: centerPos, y: padding, v: matrixData.b }, g: { x: centerPos + 125, y: 100, v: matrixData.g }, c: { x: size - padding, y: centerPos, v: matrixData.c }, h: { x: centerPos + 125, y: size - 100, v: matrixData.h }, d: { x: centerPos, y: size - padding, v: matrixData.d }, i: { x: centerPos - 125, y: size - 100, v: matrixData.i }, a: { x: padding, y: centerPos, v: matrixData.a }, f: { x: centerPos - 125, y: 100, v: matrixData.f }, e: { x: centerPos, y: centerPos, v: matrixData.e } };
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
    const itemVariants = { hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } } };
    return (
        <motion.svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm mx-auto h-auto" variants={containerVariants} initial="hidden" animate="visible">
            <motion.text x={centerPos} y={30} textAnchor="middle" fill="#c4b5fd" className="font-bold text-lg" variants={itemVariants}>Life Path: {matrixData.lifePathNumber}</motion.text>
            <motion.path d={`M ${points.a.x} ${points.a.y} L ${points.c.x} ${points.c.y}`} stroke="rgba(192,132,252,0.3)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
            <motion.path d={`M ${points.b.x} ${points.b.y} L ${points.d.x} ${points.d.y}`} stroke="rgba(192,132,252,0.3)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
            <motion.path d={`M ${points.a.x} ${points.a.y} L ${points.b.x} ${points.b.y} L ${points.c.x} ${points.c.y} L ${points.d.x} ${points.d.y} Z`} stroke="#a855f7" strokeWidth="1.5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
            <motion.path d={`M ${points.f.x} ${points.f.y} L ${points.g.x} ${points.g.y} L ${points.h.x} ${points.h.y} L ${points.i.x} ${points.i.y} Z`} stroke="rgba(192,132,252,0.8)" strokeWidth="1" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }} />
            {Object.values(points).map((p, idx) => React.createElement(motion.g, { key: idx, variants: itemVariants },
                React.createElement("circle", { cx: p.x, cy: p.y, r: "24", fill: "rgba(31,41,55,0.8)", stroke: "rgba(192,132,252,0.7)", strokeWidth: "1.5" }),
                React.createElement("text", { x: p.x, y: p.y + 8, textAnchor: "middle", fill: "#F3E8FF", className: "text-xl font-bold" }, p.v)
            ))}
        </motion.svg>
    );
};
const MarkdownRenderer = ({ text = "" }) => {
    const html = useMemo(() => {
        if (!text) return "";
        let processedText = text.replace(/\\n/g, '\n').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="p-1 bg-purple-900/50 text-purple-300 font-semibold rounded-md inline-block">$1</span>').replace(/^((\s*(\*|-) .+\n?)+)/gm, m => `<ul class="list-disc list-inside ml-4 mt-4 mb-4 space-y-2">${m.trim().split('\n').map(i => `<li>${i.substring(2).trim()}</li>`).join('')}</ul>`).replace(/^((\s*(1\.|2\.|3\.|4\.) .+\n?)+)/gm, m => `<ol class="list-decimal list-inside ml-4 mt-4 mb-4 space-y-2">${m.trim().split('\n').map(i => `<li>${i.substring(i.indexOf(' ') + 1).trim()}</li>`).join('')}</ol>`).replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-purple-300 mt-6 mb-4 pb-2 border-b border-purple-500/20">$1</h2>').replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-purple-300 mt-6 mb-3">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>').replace(/\n/g, '<br />');
        return processedText.replace(/<br \/>(\s*<(ul|ol))/g, '$1');
    }, [text]);
    return React.createElement("div", { className: "text-gray-300 leading-relaxed font-light prose-invert", dangerouslySetInnerHTML: { __html: html } });
};
const DateInput = ({ label, value, onChange, error }) => React.createElement("div", null, React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, label), React.createElement("input", { type: "text", placeholder: "dd/mm/yyyy", value: value, onChange: onChange, className: `w-full px-4 py-3 bg-gray-800/50 border ${error ? 'border-red-500' : 'border-purple-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400` }), error && React.createElement("p", { className: "text-red-400 text-xs mt-1" }, error));

const PersonalInputScreen = ({ onCalculate, t }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = () => {
        const parts = dob.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10), month = parseInt(parts[1], 10), year = parseInt(parts[2], 10);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 1900) {
                const dateObj = new Date(year, month - 1, day);
                if (name && dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day) { onCalculate(name, dateObj); setError(''); return; }
            }
        }
        setError('Định dạng ngày chưa đúng (dd/mm/yyyy) hoặc ngày không hợp lệ!');
    };
    return React.createElement('div', { className: "w-full max-w-md mx-auto text-center" }, React.createElement("p", { className: "mt-2 text-gray-400" }, t.personalDescription), React.createElement("div", { className: "mt-8 space-y-4 text-left" }, React.createElement("div", null, React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, t.nameLabel), React.createElement("input", { type: "text", value: name, onChange: e => setName(e.target.value), className: "w-full px-4 py-3 bg-gray-800/50 border border-purple-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" })), React.createElement(DateInput, { label: t.dobLabel, value: dob, onChange: e => setDob(e.target.value), error: error })), React.createElement("button", { onClick: handleSubmit, className: "w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20" }, t.calculate));
};

const CompatibilityInputScreen = ({ onCalculate, t }) => {
    const [p1, setP1] = useState({ name: '', dob: '' });
    const [p2, setP2] = useState({ name: '', dob: '' });
    const [errors, setErrors] = useState({ p1: '', p2: '' });
    const validateDob = (dob) => {
        const parts = dob.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10), month = parseInt(parts[1], 10), year = parseInt(parts[2], 10);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 1900) {
                const dateObj = new Date(year, month - 1, day);
                if (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day) return dateObj;
            }
        }
        return null;
    };
    const handleSubmit = () => {
        const date1 = validateDob(p1.dob), date2 = validateDob(p2.dob);
        const newErrors = { p1: '', p2: '' };
        if (!p1.name) newErrors.p1 = "Vui lòng nhập tên.";
        if (!date1) newErrors.p1 = newErrors.p1 ? newErrors.p1 + " Ngày sinh không hợp lệ." : "Ngày sinh không hợp lệ.";
        if (!p2.name) newErrors.p2 = "Vui lòng nhập tên.";
        if (!date2) newErrors.p2 = newErrors.p2 ? newErrors.p2 + " Ngày sinh không hợp lệ." : "Ngày sinh không hợp lệ.";
        setErrors(newErrors);
        if (p1.name && date1 && p2.name && date2) onCalculate({ name: p1.name, date: date1 }, { name: p2.name, date: date2 });
    };
    return React.createElement('div', { className: "w-full max-w-2xl mx-auto text-center" }, React.createElement("p", { className: "mt-2 text-gray-400" }, t.compatDescription), React.createElement("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left" }, React.createElement("div", { className: "space-y-4" }, React.createElement("h3", { className: "text-xl font-bold text-purple-300 text-center" }, "Người 1"), React.createElement("div", null, React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, t.p1NameLabel), React.createElement("input", { type: "text", value: p1.name, onChange: e => setP1({ ...p1, name: e.target.value }), className: "w-full px-4 py-3 bg-gray-800/50 border border-purple-500/50 rounded-lg" })), React.createElement(DateInput, { label: t.p1DobLabel, value: p1.dob, onChange: e => setP1({ ...p1, dob: e.target.value }), error: errors.p1 })), React.createElement("div", { className: "space-y-4" }, React.createElement("h3", { className: "text-xl font-bold text-purple-300 text-center" }, "Người 2"), React.createElement("div", null, React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, t.p2NameLabel), React.createElement("input", { type: "text", value: p2.name, onChange: e => setP2({ ...p2, name: e.target.value }), className: "w-full px-4 py-3 bg-gray-800/50 border border-purple-500/50 rounded-lg" })), React.createElement(DateInput, { label: t.p2DobLabel, value: p2.dob, onChange: e => setP2({ ...p2, dob: e.target.value }), error: errors.p2 }))), React.createElement("button", { onClick: handleSubmit, className: "w-full md:w-auto mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg" }, t.calculateCompat));
};

const PersonalResultsScreen = ({ userName, matrixData, t }) => {
    const [selectedTopic, setSelectedTopic] = useState('personality');
    const [aiGuide, setAiGuide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    useEffect(() => {
        const fetchGuide = async () => {
            setIsLoading(true); setApiError(null);
            try { const content = await generatePersonalGuide(matrixData, userName, 'vi'); setAiGuide(content); }
            catch (err) { setApiError(t.apiError); }
            finally { setIsLoading(false); }
        };
        fetchGuide();
    }, [matrixData, userName, t]);
    return React.createElement("div", { className: "w-full grid grid-cols-1 lg:grid-cols-3 gap-8" }, React.createElement("div", { className: "lg:col-span-1 space-y-6" }, React.createElement(motion.div, { layout: true, className: "bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10" }, React.createElement("h2", { className: "text-2xl font-bold text-white text-center mb-2" }, t.diagram), React.createElement(MatrixDiagram, { matrixData: matrixData })), React.createElement(motion.div, { layout: true, className: "bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10" }, React.createElement("h2", { className: "text-2xl font-bold text-white mb-4" }, t.analysisTopics), React.createElement("div", { className: "space-y-2" }, Object.entries(t.topics).map(([key, { title, icon: Icon }]) => React.createElement("button", { key: key, onClick: () => setSelectedTopic(key), className: `w-full flex items-center text-left p-3 rounded-lg transition-colors ${selectedTopic === key ? 'bg-purple-600/50 text-white' : 'hover:bg-gray-700/50 text-gray-300'}` }, React.createElement(Icon, { className: "w-5 h-5 mr-3" }), " ", title))))), React.createElement("div", { className: "lg:col-span-2 bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10 min-h-[600px]" }, React.createElement(AnimatePresence, { mode: "wait" }, isLoading ? React.createElement(motion.div, { key: "loader", className: "flex flex-col items-center justify-center h-full text-center" }, React.createElement(Sparkles, { className: "h-10 w-10 text-purple-400 animate-pulse" }), React.createElement("p", { className: "mt-4 text-gray-400" }, t.loadingGuide)) : apiError ? React.createElement(motion.div, { key: "error", className: "flex flex-col items-center justify-center h-full text-center text-red-400" }, React.createElement(AlertTriangle, { className: "w-12 h-12 mb-4" }), React.createElement("p", null, apiError)) : React.createElement(motion.div, { key: selectedTopic, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3 } }, React.createElement(MarkdownRenderer, { text: aiGuide?.[selectedTopic] })))));
};
const CompatibilityResultsScreen = ({ p1, p2, t }) => {
    const [selectedTopic, setSelectedTopic] = useState('overview');
    const [aiGuide, setAiGuide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const compatMatrix = useMemo(() => calculateCompatibility(p1.matrix, p2.matrix), [p1, p2]);
    useEffect(() => {
        const fetchGuide = async () => {
            setIsLoading(true); setApiError(null);
            try { const content = await generateCompatibilityGuide(p1, p2, compatMatrix, 'vi'); setAiGuide(content); }
            catch (err) { setApiError(t.apiError); }
            finally { setIsLoading(false); }
        };
        fetchGuide();
    }, [p1, p2, compatMatrix, t]);
    return React.createElement("div", { className: "w-full grid grid-cols-1 lg:grid-cols-3 gap-8" }, React.createElement("div", { className: "lg:col-span-1 space-y-6" }, React.createElement(motion.div, { layout: true, className: "bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10 text-center" }, React.createElement("h2", { className: "text-2xl font-bold text-white mb-4" }, "Sơ đồ Tương hợp"), React.createElement("div", { className: "flex justify-around items-center text-white" }, React.createElement("div", { className: "text-center" }, React.createElement("div", { className: "text-4xl font-bold text-purple-300" }, p1.matrix.lifePathNumber), React.createElement("div", { className: "text-sm" }, p1.name)), React.createElement(Heart, { className: "w-10 h-10 text-red-400" }), React.createElement("div", { className: "text-center" }, React.createElement("div", { className: "text-4xl font-bold text-purple-300" }, p2.matrix.lifePathNumber), React.createElement("div", { className: "text-sm" }, p2.name)))), React.createElement(motion.div, { layout: true, className: "bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10" }, React.createElement("h2", { className: "text-2xl font-bold text-white mb-4" }, t.compatTopics), React.createElement("div", { className: "space-y-2" }, Object.entries(t.compatAnalysisTopics).map(([key, { title, icon: Icon }]) => React.createElement("button", { key: key, onClick: () => setSelectedTopic(key), className: `w-full flex items-center text-left p-3 rounded-lg transition-colors ${selectedTopic === key ? 'bg-purple-600/50 text-white' : 'hover:bg-gray-700/50 text-gray-300'}` }, React.createElement(Icon, { className: "w-5 h-5 mr-3" }), title))))), React.createElement("div", { className: "lg:col-span-2 bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10 min-h-[600px]" }, React.createElement(AnimatePresence, { mode: "wait" }, isLoading ? React.createElement(motion.div, { key: "loader", className: "flex flex-col items-center justify-center h-full text-center" }, React.createElement(Sparkles, { className: "h-10 w-10 text-purple-400 animate-pulse" }), React.createElement("p", { className: "mt-4 text-gray-400" }, t.loadingCompat)) : apiError ? React.createElement(motion.div, { key: "error", className: "flex flex-col items-center justify-center h-full text-center text-red-400" }, React.createElement(AlertTriangle, { className: "w-12 h-12 mb-4" }), React.createElement("p", null, apiError)) : React.createElement(motion.div, { key: selectedTopic, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3 } }, React.createElement(MarkdownRenderer, { text: aiGuide?.[selectedTopic] })))));
};

export default function App() {
    const [mode, setMode] = useState('personal');
    const [view, setView] = useState('input');
    const [personalData, setPersonalData] = useState(null);
    const [compatData, setCompatData] = useState(null);
    const t = translations.vi;
    
    const personalAudioRef = useRef(null);
    const compatAudioRef = useRef(null);

    const handlePersonalCalculate = (name, date) => {
        setPersonalData({ name, matrix: calculateMatrix(date) });
        setView('results');
        personalAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    };
    const handleCompatCalculate = (p1, p2) => {
        setCompatData({ p1: { ...p1, matrix: calculateMatrix(p1.date) }, p2: { ...p2, matrix: calculateMatrix(p2.date) } });
        setView('results');
        compatAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    };
    const reset = () => {
        setView('input');
        setPersonalData(null);
        setCompatData(null);
    };

    const TabButton = ({ isActive, onClick, children }) => (
        <button onClick={onClick} className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-white' : 'hover:bg-gray-400 hover:text-white'}`}>
            <span className="relative z-10 flex items-center">{children}</span>
            {isActive && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
        </button>
    );

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 overflow-hidden relative">
            <AnimatedBackground />
            <audio ref={personalAudioRef} src="https://cdn.glitch.global/beae5651-aaf3-4898-bc23-03d225c96e25/VICKY%20NHUNG%20-%20VI%E1%BB%86T%20NAM%20NH%E1%BB%AENG%20CHUY%E1%BA%BEN%20%C4%90I%20(OFFICIAL%20MV)%20_%20V%C3%8C%20CU%E1%BB%98C%20%C4%90%E1%BB%9CI%20L%C3%80%20NH%E1%BB%AENG%20CHUY%E1%BA%BEN%20%C4%90I%20(mp3cut.net).mp3?v=1750066330317" preload="auto" />
            <audio ref={compatAudioRef} src="https://cdn.glitch.global/beae5651-aaf3-4898-bc23-03d225c96e25/H%C6%A1n%20C%E1%BA%A3%20Y%C3%AAu%20-%20%C4%90%E1%BB%A9c%20Ph%C3%BAc%20_%20Lyrics%20Video%20(mp3cut.net).mp3?v=1750066716999" preload="auto" />
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                <div className="bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center"><Sparkles className="w-8 h-8 text-purple-400 mr-3 shrink-0" /><h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{t.appName}</h1></div>
                        <div className="flex items-center border border-white/10 rounded-lg p-1 bg-gray-900/30">
                            <TabButton isActive={mode === 'personal'} onClick={() => { setMode('personal'); reset(); }}><User className="mr-2 h-4 w-4"/>{t.personalTab}</TabButton>
                            <TabButton isActive={mode === 'compatibility'} onClick={() => { setMode('compatibility'); reset(); }}><Users className="mr-2 h-4 w-4"/>{t.compatTab}</TabButton>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        {view === 'input' && mode === 'personal' && <PersonalInputScreen key="p-input" onCalculate={handlePersonalCalculate} t={t} />}
                        {view === 'input' && mode === 'compatibility' && <CompatibilityInputScreen key="c-input" onCalculate={handleCompatCalculate} t={t} />}
                        {view === 'results' && mode === 'personal' && <PersonalResultsScreen key="p-results" userName={personalData.name} matrixData={personalData.matrix} t={t} />}
                        {view === 'results' && mode === 'compatibility' && <CompatibilityResultsScreen key="c-results" p1={compatData.p1} p2={compatData.p2} t={t} />}
                    </AnimatePresence>
                </div>
            </div>
            <footer className="text-center text-gray-500 text-sm py-4 relative z-10">Made by Luis with luv</footer>
        </div>
    );
}
