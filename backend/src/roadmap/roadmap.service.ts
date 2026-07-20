import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

@Injectable()
export class RoadmapService {
  private ai: GoogleGenerativeAI;

  constructor() {
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async generateCoreRoadmap(topic: string) {
    const model = this.ai.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json',
        // Ép AI trả về đúng schema này
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            label: { type: SchemaType.STRING },
            children: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  label: { type: SchemaType.STRING },
                  hasMore: { type: SchemaType.BOOLEAN } // Cờ báo hiệu có nhánh con để hiển thị nút "..."
                },
                required: ['id', 'label', 'hasMore'],
              }
            }
          },
          required: ['id', 'label', 'children'],
        },
      },
    });

    const prompt = `Bạn là chuyên gia. Tạo sơ đồ tư duy cho chủ đề: "${topic}". Chỉ tạo node gốc và tối đa 4 nhánh cấp 1. Đặt hasMore = true cho các nhánh cấp 1.`;
    
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  async expandNode(parentTopic: string, nodeLabel: string) {
    const model = this.ai.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              label: { type: SchemaType.STRING },
              hasMore: { type: SchemaType.BOOLEAN }
            },
            required: ['id', 'label', 'hasMore'],
          }
        },
      },
    });

    const prompt = `Bạn là chuyên gia. Cho nhánh "${nodeLabel}" nằm trong ngữ cảnh chủ đề "${parentTopic}". Hãy sinh ra từ 3-5 khái niệm chi tiết/ứng dụng thực tế nhất cho nhánh này. Đặt hasMore = true nếu có thể chia nhỏ tiếp.`;
    
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  async explainNode(contextPath: string) {
    const model = this.ai.getGenerativeModel({
      model: 'gemini-flash-latest',
    });

    const prompt = `Bạn là chuyên gia. Hãy giải thích khái niệm cuối cùng trong lộ trình học sau: "${contextPath}". Giải thích ngắn gọn, đi thẳng vào trọng tâm, kèm theo ví dụ (nếu có thể). Trả về bằng định dạng Markdown chuẩn.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
