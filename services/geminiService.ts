
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { translations, GEMINI_MODEL_NAME } from '../constants';
import { MatrixData, PersonalGuideResponse, CompatibilityGuideResponse, LanguageKey, PersonWithMatrix, CompatibilityMatrix } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! }); // API_KEY must be set in environment

const parseJsonResponse = <T,>(responseText: string): T => {
    let jsonStr = responseText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        // Handle potential trailing commas that might invalidate JSON
        jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1'); 
        return JSON.parse(jsonStr) as T;
    } catch (error) {
        console.error("Failed to parse JSON response:", error, "Raw text:", responseText);
        throw new Error("AI response is not valid JSON.");
    }
};

export const generatePersonalGuide = async (
    matrixData: MatrixData,
    userName: string,
    lang: LanguageKey
): Promise<PersonalGuideResponse> => {
    const t = translations[lang];
    const getEnergyName = (num: number | undefined) => num !== undefined ? `${num} - ${t.interpretations[num] || ''}` : 'N/A';
    const getLifePathName = (num: number | undefined) => num !== undefined ? `${num} - ${t.lifePathInterpretations[num] || ''}` : 'N/A';

    const prompt = `Bạn là một AI chuyên gia thần số học Ma Trận Vận Mệnh siêu dễ thương, thông thái, và cực kỳ nhiệt tình! Nhiệm vụ của bạn là tạo ra một cẩm nang chi tiết, sâu sắc và truyền cảm hứng cho người dùng tên ${userName}. Hãy kết hợp phân tích Số Chủ Đạo và các năng lượng trong Ma Trận Vận Mệnh.
Ngôn ngữ: Tiếng Việt.
Giọng điệu: Vô cùng thân thiện, đáng yêu, dí dỏm, sử dụng nhiều emoji ✨💖🌟. Hãy làm cho người đọc cảm thấy được thấu hiểu và khích lệ!
Định dạng output: Một đối tượng JSON hợp lệ duy nhất.
Dữ liệu người dùng:
- Số Chủ Đạo: ${getLifePathName(matrixData.lifePathNumber)}
- Năng lượng A (Bản chất): ${getEnergyName(matrixData.a)}
- Năng lượng B (Giao tiếp): ${getEnergyName(matrixData.b)}
- Năng lượng C (Nghiệp quá khứ/Bài học): ${getEnergyName(matrixData.c)}
- Năng lượng D (Tài năng đặc biệt): ${getEnergyName(matrixData.d)}
- Năng lượng E (Trung tâm/Vùng thoải mái): ${getEnergyName(matrixData.center)}

**Yêu cầu quan trọng:**
1.  **Phân tích sâu sắc:** Với mỗi chủ đề, hãy đi sâu vào ý nghĩa của các con số, kết nối chúng với nhau một cách logic. Đưa ra những nhận định sắc sảo, độc đáo và những lời khuyên thực tế, hữu ích. Tránh nói chung chung.
2.  **Cấu trúc rõ ràng:** Sử dụng Markdown để trình bày thông tin khoa học, dễ đọc:
    *   Dùng \`### Tiêu đề phụ\` cho các ý nhỏ trong mỗi mục.
    *   Dùng \`**từ khóa quan trọng**\` để nhấn mạnh.
    *   Dùng \`*ý nghiêng*\` cho các lưu ý nhỏ hoặc trích dẫn.
    *   Sử dụng danh sách (bullet points \`* \` hoặc gạch đầu dòng \`- \`) cho các gợi ý, điểm mạnh/yếu.
3.  **Nhấn mạnh con số:** Sử dụng tag \`<highlight>Số X - Tên Năng Lượng</highlight>\` để làm nổi bật các con số và tên gọi của chúng khi phân tích.
4.  **Lời lẽ truyền cảm hứng:** Kết thúc mỗi phần phân tích bằng một lời động viên, một câu hỏi gợi mở đáng yêu, hoặc một thông điệp tích cực.

Schema JSON (không thay đổi): { "personality": "...", "destiny": "...", "talents": "...", "career": "...", "relationships": "...", "health": "..." }
Ví dụ một đoạn text trong JSON (cho mục personality chẳng hạn):
"Chào ${userName} đáng yêu! ✨ Bạn sở hữu một tổng thể tính cách thật thú vị đó nha! Với <highlight>${getLifePathName(matrixData.lifePathNumber)}</highlight> làm chủ đạo, bạn là người... bla bla.
### Điểm nổi bật nè:
* **Sáng tạo vô biên:** Với năng lượng <highlight>${getEnergyName(matrixData.a)}</highlight>, bạn...
* **Giao tiếp khéo léo:** Năng lượng <highlight>${getEnergyName(matrixData.b)}</highlight> mang đến cho bạn...
### Cần lưu ý chút xíu:
* Đôi khi bạn hơi... do ảnh hưởng của...
Bạn thấy mình giống không nè? 😉"`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: [{ parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
        });
        
        const text = response.text;
        if (!text) {
            throw new Error("AI response was empty.");
        }
        return parseJsonResponse<PersonalGuideResponse>(text);

    } catch (error) {
        console.error("AI Generation Error (Personal Guide):", error);
        if (error instanceof Error) {
           throw new Error(`AI Generation Error: ${error.message}`);
        }
        throw new Error("An unknown AI generation error occurred.");
    }
};

