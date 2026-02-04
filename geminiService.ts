
import { GoogleGenAI, Type } from "@google/genai";
import { SermonOutput } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateSermonContent = async (text: string): Promise<SermonOutput> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `당신은 기독교 말씀 콘텐츠 디자이너입니다. 다음 주일말씀 본문을 분석하여 전도용 요약 카드와 인포그래픽 문구를 작성하세요.

[준수 규칙]
1. **절대 외부 지식을 섞지 마십시오.** 오직 제공된 [입력 말씀 텍스트]의 내용만을 기반으로 분석하십시오.
2. **제목(Subject/Title)은 반드시 본문의 첫 문장이나 명시된 제목을 그대로 사용하십시오.** 임의로 요약하거나 세련되게 바꾸지 말고, 말씀의 원본 제목이나 핵심이 되는 첫 문장을 토씨 하나 틀리지 않고 그대로 반영하십시오.
3. 정명석 선생님의 가르침 핵심을 훼손하지 않고 전달하십시오.

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
              date: { type: Type.STRING, description: "말씀 날짜 (예: 2024년 5월 19일)" },
              subject: { type: Type.STRING, description: "말씀의 원본 제목 또는 첫 문장 (그대로 유지)" },
              coreMessage: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "핵심 메시지 3~4줄" 
              },
              scripture: { type: Type.STRING, description: "본문에 언급된 관련 성구" },
              actionPoints: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "실천 포인트 1~2줄" 
              },
              hashtags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "해시태그 3~5개 (# 포함)" 
              }
            },
            required: ["date", "subject", "coreMessage", "scripture", "actionPoints", "hashtags"]
          },
          infographic: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "한 줄 캐치프레이즈 (말씀 원본 제목 활용)" },
              subtitle: { type: Type.STRING, description: "마음에 남을 묵상 구절 (본문 내용 기반 한 문단)" },
              scripture: { type: Type.STRING, description: "인용 성구 1구절" }
            },
            required: ["title", "subtitle", "scripture"]
          }
        },
        required: ["summaryCard", "infographic"]
      }
    }
  });

  return JSON.parse(response.text);
};
