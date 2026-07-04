import { NextResponse } from "next/server";
import { generateBlogPrompt } from "@/prompts/blog.prompt";
import { aiService } from "@/services/server/ai-service";

export async function generatePostController(req: Request) {
  const { title } = await req.json();

  const prompt = generateBlogPrompt(title);

  const content = await aiService.generatePost(prompt);

  return NextResponse.json({ content });
}
