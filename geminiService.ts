
import { GoogleGenAI, Type } from "@google/genai";
import { SermonOutput } from "./types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateSermonContent = async (text: string): Promise<SermonOutput> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `당신은 기독교 말씀 콘텐츠 디자이너입니다. 다음 [입력 말씀 텍스트]를 분석하여 요약 카드와 인포그래픽 내용을 작성하세요.

[강제 준수 규칙 - 위반 시 무효]
1. **제목 복사 규칙:** 결과의 'subject'와 'title' 필드에는 반드시 [입력 말씀 텍스트]의 **가장 첫 번째 줄(또는 첫 번째 문장)**을 글자 하나 틀리지 않고 그대로 입력하십시오. 임의로 요약하거나 단어를 바꾸는 행위를 엄격히 금지합니다.
2. **출처 제한:** 외부 지식을 배제하고 오직 제공된 본문 텍스트 내에서만 내용을 추출하십시오.
3. 요약 문구와 성구는 본문의 어조와 단어를 충실히 따르십시오.

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
              date: { type: Type.STRING },
              subject: { type: Type.STRING, description: "원본 텍스트의 첫 문장을 그대로 복사" },
              coreMessage: { type: Type.ARRAY, items: { type: Type.STRING } },
              scripture: { type: Type.STRING },
              actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["date", "subject", "coreMessage", "scripture", "actionPoints", "hashtags"]
          },
          infographic: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "원본 텍스트의 첫 문장을 그대로 복사" },
              subtitle: { type: Type.STRING },
              scripture: { type: Type.STRING }
            },
            required: ["title", "subtitle", "scripture"]
          }
        },
        required: ["summaryCard", "infographic"]
      }
    }
  });

  if (!response.text) throw new Error("AI 응답이 비어있습니다.");
  return JSON.parse(response.text);
};
