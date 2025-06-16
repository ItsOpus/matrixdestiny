
import { User, Zap, Gem, HeartHandshake, GraduationCap, Dna, Heart, Users } from 'lucide-react';
import { Translations, LanguageKey } from './types';

export const GEMINI_MODEL_NAME = 'gemini-2.0-flash';

export const translations: Record<LanguageKey, Translations> = {
    vi: {
        appName: "Ma Trận Vận Mệnh và Thần Số Học",
        welcome: "Chào mừng đến với Cẩm Nang Ma Trận Vận Mệnh",
        personalDescription: "Khám phá bản thân sâu sắc hơn với những phân tích được tạo bởi AI dành riêng cho bạn. Hãy nhập tên và ngày sinh để bắt đầu.",
        compatDescription: "Khám phá sự hòa hợp diệu kỳ giữa hai người. Hãy nhập thông tin của cặp đôi để AI phân tích nhé!",
        nameLabel: "Tên của bạn",
        dobLabel: "Ngày sinh của bạn (DD/MM/YYYY)",
        p1NameLabel: "Tên Người 1",
        p2NameLabel: "Tên Người 2",
        p1DobLabel: "Ngày sinh Người 1 (DD/MM/YYYY)",
        p2DobLabel: "Ngày sinh Người 2 (DD/MM/YYYY)",
        calculate: "Tạo Cẩm Nang Cá Nhân",
        calculateCompat: "Xem Tương Hợp",
        error: "Vui lòng nhập ngày hợp lệ.",
        loadingGuide: "AI đang soạn cẩm nang dành riêng cho bạn, chờ một chút xíu nha...",
        loadingCompat: "AI đang phân tích sự kết nối của cặp đôi, bạn chờ tí nhé...",
        apiError: "Ối! Có vẻ như AI đang gặp chút trục trặc hoặc cần nghỉ ngơi một xíu. Bạn thử lại sau nhé! Nếu vẫn không được, bạn có thể liên hệ Luis Nguyễn qua <a href='https://facebook.com/luis/ngyn' target='_blank' rel='noopener noreferrer' class='text-pink-400 hover:text-pink-300 underline font-semibold'>Facebook tại đây</a> để được hỗ trợ nha. Cảm ơn bạn!",
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