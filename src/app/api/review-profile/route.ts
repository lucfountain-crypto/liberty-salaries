import { NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateOverallScore,
  modelReviewSchema,
  profileReviewSchema,
} from "@/lib/profile-review";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const requestSchema = z.object({
  targetRole: z.string().trim().min(2).max(150),
  location: z.string().trim().min(2).max(150),
  careerText: z.string().trim().max(15000),
  consent: z.literal(true),
});

const REVIEW_INSTRUCTIONS = `
You are a seasoned UK Executive Search and Recruitment Director at Liberty Towers reviewing a candidate's LinkedIn profile header screenshot and career details. Write in direct, constructive, highly professional British English.

Strict Review Guidelines:
1. Photo (Visual Audit):
   - Evaluate crop, framing, lighting, contrast, backdrop neutrality, professional dress, and facial openness.
   - Note if the headshot looks professional, casual selfie, AI-generated/retouched, or missing/blank.
   - Never judge physical appearance or infer age, race, religion, gender, or health. Focus strictly on professional image presentation.
2. Banner:
   - Is it default blank LinkedIn blue/grey? Is it branded, relevant to their sector, or visual clutter?
   - Suggest a crisp brand banner concept tailored to their role.
3. Headline (Positioning & Keywords):
   - Flag passive "kill words" like "Aspiring", "Seeking opportunities", "Passionate about", or generic lists like "Problem solver".
   - Provide 3 distinct, high-converting headline rewrites:
     * Option 1: Direct Corporate / Authority ("Title @ Firm | Specialty | Credential")
     * Option 2: Value & Impact Driven ("Helping [Sector] Achieve [Result] | Tech Stack / Domain")
     * Option 3: Executive Search / Modern Specialist
   - The primary suggested rewrite should go in 'headline.rewrite', and the other 2 in 'headline.alternativeRewrites'.
4. Career Evidence & Progression:
   - Evaluate visible job titles, company prestige, tenure, and evidence of shipped projects / tangible achievements.
   - Highlight whether their progression looks steady, confused, or lacks metrics.
5. Target Role Fit:
   - Benchmark their profile directly against their target role and location.
   - Evaluate whether a London / UK recruiter would shortlist them or pass within 5 seconds.
6. Highest-Impact Next Moves:
   - Provide 3 to 5 prioritized, immediately actionable bullet points they can change today to double profile conversions.

Always return strictly valid JSON matching the schema.
`.trim();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const screenshot = formData.get("screenshot");

    const parsed = requestSchema.safeParse({
      targetRole: formData.get("targetRole"),
      location: formData.get("location"),
      careerText: formData.get("careerText") || "",
      consent: formData.get("consent") === "true",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter your target role, location, and confirm consent." },
        { status: 400 }
      );
    }

    if (!(screenshot instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a screenshot of your LinkedIn profile header." },
        { status: 400 }
      );
    }

    if (!ACCEPTED_TYPES.has(screenshot.type) || screenshot.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Please provide a valid JPG, PNG, or WebP screenshot up to 8MB." },
        { status: 415 }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI Review Engine is temporarily unconfigured." },
        { status: 503 }
      );
    }

    const arrayBuffer = await screenshot.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const inputContext = {
      targetRole: parsed.data.targetRole,
      targetLocation: parsed.data.location,
      careerText: parsed.data.careerText || "None provided by candidate (reviewing screenshot exclusively).",
    };

    const promptText = `${REVIEW_INSTRUCTIONS}\n\nCandidate Submission Context:\n${JSON.stringify(inputContext, null, 2)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: screenshot.type,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: "application/json",
      },
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API Error:", geminiRes.status, errText);
      return NextResponse.json(
        { error: "AI Review Engine was unable to process the image. Please try again." },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const candidatePart = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidatePart) {
      return NextResponse.json(
        { error: "Empty review output from model." },
        { status: 502 }
      );
    }

    const rawJson = JSON.parse(candidatePart);
    const parsedModelReview = modelReviewSchema.parse(rawJson);
    const overallScore = calculateOverallScore(parsedModelReview);

    const review = profileReviewSchema.parse({
      ...parsedModelReview,
      overallScore,
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Profile Review Exception:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze profile" },
      { status: 500 }
    );
  }
}