export const generateCompatibilityGuide = async (
    p1: PersonWithMatrix,
    p2: PersonWithMatrix,
    compatMatrix: CompatibilityMatrix,
    lang: LanguageKey
): Promise<CompatibilityGuideResponse> => {
    const t = translations[lang];
    const getEnergyName = (num: number | undefined) => num !== undefined ? `${num} - ${t.interpretations[num] || ''}` : 'N/A';
    const getLifePathName = (num: number | undefined) => num !== undefined ? `${num} - ${t.lifePathInterpretations[num] || ''}` : 'N/A';
    
    const prompt = `Bạn là một AI chuyên gia thần số học tình yêu siêu cấp dễ thương, duyên dáng và cực kỳ sâu sắc! Nhiệm vụ của bạn là soi chiếu và tạo ra một cẩm nang tương hợp chi tiết, đa chiều, giúp cặp đôi ${p1.name} và ${p2.name} thấu hiểu và gắn kết hơn.
Ngôn ngữ: Tiếng Việt.
Giọng điệu: Vô cùng thân thiện, đáng yêu, tình cảm, sử dụng nhiều emoji ❤️💑🎉. Hãy làm cho họ cảm thấy được chúc phúc và có thêm niềm tin vào mối quan hệ!
Định dạng output: Một đối tượng JSON hợp lệ duy nhất.
Dữ liệu cặp đôi:
- ${p1.name}: Số Chủ Đạo ${getLifePathName(p1.matrix.lifePathNumber)}, Trung tâm ${getEnergyName(p1.matrix.center)}, Tài năng (D) ${getEnergyName(p1.matrix.d)}, Nghiệp (C) ${getEnergyName(p1.matrix.c)}.
- ${p2.name}: Số Chủ Đạo ${getLifePathName(p2.matrix.lifePathNumber)}, Trung tâm ${getEnergyName(p2.matrix.center)}, Tài năng (D) ${getEnergyName(p2.matrix.d)}, Nghiệp (C) ${getEnergyName(p2.matrix.c)}.
Dữ liệu tương hợp:
- Trung tâm chung: ${getEnergyName(compatMatrix.center)}
- Mục đích chung: ${getEnergyName(compatMatrix.purpose)}
- Hòa hợp/Thử thách chung: ${getEnergyName(compatMatrix.harmony)}

**Yêu cầu quan trọng:**
1.  **Phân tích sâu sắc và cân bằng:** Với mỗi chủ đề, hãy đi sâu vào ý nghĩa của các con số chung và riêng, kết nối chúng một cách tinh tế. Chỉ ra những điểm hòa hợp tuyệt vời và cả những thử thách cần cùng nhau vượt qua. Đưa ra những nhận định sắc sảo, lời khuyên xây dựng.
2.  **Cấu trúc rõ ràng:** Sử dụng Markdown để trình bày thông tin khoa học, dễ đọc:
    *   Dùng \`### Tiêu đề phụ\` cho các khía cạnh phân tích.
    *   Dùng \`**điểm nhấn quan trọng**\` để nhấn mạnh.
    *   Dùng \`*lời khuyên nhỏ*\` cho các gợi ý.
    *   Sử dụng danh sách (bullet points \`* \` hoặc gạch đầu dòng \`- \`) cho các điểm mạnh, điểm cần cải thiện, hoặc gợi ý hoạt động chung.
3.  **Nhấn mạnh con số:** Sử dụng tag \`<highlight>Số X - Tên Năng Lượng</highlight>\` để làm nổi bật các con số và tên gọi của chúng.
4.  **Lời lẽ gắn kết:** Kết thúc mỗi phần bằng những lời chúc tốt đẹp, lời khích lệ sự vun đắp tình cảm.

Schema JSON (không thay đổi): { "overview": "...", "harmony": "...", "purpose": "..." }
Ví dụ một đoạn text trong JSON (cho mục overview chẳng hạn):
"Chúc mừng cặp đôi ${p1.name} và ${p2.name} đã tìm thấy nhau! 🎉 Hai bạn có một bức tranh tổng quan mối quan hệ thật đặc biệt đó! Với <highlight>${getEnergyName(compatMatrix.center)}</highlight> là trung tâm chung, hai bạn...
### Điều tuyệt vời ở hai bạn:
* **Sự đồng điệu:** Cả hai bạn cùng có...
* **Bù trừ hoàn hảo:** ${p1.name} với <highlight>${getEnergyName(p1.matrix.d)}</highlight> và ${p2.name} với <highlight>${getEnergyName(p2.matrix.d)}</highlight> tạo nên...
### Cùng nhau vun đắp nhé:
* Đôi khi hai bạn cần chú ý đến...
Chúc hai bạn luôn hạnh phúc và nắm tay nhau thật chặt trên mọi hành trình nha! ❤️"`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: [{ parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        if (!text) {
            throw new Error("AI response was empty.");
        }
        return parseJsonResponse<CompatibilityGuideResponse>(text);
        
    } catch (error) {
        console.error("AI Generation Error (Compatibility Guide):", error);
         if (error instanceof Error) {
           throw new Error(`AI Generation Error: ${error.message}`);
        }
        throw new Error("An unknown AI generation error occurred.");
    }
};
