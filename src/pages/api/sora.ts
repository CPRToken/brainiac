// src/pages/api/sora.ts
import { NextApiRequest, NextApiResponse } from "next/types";
import admin from "src/libs/firebaseAdmin";

function isFirebaseAuthError(error: any): error is { errorInfo: { code: string } } {
  return typeof error === "object" && error !== null && "errorInfo" in error;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Authentication token is required" });
    return;
  }

  try {
    await admin.auth().verifyIdToken(token);

    const { prompt, model = "sora-2", size = "1280x720" } = req.body;

    // 1️⃣ Create the video job
    const createResponse = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model, prompt, size }),
    });

    const job = await createResponse.json();
    console.log("Video job created:", job);

    if (!job.id) {
      return res.status(500).json({ error: "Failed to create video job", details: job });
    }

    // 2️⃣ Poll for completion
    let videoData: any = null;

    for (let i = 0; i < 90; i++) { // wait up to ~3 min
      await new Promise(r => setTimeout(r, 2000));

      const check = await fetch(`https://api.openai.com/v1/videos/${job.id}`, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      const result = await check.json();
      console.log("Video status:", result.status, "progress:", result.progress);

      // Some servers report 'in_progress' until final flush; store latest anyway
      videoData = result;

      if (result.status === "completed") break;
      if (result.status === "failed") {
        return res.status(500).json({ error: "Video generation failed", details: result });
      }
    }

// ✅ If Sora never sent 'completed', re-check once more directly
    if (videoData?.status !== "completed") {
      const finalCheck = await fetch(`https://api.openai.com/v1/videos/${job.id}`, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });
      videoData = await finalCheck.json();
      console.log("Final re-check status:", videoData.status);
    }

    // 3️⃣ If finished, fetch final content
    if (videoData?.status === "completed") {
      console.log("Fetching final video content from:", job.id);

      const contentResponse = await fetch(
          `https://api.openai.com/v1/videos/${job.id}/content`,
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
      );

      if (!contentResponse.ok) {
        const err = await contentResponse.text();
        console.error("Failed to fetch video content:", err);
        return res.status(500).json({ error: "Failed to fetch video content", details: err });
      }

      // Convert binary to base64
      const arrayBuffer = await contentResponse.arrayBuffer();
      const base64Video = Buffer.from(arrayBuffer).toString("base64");
      const videoSrc = `data:video/mp4;base64,${base64Video}`;

      return res.status(200).json({ video: videoSrc });
    }

    console.error("No video data found in final result:", videoData);
    return res.status(500).json({ error: "No video data found", details: videoData });

  } catch (error) {
    console.error("Error in /api/sora:", error);
    if (isFirebaseAuthError(error)) {
      return res.status(401).json({ error: "Invalid authentication token", details: error.errorInfo.code });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Internal server error", details: message });
  }
};
