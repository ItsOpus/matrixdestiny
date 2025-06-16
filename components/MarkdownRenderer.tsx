
import React, { useMemo } from 'react';

interface MarkdownRendererProps {
    text?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text = "" }) => {
    const html = useMemo(() => {
        if (!text) return "";
        let processedText = String(text); // Ensure it's a string

        // 1. Normalize escaped newlines (e.g., if AI sends \\n)
        processedText = processedText.replace(/\\n/g, '\n');

        // 2. Process inline elements
        processedText = processedText.replace(
            /<highlight>(.*?)<\/highlight>/g,
            '<span class="px-2 py-1 bg-purple-700/60 text-purple-200 font-semibold rounded-md inline-block shadow-sm">$1</span>'
        );
        
        // Strikethrough: ~~text~~
        processedText = processedText.replace(/~~(.*?)~~/g, '<del>$1</del>');
        
        // Bold: **text**
        processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italics: *text* (improved regex to avoid conflicts with bold or list items)
        // Matches * followed by non-* and non-space, then any char until non-space and non-*, then *
        // Does not match if part of **
        processedText = processedText.replace(/(?<!\*)\*(?!\s|\*)([^\s*](?:.*?[^\s*])?)\*(?!\*)/g, '<em>$1</em>');


        // 3. Process block-level Markdown-like elements (Headers, Lists)
        processedText = processedText.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-purple-300 mt-5 mb-2">$1</h3>');
        processedText = processedText.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-purple-300 mt-6 mb-3 pb-2 border-b border-purple-500/30">$1</h2>');
        
        processedText = processedText.replace(/^((\s*(\*|-) .+(\n|$))+)/gm, (match) => {
            const items = match.trim().split('\n').map(item => {
                const content = item.replace(/^\s*(\*|-)\s*/, '').trim();
                return `<li>${content}</li>`;
            }).join('');
            return `<ul class="list-disc list-inside ml-4 my-3 space-y-1.5 text-gray-300">${items}</ul>`;
        });

        processedText = processedText.replace(/^((\s*([0-9]+\.) .+(\n|$))+)/gm, (match) => {
            const items = match.trim().split('\n').map(item => {
                const content = item.replace(/^\s*([0-9]+\.)\s*/, '').trim();
                return `<li>${content}</li>`;
            }).join('');
            return `<ol class="list-decimal list-inside ml-4 my-3 space-y-1.5 text-gray-300">${items}</ol>`;
        });
        
        // 4. Convert all remaining newlines to <br />.
        processedText = processedText.replace(/\n/g, '<br />');
        
        // 5. Final cleanup: remove <br /> that might appear directly before list/ol tags.
        processedText = processedText.replace(/<br \/>(\s*<(ul|ol))/g, '$1');

        return processedText;
    }, [text]);

    return (
        <div 
            className="text-gray-300 leading-relaxed font-light prose-sm prose-invert max-w-none 
                       prose-headings:text-purple-300 
                       prose-strong:text-purple-200 prose-strong:font-semibold
                       prose-em:text-purple-200 prose-em:italic
                       prose-del:text-gray-400
                       prose-ul:my-3 prose-ol:my-3 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: html }} 
        />
    );
};

export default MarkdownRenderer;
