
import { MatrixData, CompatibilityMatrix } from '../types';

export const sumDigits = (numStr: string): number => {
    return String(numStr).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
};

export const reduceToSingleDigitOrMaster = (num: number): number => {
    if (num === 11 || num === 22) return num;
    let sum = sumDigits(String(num));
    while (sum > 9 && sum !== 11 && sum !== 22) { 
        sum = sumDigits(String(sum)); 
    }
    return sum;
};

export const reduceTo22 = (num: number): number => {
    let currentNum = num;
    while (currentNum > 22) { 
        currentNum = sumDigits(String(currentNum)); 
    }
    return currentNum;
};

export const calculateMatrix = (date: Date | null): MatrixData | null => {
    if (!date) return null;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const a = reduceTo22(day);
    const b = reduceTo22(month);
    const c = reduceTo22(year);
    const d = reduceTo22(a + b + c);
    const e = reduceTo22(a + b + c + d); 
    
    const f = reduceTo22(a + b);
    const g = reduceTo22(b + c);
    const h = reduceTo22(c + d);
    const i = reduceTo22(d + a);

    const lifePathNumber = reduceToSingleDigitOrMaster(sumDigits(String(day)) + sumDigits(String(month)) + sumDigits(String(year)));
    
    return { a, b, c, d, e, f, g, h, i, center: e, lifePathNumber };
};

export const calculateCompatibility = (m1: MatrixData, m2: MatrixData): CompatibilityMatrix => ({
    center: reduceTo22(m1.center + m2.center),
    purpose: reduceTo22(m1.c + m2.c), // Using 'c' as per original code for purpose
    harmony: reduceTo22(m1.d + m2.d)  // Using 'd' as per original code for harmony
});
