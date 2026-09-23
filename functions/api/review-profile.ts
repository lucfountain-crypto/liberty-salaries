// Cloudflare Pages Function for POST /api/review-profile

interface Env {
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
}

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

interface Reviewer {
  id: string;
  name: string;
  role: string;
  lens: string;
  description: string;
  gradient: string;
  bgLight: string;
  initials: string;
  genderStyle?: "female" | "male" | "neutral";
}

const PANEL_REVIEWERS: Reviewer[] = [
  {
    id: "hannah",
    name: "Hannah",
    role: "Senior In-House Talent Lead",
    lens: "Recruiter 5-Second Scan & ATS Readability",
    description: "Focuses on how corporate in-house recruiters parse titles, career progression, and ATS keyword visibility.",
    gradient: "from-rose-500 to-pink-600",
    bgLight: "bg-pink-50 text-pink-700 border-pink-200",
    initials: "HN",
    genderStyle: "female",
  },
  {
    id: "emily",
    name: "Emily",
    role: "Executive Search Consultant",
    lens: "Board-Level Polish & Leadership Gravitas",
    description: "Focuses on strategic commercial value, executive tone, and eliminating passive phrases.",
    gradient: "from-violet-500 to-purple-700",
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
    initials: "EM",
    genderStyle: "female",
  },
  {
    id: "mark",
    name: "Mark",
    role: "Commercial Practice Director",
    lens: "Quantifiable ROI & Revenue Impact",
    description: "Focuses on hard metrics, portfolio and deal sizes, commercial evidence, and bottom-line contributions.",
    gradient: "from-blue-600 to-indigo-700",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    initials: "MK",
    genderStyle: "male",
  },
  {
    id: "luke",
    name: "Luke",
    role: "Headhunting Specialist",
    lens: "Competitor Poaching Appeal & Punchy Headlines",
    description: "Focuses on market differentiation, high-converting hooks, and making the profile stand out to headhunters.",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 text-amber-700 border-amber-200",
    initials: "LK",
    genderStyle: "male",
  },
  {
    id: "jon",
    name: "Jon",
    role: "Technical Recruitment Lead",
    lens: "Hard Skill Credibility & Tech Deliverables",
    description: "Focuses on concrete project outcomes, technical stack depth, architecture credentials, and domain mastery.",
    gradient: "from-teal-500 to-emerald-700",
    bgLight: "bg-teal-50 text-teal-700 border-teal-200",
    initials: "JN",
    genderStyle: "male",
  },
  {
    id: "nita",
    name: "Nita",
    role: "People & Talent Director",
    lens: "Career Trajectory & Cultural Leadership",
    description: "Focuses on team enablement, career longevity, cultural alignment, and cross-functional leadership proof.",
    gradient: "from-fuchsia-500 to-pink-600",
    bgLight: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    initials: "NT",
    genderStyle: "female",
  },
  {
    id: "abdul",
    name: "Abdul",
    role: "Enterprise Hiring Consultant",
    lens: "Enterprise Complexity & Scale of Influence",
    description: "Focuses on multi-stakeholder governance, budget accountability, and enterprise delivery scale.",
    gradient: "from-sky-500 to-blue-700",
    bgLight: "bg-sky-50 text-sky-700 border-sky-200",
    initials: "AB",
    genderStyle: "male",
  },
  {
    id: "patrick",
    name: "Patrick",
    role: "Senior Search Partner",
    lens: "C-Suite Gravitas & Brevity",
    description: "Focuses on crisp executive communication, decisive tone, and cutting out low-impact fluff.",
    gradient: "from-slate-700 to-slate-900",
    bgLight: "bg-slate-100 text-slate-800 border-slate-300",
    initials: "PK",
    genderStyle: "male",
  },
  {
    id: "alex",
    name: "Alex",
    role: "In-House Talent Specialist",
    lens: "First-Impression Clarity & Role Match",
    description: "Focuses on fast visual hierarchy, clear role scope, and immediate shortlist suitability.",
    gradient: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50 text-cyan-700 border-cyan-200",
    initials: "AX",
    genderStyle: "neutral",
  },
  {
    id: "simon",
    name: "Simon",
    role: "Financial & Professional Services Recruiter",
    lens: "Fiduciary Standing & Regulatory Rigor",
    description: "Focuses on governance credentials, institutional reputation, compliance awareness, and risk acumen.",
    gradient: "from-emerald-600 to-teal-800",
    bgLight: "bg-emerald-50 text-emerald-800 border-emerald-200",
    initials: "SM",
    genderStyle: "male",
  },
  {
    id: "debbie",
    name: "Debbie",
    role: "Senior Talent Acquisition Manager",
    lens: "Promotion Velocity & Cohesive Narrative",
    description: "Focuses on logical tenure progression, internal stepping stones, and explaining role transitions.",
    gradient: "from-rose-400 to-red-600",
    bgLight: "bg-rose-50 text-rose-700 border-rose-200",
    initials: "DB",
    genderStyle: "female",
  },
  {
    id: "lili",
    name: "Lili",
    role: "Modern Brand & Digital Advisor",
    lens: "Visual Presentation & Brand Alignment",
    description: "Focuses on headshot framing, banner relevance, clean typography, and modern digital presence.",
    gradient: "from-indigo-400 to-purple-600",
    bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    initials: "LL",
    genderStyle: "female",
  },
  {
    id: "marina",
    name: "Marina",
    role: "Global Talent Strategist",
    lens: "International Mobility & Cross-Border Scope",
    description: "Focuses on global market relevance, multi-territory coordination, and sector adaptability.",
    gradient: "from-blue-500 to-cyan-700",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    initials: "MR",
    genderStyle: "female",
  },
  {
    id: "terri",
    name: "Terri",
    role: "Operations & Transformation Lead",
    lens: "Operational Efficiency & Execution Proof",
    description: "Focuses on process transformation, delivery cadence, and evidence of organizational problem solving.",
    gradient: "from-emerald-500 to-green-700",
    bgLight: "bg-green-50 text-green-700 border-green-200",
    initials: "TR",
    genderStyle: "female",
  },
  {
    id: "tanya",
    name: "Tanya",
    role: "Boutique Search Consultant",
    lens: "Niche Domain Authority & Uniqueness",
    description: "Focuses on what makes the candidate truly rare in their specific market niche.",
    gradient: "from-amber-600 to-yellow-600",
    bgLight: "bg-amber-50 text-amber-800 border-amber-200",
    initials: "TY",
    genderStyle: "female",
  },
  {
    id: "rosie",
    name: "Rosie",
    role: "Creative & Growth Talent Partner",
    lens: "Storytelling Hook & Authenticity",
    description: "Focuses on personal narrative voice, engagement magnetism, and an authentic professional persona.",
    gradient: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50 text-pink-700 border-pink-200",
    initials: "RS",
    genderStyle: "female",
  },
  {
    id: "penny",
    name: "Penny",
    role: "Senior Talent Resourcer",
    lens: "Boolean Search & Keyword Density",
    description: "Focuses on how recruiters query LinkedIn Recruiter filters and whether critical search terms are present.",
    gradient: "from-indigo-500 to-blue-600",
    bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    initials: "PN",
    genderStyle: "female",
  },
  {
    id: "harry",
    name: "Harry",
    role: "Commercial Director & Search Lead",
    lens: "Commercial Accountability & Revenue Focus",
    description: "Focuses on business growth outcomes, P&L ownership, and client retention proof.",
    gradient: "from-slate-600 to-slate-800",
    bgLight: "bg-slate-100 text-slate-800 border-slate-300",
    initials: "HR",
    genderStyle: "male",
  },
  {
    id: "nick",
    name: "Nick",
    role: "Strategic Sourcing Lead",
    lens: "Outbound Candidate Appeal",
    description: "Focuses on how compelling the profile looks to a hiring manager who is cold-messaging top talent.",
    gradient: "from-blue-600 to-slate-700",
    bgLight: "bg-blue-50 text-blue-800 border-blue-200",
    initials: "NK",
    genderStyle: "male",
  },
  {
    id: "gosia",
    name: "Gosia",
    role: "European & UK Practice Lead",
    lens: "Core Competencies & Structural Clarity",
    description: "Focuses on structured readability, clear domain competencies, and market-ready positioning.",
    gradient: "from-purple-600 to-indigo-800",
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
    initials: "GS",
    genderStyle: "female",
  },
  {
    id: "luna",
    name: "Luna",
    role: "Digital & Product Talent Partner",
    lens: "Modern Deliverables & Agile Impact",
    description: "Focuses on product thinking, modern tech positioning, and demonstrable output.",
    gradient: "from-violet-600 to-fuchsia-700",
    bgLight: "bg-violet-50 text-violet-700 border-violet-200",
    initials: "LN",
    genderStyle: "female",
  },
  {
    id: "peter",
    name: "Peter",
    role: "Board & Non-Exec Advisory Lead",
    lens: "Governance Standing & Advisory Weight",
    description: "Focuses on senior stakeholder influence, strategic oversight, and corporate maturity.",
    gradient: "from-zinc-700 to-neutral-900",
    bgLight: "bg-zinc-100 text-zinc-800 border-zinc-300",
    initials: "PT",
    genderStyle: "male",
  },
  {
    id: "paul",
    name: "Paul",
    role: "Senior Industry Practice Recruiter",
    lens: "Domain Depth & Technical Rigor",
    description: "Focuses on industry-specific nuances, authentic domain vocabulary, and functional authority.",
    gradient: "from-sky-600 to-cyan-800",
    bgLight: "bg-sky-50 text-sky-800 border-sky-200",
    initials: "PL",
    genderStyle: "male",
  },
  {
    id: "betsy",
    name: "Betsy",
    role: "Talent Engagement Specialist",
    lens: "Conversational Tone & Approachability",
    description: "Focuses on making the profile approachable, engaging, and inviting high-quality inbound conversations.",
    gradient: "from-teal-600 to-emerald-600",
    bgLight: "bg-teal-50 text-teal-700 border-teal-200",
    initials: "BT",
    genderStyle: "female",
  },
  {
    id: "ronnie",
    name: "Ronnie",
    role: "Senior Headhunter",
    lens: "Direct Commercial Differentiation",
    description: "Focuses on stripping out boilerplate corporate jargon to highlight what is truly unique.",
    gradient: "from-red-600 to-rose-700",
    bgLight: "bg-red-50 text-red-700 border-red-200",
    initials: "RN",
    genderStyle: "male",
  },
  {
    id: "wendy",
    name: "Wendy",
    role: "Executive Talent Partner",
    lens: "Leadership Presence & Executive Polish",
    description: "Focuses on senior professionalism, diplomatic tone, and high-trust leadership signals.",
    gradient: "from-amber-500 to-orange-700",
    bgLight: "bg-orange-50 text-orange-800 border-orange-200",
    initials: "WD",
    genderStyle: "female",
  },
  {
    id: "graeme",
    name: "Graeme",
    role: "Strategic Workforce Consultant",
    lens: "Problem-Solving Proof & Organizational Impact",
    description: "Focuses on documented evidence of solving complex business challenges and delivering turnaround.",
    gradient: "from-slate-700 to-blue-900",
    bgLight: "bg-slate-100 text-slate-800 border-slate-300",
    initials: "GM",
    genderStyle: "male",
  },
  {
    id: "emma",
    name: "Emma",
    role: "Personal Branding & Career Lead",
    lens: "Distinctive Narrative & Brand Positioning",
    description: "Focuses on headline-to-summary synergy, personal narrative cohesion, and career brand uniqueness.",
    gradient: "from-fuchsia-600 to-pink-700",
    bgLight: "bg-pink-50 text-pink-700 border-pink-200",
    initials: "EM",
    genderStyle: "female",
  },
];

