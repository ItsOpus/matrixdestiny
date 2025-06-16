
import React, { useState } from 'react';
import { Translations, PersonProcessedData } from '../types';
import DateInput from './DateInput';

interface CompatibilityInputScreenProps {
    onCalculate: (p1: PersonProcessedData, p2: PersonProcessedData) => void;
    t: Translations;
}

const CompatibilityInputScreen: React.FC<CompatibilityInputScreenProps> = ({ onCalculate, t }) => {
    const [p1, setP1] = useState({ name: '', dob: '' });
    const [p2, setP2] = useState({ name: '', dob: '' });
    const [errors, setErrors] = useState({ p1Dob: '', p2Dob: '', p1Name: '', p2Name: '' });

    const validateDob = (dobStr: string): Date | null => {
        const parts = dobStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 1900 && year < 2100) {
                const dateObj = new Date(year, month - 1, day);
                if (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day) {
                    return dateObj;
                }
            }
        }
        return null;
    };

    const handleSubmit = () => {
        let valid = true;
        const newErrors = { p1Dob: '', p2Dob: '', p1Name: '', p2Name: '' };

        if (!p1.name.trim()) {
            newErrors.p1Name = "Vui lòng nhập tên Người 1.";
            valid = false;
        }
        const date1 = validateDob(p1.dob);
        if (!date1) {
            newErrors.p1Dob = "Ngày sinh Người 1 không hợp lệ (DD/MM/YYYY).";
            valid = false;
        }

        if (!p2.name.trim()) {
            newErrors.p2Name = "Vui lòng nhập tên Người 2.";
            valid = false;
        }
        const date2 = validateDob(p2.dob);
        if (!date2) {
            newErrors.p2Dob = "Ngày sinh Người 2 không hợp lệ (DD/MM/YYYY).";
            valid = false;
        }
        
        setErrors(newErrors);

        if (valid && date1 && date2) {
            onCalculate({ name: p1.name.trim(), date: date1 }, { name: p2.name.trim(), date: date2 });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center animate-fadeIn">
            <p className="mt-2 text-gray-400 text-base leading-relaxed">{t.compatDescription}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left">
                <div className="space-y-5 p-4 bg-gray-800/20 rounded-lg border border-white/5">
                    <h3 className="text-xl font-semibold text-purple-300 text-center mb-3">Người 1</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.p1NameLabel}</label>
                        <input 
                            type="text" 
                            value={p1.name} 
                            onChange={e => setP1({ ...p1, name: e.target.value })} 
                            className={`w-full px-4 py-3 bg-gray-800/60 border ${errors.p1Name ? 'border-red-500/70' : 'border-purple-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-500`}
                            placeholder="Tên Người 1"
                        />
                        {errors.p1Name && <p className="text-red-400 text-xs mt-1.5 px-1">{errors.p1Name}</p>}
                    </div>
                    <DateInput 
                        label={t.p1DobLabel} 
                        value={p1.dob} 
                        onChange={e => setP1({ ...p1, dob: e.target.value })} 
                        error={errors.p1Dob} 
                    />
                </div>
                <div className="space-y-5 p-4 bg-gray-800/20 rounded-lg border border-white/5">
                    <h3 className="text-xl font-semibold text-purple-300 text-center mb-3">Người 2</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.p2NameLabel}</label>
                        <input 
                            type="text" 
                            value={p2.name} 
                            onChange={e => setP2({ ...p2, name: e.target.value })} 
                            className={`w-full px-4 py-3 bg-gray-800/60 border ${errors.p2Name ? 'border-red-500/70' : 'border-purple-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-500`}
                            placeholder="Tên Người 2"
                        />
                         {errors.p2Name && <p className="text-red-400 text-xs mt-1.5 px-1">{errors.p2Name}</p>}
                    </div>
                    <DateInput 
                        label={t.p2DobLabel} 
                        value={p2.dob} 
                        onChange={e => setP2({ ...p2, dob: e.target.value })} 
                        error={errors.p2Dob} 
                    />
                </div>
            </div>
            <button 
                onClick={handleSubmit} 
                disabled={!p1.name || !p1.dob || !p2.name || !p2.dob}
                className="w-full md:w-auto mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-10 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {t.calculateCompat}
            </button>
        </div>
    );
};

export default CompatibilityInputScreen;
