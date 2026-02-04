
import { GoogleGenAI, Type } from "@google/genai";
import { SermonOutput } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateSermonContent = async (text: string): Promise<SermonOutput> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `당신은 기독교 말씀 콘텐츠 디자이너입니다. 다음 주일말씀 본문을 분석하여 전도용 요약 카드와 인포그래픽 문구를 작성하세요.

[핵심 준수 규칙 - 위반 시 출력 오류 발생]
1. **오직 제공된 말씀 텍스트 내에서만 내용을 추출하십시오.** 당신이 알고 있는 성경 지식이나 외부 정보를 절대 섞지 마십시오.
2. **제목(Subject/Title)은 반드시 업로드된 텍스트의 첫 번째 줄(제목) 또는 가장 핵심이 되는 첫 문장을 토씨 하나 틀리지 않고 그대로 사용하십시오.** 임의의 요약이나 변형은 절대 금지합니다.
3. 모든 요약 문구와 실천 사항은 제공된 본문의 맥락을 그대로 유지해야 합니다.
4. 성구(Scripture) 또한 본문에 인용된 것을 우선적으로 사용하십시오.

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
              date: { type: Type.STRING, description: "말씀 날짜" },
              subject: { type: Type.STRING, description: "말씀의 첫 문장 또는 원본 제목 (그대로 사용)" },
              coreMessage: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "본문 기반 핵심 메시지 3~4줄" 
              },
              scripture: { type: Type.STRING, description: "본문의 핵심 성구" },
              actionPoints: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "본문 기반 실천 포인트" 
              },
              hashtags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "해시태그" 
              }
            },
            required: ["date", "subject", "coreMessage", "scripture", "actionPoints", "hashtags"]
          },
          infographic: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "말씀의 첫 문장 또는 원본 제목 (그대로 사용)" },
              subtitle: { type: Type.STRING, description: "본문의 핵심 묵상 문구" },
              scripture: { type: Type.STRING, description: "인용 성구" }
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
