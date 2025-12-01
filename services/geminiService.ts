import { GoogleGenAI, Type } from "@google/genai";
import { DateOfBirth, NumerologyResponse } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeNumerology = async (dob: DateOfBirth): Promise<NumerologyResponse> => {
  const fullDate = `${dob.day}/${dob.month}/${dob.year}`;

  const prompt = `
    Tôi có ngày sinh là: ${fullDate}.
    Hãy đóng vai một chuyên gia Thần Số Học (Numerology) uyên bác, giọng văn sâu sắc, huyền bí nhưng hiện đại và dễ hiểu (phong cách "chữa lành" và định hướng).

    Hãy tính "Con số chủ đạo" (Life Path Number) và bình giải chi tiết về cuộc đời tôi dựa trên con số đó.

    Trả về kết quả dưới dạng JSON theo cấu trúc sau (không dùng markdown block):
    {
      "lifePathNumber": "Con số chủ đạo (Ví dụ: 10, 11, 22/4...)",
      "rulingNumberMeaning": "Ý nghĩa cốt lõi, ngắn gọn và ấn tượng của con số này (1 câu slogan).",
      "strengths": "Điểm mạnh nổi bật và năng lượng tích cực.",
      "weaknesses": "Điểm yếu, bài học cần khắc phục.",
      "career": "Định hướng nghề nghiệp phù hợp và tài chính.",
      "love": "Xu hướng tình cảm, các mối quan hệ.",
      "currentYearPrediction": "Dự báo tổng quan năng lượng cho năm hiện tại đối với người mang số này.",
      "advice": "Lời khuyên cốt lõi để phát triển bản thân."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lifePathNumber: { type: Type.STRING },
            rulingNumberMeaning: { type: Type.STRING },
            strengths: { type: Type.STRING },
            weaknesses: { type: Type.STRING },
            career: { type: Type.STRING },
            love: { type: Type.STRING },
            currentYearPrediction: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ["lifePathNumber", "rulingNumberMeaning", "strengths", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing numerology:", error);
    // Fallback
    return {
      lifePathNumber: "?",
      rulingNumberMeaning: "Ẩn số của vũ trụ",
      strengths: "Kết nối chưa ổn định, vui lòng thử lại.",
      weaknesses: "Không thể phân tích.",
      career: "Vui lòng kiểm tra lại kết nối mạng.",
      love: "Vạn sự tùy duyên.",
      currentYearPrediction: "Chờ đợi tín hiệu.",
      advice: "Hãy giữ tâm an lạc và thử lại sau."
    };
  }
};