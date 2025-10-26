
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';

// Interface for type safety
export interface ContentIdea {
  title: string;
  description: string;
  platform: 'Instagram' | 'TikTok' | 'Facebook';
  hashtags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  
  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set");
      // Fallback to a dummy implementation or handle error appropriately
      this.ai = null!; // or some dummy implementation
    } else {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async generateContentIdeas(topic: string): Promise<ContentIdea[]> {
      if (!this.ai) {
        return Promise.reject(new Error('Gemini AI client is not initialized. Check API Key.'));
      }
      
      const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'A catchy, short title for the social media post.'
            },
            description: {
              type: Type.STRING,
              description: 'A detailed description for the post, engaging and informative. Should be around 2-3 sentences.'
            },
            platform: {
              type: Type.STRING,
              enum: ['Instagram', 'TikTok', 'Facebook'],
              description: 'The social media platform this content is best suited for.'
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'An array of 5-7 relevant hashtags, including the # sign.'
            }
          },
          required: ['title', 'description', 'platform', 'hashtags']
        }
      };

      const prompt = `Generate 5 creative social media content ideas for a high-end, modern hair salon called "PAPI Hair Design". The main topic is "${topic}". The ideas should be engaging for an audience interested in premium hair care, styling, and trends. Provide a mix of ideas suitable for Instagram, TikTok, and Facebook.`;

      try {
        const response: GenerateContentResponse = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.7,
          }
        });

        const jsonText = response.text.trim();
        const ideas: ContentIdea[] = JSON.parse(jsonText);
        return ideas;

      } catch (error) {
        console.error('Error generating content with Gemini:', error);
        throw new Error('Failed to generate content ideas. Please check the API key and try again.');
      }
  }
}