// Cloudflare Pages Function for POST /api/review-profile

interface Env {
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
}

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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

Always return strictly valid JSON matching this exact structure:
{
  "executiveSummary": "string (max 900 chars)",
  "photo": {
    "observed": true/false,
    "score": number (0-100),
    "summary": "string",
    "strengths": ["string", "string"],
    "improvements": ["string", "string"]
  },
  "banner": {
    "observed": true/false,
    "score": number (0-100),
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "headline": {
    "observed": true/false,
    "score": number (0-100),
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"],
    "rewrite": "string",
    "alternativeRewrites": ["string", "string"]
  },
  "career": {
    "observed": true/false,
    "score": number (0-100),
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "targetFit": {
    "observed": true/false,
    "score": number (0-100),
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "priorityActions": ["string", "string", "string"]
}
`.trim();

function calculateOverallScore(review: any): number {
  const weighted = [
    { section: review.photo, weight: 20 },
    { section: review.banner, weight: 10 },
    { section: review.headline, weight: 25 },
    { section: review.career, weight: 25 },
    { section: review.targetFit, weight: 20 },
  ].filter((item) => item.section && item.section.observed);

  if (weighted.length === 0) return 0;
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  const totalScore = weighted.reduce((sum, item) => sum + item.section.score * item.weight, 0);
  return Math.round(totalScore / totalWeight);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const screenshot = formData.get("screenshot");
    const targetRole = String(formData.get("targetRole") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const careerText = String(formData.get("careerText") || "").trim();
    const consent = formData.get("consent") === "true";

    if (!targetRole || !location || !consent) {
      return new Response(
        JSON.stringify({ error: "Please enter your target role, location, and confirm consent." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!(screenshot instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Please upload a screenshot of your LinkedIn profile header." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!ACCEPTED_TYPES.has(screenshot.type) || screenshot.size > MAX_FILE_BYTES) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid JPG, PNG, or WebP screenshot up to 8MB." }),
        { status: 415, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || "";

    const arrayBuffer = await screenshot.arrayBuffer();
    const base64Data = arrayBufferToBase64(arrayBuffer);

    const inputContext = {
      targetRole,
      targetLocation: location,
      careerText: careerText || "None provided (evaluating screenshot exclusively).",
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
      return new Response(
        JSON.stringify({ error: "AI Review Engine was unable to process the image. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const geminiData: any = await geminiRes.json();
    const candidatePart = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidatePart) {
      return new Response(
        JSON.stringify({ error: "Empty review output from model." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const rawJson = JSON.parse(candidatePart);
    const overallScore = calculateOverallScore(rawJson);
    rawJson.overallScore = overallScore;

    return new Response(JSON.stringify({ review: rawJson }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Pages Function Exception:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
