
import { GoogleGenAI, Type } from "@google/genai";
import { SermonOutput } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateSermonContent = async (text: string): Promise<SermonOutput> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `당신은 기독교 말씀 콘텐츠 디자이너입니다. 다음 [입력 말씀 텍스트]를 분석하여 요약 카드와 인포그래픽 문구를 작성하세요.

[강력 준수 규칙 - 필수]
1. **오직 제공된 텍스트 내의 정보만 사용하십시오.** 당신이 가진 배경지식이나 성경적 상식을 절대 추가하지 마십시오.
2. **제목(Subject 및 Title) 설정:** [입력 말씀 텍스트]의 가장 첫 번째 줄이나 첫 문장, 즉 말씀의 원본 제목을 **토씨 하나 틀리지 않고 글자 그대로** 제목으로 사용하십시오. 임의로 요약하거나 더 멋지게 바꾸는 것은 규칙 위반입니다.
3. 모든 요약 문구와 실천 포인트는 본문의 맥락과 단어를 충실히 따르십시오.

[입력 말씀 텍스트]
===
${text}
===`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaryCard: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "본문에 언급된 날짜" },
              subject: { type: Type.STRING, description: "말씀 원본의 첫 문장/제목 (그대로 사용)" },
              coreMessage: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "본문 기반 핵심 요약 3~4줄" 
              },
              scripture: { type: Type.STRING, description: "본문의 핵심 구절" },
              actionPoints: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "본문 기반 구체적 실천 사항" 
              },
              hashtags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "관련 태그" 
              }
            },
            required: ["date", "subject", "coreMessage", "scripture", "actionPoints", "hashtags"]
          },
          infographic: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "말씀 원본의 첫 문장/제목 (그대로 사용)" },
              subtitle: { type: Type.STRING, description: "본문 기반 한 줄 묵상 문구" },
              scripture: { type: Type.STRING, description: "인용 성구" }
            },
            required: ["title", "subtitle", "scripture"]
          }
        },
        required: ["summaryCard", "infographic"]
      }
    }
  });

  if (!response.text) {
    throw new Error("AI로부터 응답을 받지 못했습니다.");
  }

  return JSON.parse(response.text);
};
