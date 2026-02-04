
import { GoogleGenAI, Type } from "@google/genai";
import { SermonOutput } from "./types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateSermonContent = async (text: string): Promise<SermonOutput> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `당신은 기독교 말씀 콘텐츠 디자이너입니다. 제공된 [입력 말씀 텍스트]를 분석하여 요약 카드와 인포그래픽 내용을 작성하세요.

[제목 정제 및 추출 규칙 - 최우선 순위]
1. **순수 주제 추출:** 결과의 'subject'와 'title' 필드에는 번호, 날짜, 성구가 포함된 복잡한 행 대신 **말씀의 핵심 주제(주제 문장)**만 정제하여 입력하십시오.
2. **제거 대상:** 
   - 번호 형식 (예: '- 1 -', '1.', '첫째')
   - 날짜 및 예배 명칭 (예: '2025년 3월 9일', '주일말씀')
   - 괄호 안의 성구 (예: '<잠언 4장 23절>', '(마태복음 1:1)')
3. **최종 제목 예시:** 
   - 입력: "- 1 - <2025년 3월 9일 주일말씀> 생각해야 그것에 대해 눈이 떠진다 <잠언 4장 23절>"
   - 출력: "생각해야 그것에 대해 눈이 떠진다"
4. **내용 출처:** 오직 제공된 텍스트 내에서만 내용을 추출하고 외부 지식을 섞지 마십시오.

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
              date: { type: Type.STRING, description: "예: 2025년 3월 9일" },
              subject: { type: Type.STRING, description: "정제된 순수 말씀 주제" },
              coreMessage: { type: Type.ARRAY, items: { type: Type.STRING }, description: "핵심 요약 3문장" },
              scripture: { type: Type.STRING, description: "참조 성구 구절 전체" },
              actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["date", "subject", "coreMessage", "scripture", "actionPoints", "hashtags"]
          },
          infographic: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "정제된 순수 말씀 주제" },
              subtitle: { type: Type.STRING, description: "감동적인 요약 문구" },
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
