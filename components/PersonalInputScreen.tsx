
import React, { useState } from 'react';
import { Translations } from '../types';
import DateInput from './DateInput';

interface PersonalInputScreenProps {
    onCalculate: (name: string, date: Date) => void;
    t: Translations;
}

const PersonalInputScreen: React.FC<PersonalInputScreenProps> = ({ onCalculate, t }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Vui lòng nhập tên của bạn.');
            return;
        }
        const parts = dob.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 1900 && year < 2100) {
                const dateObj = new Date(year, month - 1, day);
                // Final check to ensure date parts match (e.g. Feb 30 becomes Mar 1 or 2)
                if (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day) {
                    onCalculate(name.trim(), dateObj);
                    setError('');
                    return;
                }
            }
        }
        setError('Định dạng ngày chưa đúng (dd/mm/yyyy) hoặc ngày không hợp lệ!');
    };

    return (
        <div className="w-full max-w-md mx-auto text-center animate-fadeIn">
            <p className="mt-2 text-gray-400 text-base leading-relaxed">{t.personalDescription}</p>
            <div className="mt-8 space-y-5 text-left">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.nameLabel}</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full px-4 py-3 bg-gray-800/60 border border-purple-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-500"
                        placeholder="Nhập tên của bạn"
                    />
                </div>
                <DateInput 
                    label={t.dobLabel} 
                    value={dob} 
                    onChange={e => setDob(e.target.value)} 
                    error={error} 
                />
            </div>
            <button 
                onClick={handleSubmit} 
                disabled={!name || !dob}
                className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {t.calculate}
            </button>
        </div>
    );
};

export default PersonalInputScreen;
