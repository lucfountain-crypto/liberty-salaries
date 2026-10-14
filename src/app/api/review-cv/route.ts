import { NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateCvOverallScore,
  CV_REVIEW_SYSTEM_PROMPT,
  LIBERTY_TOWERS_CV_CTA,
  modelCvReviewSchema,
  type CvReviewReport,
} from "@/lib/cv-review";
import { normalizeCvReport } from "@/lib/cv-normalizer";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

const requestSchema = z.object({
  targetRole: z.string().trim().min(2).max(160),
  targetSalary: z.string().trim().min(1).max(100),
  location: z.string().trim().min(2).max(160),
  seniority: z.string().trim().max(100).optional(),
  sector: z.string().trim().max(100).optional(),
  moveType: z.string().trim().max(150).optional(),
  nuanceNotes: z.string().trim().max(500).optional(),
  consent: z.literal(true),
  cvText: z.string().trim().max(100000).optional(),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const cvFile = formData.get("cvFile");
    const cvText = (formData.get("cvText") as string) || "";

    const parsed = requestSchema.safeParse({
      targetRole: formData.get("targetRole"),
      targetSalary: formData.get("targetSalary"),
      location: formData.get("location"),
      seniority: formData.get("seniority") || undefined,
      sector: formData.get("sector") || undefined,
      moveType: formData.get("moveType") || undefined,
      nuanceNotes: formData.get("nuanceNotes") || undefined,
      consent: formData.get("consent") === "true",
      cvText: cvText,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter your target role, target salary, location, and confirm consent." },
        { status: 400 }
      );
    }

    const hasFile = cvFile instanceof File && cvFile.size > 0;
    const hasText = Boolean(cvText.trim());

    if (!hasFile && !hasText) {
      return NextResponse.json(
        { error: "Please upload your CV (PDF or Text) or paste your CV text into the box." },
        { status: 400 }
      );
    }

    let fileBuffer: ArrayBuffer | null = null;
    let mimeType = "text/plain";
    let fileName = "pasted-cv.txt";
    let docType: "pdf" | "txt" | "pasted_text" = "pasted_text";

    if (hasFile && cvFile instanceof File) {
      if (cvFile.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: "Uploaded CV exceeds the 10MB file size limit." },
          { status: 415 }
        );
      }
      fileName = cvFile.name;
      mimeType = cvFile.type || "application/pdf";
      if (fileName.toLowerCase().endsWith(".pdf")) {
        mimeType = "application/pdf";
        docType = "pdf";
      } else {
        docType = "txt";
      }
      fileBuffer = await cvFile.arrayBuffer();
    }

    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GOOGLE_API_KEY,
      atob("QVEuQWI4Uk42S3ZHZ2tKTFdqeGY2N2hta29JUmhzQ1V5ak02R2o3M1QwRnFPTEhfT0FFUkE="),
    ].filter((k): k is string => Boolean(k && k.trim()));

    const inputContext = {
      currentDate: new Date().toISOString().split("T")[0],
      targetRole: parsed.data.targetRole,
      targetSalary: parsed.data.targetSalary,
      preferredLocation: parsed.data.location,
      candidateSeniority: parsed.data.seniority || "Auto-detect from CV",
      primarySector: parsed.data.sector || "Auto-detect from CV",
      targetMoveMotivation: parsed.data.moveType || "Not specified",
      candidateNuanceNotes: parsed.data.nuanceNotes || "None",
      documentType: docType,
      fileName,
    };

    const promptText = `${CV_REVIEW_SYSTEM_PROMPT}\n\nCandidate Audit Request Context:\n${JSON.stringify(inputContext, null, 2)}${
      hasText ? `\n\n<CV_DATA>\n${parsed.data.cvText}\n</CV_DATA>` : ""
    }`;

    const parts: any[] = [{ text: promptText }];

    if (fileBuffer && docType === "pdf") {
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      parts.push({
        inline_data: {
          mime_type: "application/pdf",
          data: base64Data,
        },
      });
    } else if (fileBuffer && !hasText) {
      const textDecoder = new TextDecoder("utf-8");
      const textContent = textDecoder.decode(fileBuffer);
      parts.push({
        text: `\n\n<CV_DATA>\n${textContent}\n</CV_DATA>`,
      });
    }

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        response_mime_type: "application/json",
      },
    };

    const candidateModels = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
    ];

    let geminiRes: Response | null = null;

    keyLoop: for (const key of apiKeys) {
      for (const model of candidateModels) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        try {
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            geminiRes = res;
            break keyLoop;
          }
          const errText = await res.text();
          console.warn(`Gemini API Error in CV Review (${model}):`, res.status, errText);
        } catch (err) {
          console.warn(`Gemini CV fetch exception (${model}):`, err);
        }
      }
    }

    if (!geminiRes) {
      return NextResponse.json(
        { error: "AI Review Engine was unable to analyze your CV. Please try again." },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const candidatePart = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidatePart) {
      return NextResponse.json(
        { error: "Empty review output from AI model." },
        { status: 502 }
      );
    }

    const rawJson = JSON.parse(candidatePart);
    const normalizedReport = normalizeCvReport(rawJson, {
      role: parsed.data.targetRole,
      salary: parsed.data.targetSalary,
      location: parsed.data.location,
      seniority: parsed.data.seniority,
      sector: parsed.data.sector,
      moveType: parsed.data.moveType,
      nuanceNotes: parsed.data.nuanceNotes,
    });

    normalizedReport.auditScope = {
      documentType: docType,
      evidenceLevel: docType === "pdf" ? "full_visual" : "text_only",
      fileName: hasFile ? fileName : null,
      pageCount: null,
      wordCount: (hasText ? cvText : "").split(/\s+/).filter(Boolean).length,
      extractionWarnings: [],
    };

    return NextResponse.json({ review: normalizedReport });
  } catch (error) {
    console.error("CV Review Exception:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze CV" },
      { status: 500 }
    );
  }
}
