
import React from 'react';

interface DateInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
        <input 
            type="text" 
            placeholder="DD/MM/YYYY" 
            value={value} 
            onChange={onChange}
            className={`w-full px-4 py-3 bg-gray-800/60 border ${error ? 'border-red-500/70 focus:border-red-500' : 'border-purple-600/50 focus:border-purple-500'} rounded-lg focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400/50' : 'focus:ring-purple-400/50'} transition-colors duration-200 text-gray-200 placeholder-gray-500`}
        />
        {error && <p className="text-red-400 text-xs mt-1.5 px-1">{error}</p>}
    </div>
);

export default DateInput;
