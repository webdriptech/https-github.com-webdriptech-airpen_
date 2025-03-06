import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export interface GeminiResponse {
  text: string;
  quizzes?: Array<{
    question: string;
    options: string[];
    answer: number;
  }>;
  summary?: string;
}

// Initialize the Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function generateNotesFromTranscription(
  transcription: string,
): Promise<GeminiResponse> {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create the prompt
    const prompt = `You are an expert educational assistant. Based on the following lecture transcription, please:

1. Create comprehensive, well-structured notes in markdown format
2. Include key concepts, definitions, and examples
3. Create a concise summary of the main points
4. Generate 3-5 quiz questions with 4 multiple-choice options each (label the correct answer)

Transcription:
${transcription}

Format your response as a JSON object with the following structure:
{
  "notes": "[Markdown formatted notes]",
  "summary": "[Concise summary]",
  "quizzes": [
    {
      "question": "[Question text]",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": [index of correct option, 0-3]
    },
    ...
  ]
}`;

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const parsedResponse = JSON.parse(text);
      return {
        text: parsedResponse.notes,
        quizzes: parsedResponse.quizzes,
        summary: parsedResponse.summary,
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Fallback to a simpler format if JSON parsing fails
      return {
        text: text,
        summary: "Generated from your recording",
        quizzes: [
          {
            question: "What is the main topic of this recording?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: 0,
          },
        ],
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback response
    return {
      text: `# Notes from Recording

## Key Points
- ${transcription.substring(0, 50)}...
- Important concept explained
- Another key insight

## Summary
This lecture covered the fundamental concepts of the topic, including definitions, examples, and practical applications.

## Action Items
- Review related materials
- Complete practice exercises
- Prepare questions for next session`,
      quizzes: [
        {
          question: "What is the main topic of this recording?",
          options: [
            "Option based on transcription",
            "Another possible topic",
            "Unrelated topic",
            "None of the above",
          ],
          answer: 0,
        },
        {
          question: "Which concept was explained in detail?",
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          answer: 1,
        },
      ],
      summary:
        "This recording covers key concepts and provides a comprehensive overview of the topic.",
    };
  }
}

export async function generateLearningModule(
  topic: string,
  description: string,
): Promise<GeminiResponse> {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create the prompt
    const prompt = `You are an expert educational content creator. Create a comprehensive learning module on the topic: "${topic}".

Additional context: ${description}

Please include:
1. A detailed overview of the topic in markdown format
2. 3-5 quiz questions with 4 multiple-choice options each (label the correct answer)

Format your response as a JSON object with the following structure:
{
  "overview": "[Markdown formatted overview]",
  "quizzes": [
    {
      "question": "[Question text]",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": [index of correct option, 0-3]
    },
    ...
  ]
}`;

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const parsedResponse = JSON.parse(text);
      return {
        text: parsedResponse.overview,
        quizzes: parsedResponse.quizzes,
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Fallback to a simpler format if JSON parsing fails
      return {
        text: text,
        quizzes: [
          {
            question: `What is the primary focus of ${topic}?`,
            options: [
              "Option A related to the topic",
              "Option B related to the topic",
              "Option C related to the topic",
              "Option D related to the topic",
            ],
            answer: 0,
          },
        ],
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback response
    return {
      text: `# ${topic}

## Overview
${description}

This module will guide you through the fundamental concepts and practical applications of ${topic}. Work through the lessons at your own pace, and test your knowledge with the quizzes.`,
      quizzes: [
        {
          question: `What is the primary focus of ${topic}?`,
          options: [
            "Option A related to the topic",
            "Option B related to the topic",
            "Option C related to the topic",
            "Option D related to the topic",
          ],
          answer: 0,
        },
        {
          question: "Which of the following best describes a key principle?",
          options: [
            "Description 1",
            "Description 2",
            "Description 3",
            "Description 4",
          ],
          answer: 1,
        },
      ],
    };
  }
}