function getReviewer(id?: string | null): Reviewer {
  if (id) {
    const found = PANEL_REVIEWERS.find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
    if (found) return found;
  }
  const randomIndex = Math.floor(Math.random() * PANEL_REVIEWERS.length);
  return PANEL_REVIEWERS[randomIndex];
}

function buildReviewInstructions(reviewer: Reviewer): string {
  return `
You are ${reviewer.name}, ${reviewer.role} at Liberty Towers (an executive search & recruitment advisory in London). Write in direct, constructive, highly professional British English.

YOUR REVIEW PERSPECTIVE & LENS:
- Reviewer: ${reviewer.name} (${reviewer.role})
- Distinct Lens: "${reviewer.lens}"
- Core Philosophy: ${reviewer.description}
Reflect your distinct evaluation perspective and priorities across your executiveSummary, headline feedback, and priorityActions.

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
   - Provide 3 distinct, high-converting headline rewrites reflecting modern executive hiring:
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
   - Provide 3 to 5 prioritized, immediately actionable bullet points they can change today to double profile conversions through your specific lens as ${reviewer.name}.

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
}

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
    const reviewerId = formData.get("reviewerId") ? String(formData.get("reviewerId")) : null;

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
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI Review Engine is temporarily unconfigured." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const reviewer = getReviewer(reviewerId);

    const arrayBuffer = await screenshot.arrayBuffer();
    const base64Data = arrayBufferToBase64(arrayBuffer);

    const inputContext = {
      targetRole,
      targetLocation: location,
      careerText: careerText || "None provided (evaluating screenshot exclusively).",
    };

    const reviewInstructions = buildReviewInstructions(reviewer);
    const promptText = `${reviewInstructions}\n\nCandidate Submission Context:\n${JSON.stringify(inputContext, null, 2)}`;

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
    rawJson.reviewer = reviewer;

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
