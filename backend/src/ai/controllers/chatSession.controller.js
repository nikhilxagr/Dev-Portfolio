import mongoose from "mongoose";
import AiChatSession from "../../models/AiChatSession.js";

const generateTitleFromMessages = (messages = []) => {
  const firstUserMsg = messages.find((m) => m && m.role === "user" && m.content);
  if (!firstUserMsg || typeof firstUserMsg.content !== "string") {
    return "New chat";
  }
  const clean = firstUserMsg.content.trim().replace(/^(\/image\s*)+/i, "");
  return clean.slice(0, 48) || "New chat";
};

// GET /api/ai/sessions - List user chat history sessions
export const listUserSessions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const sessions = await AiChatSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
      { $sort: { pinned: -1, updatedAt: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          pinned: 1,
          isArchived: 1,
          createdAt: 1,
          updatedAt: 1,
          messageCount: { $size: { $ifNull: ["$messages", []] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error(`[chatSession] List sessions error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to load chat history" });
  }
};

// GET /api/ai/sessions/:id - Get full messages of a specific session
export const getUserSession = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid session ID" });
      return;
    }

    const session = await AiChatSession.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(`[chatSession] Get session error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to load session" });
  }
};

// POST /api/ai/sessions - Create or update a session with latest messages
export const saveUserSession = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const { sessionId, title, messages = [] } = req.body;

    // Sanitize messages
    const sanitizedMessages = Array.isArray(messages)
      ? messages.slice(-50).map((m) => ({
          id: String(m.id || `msg-${Date.now()}`),
          role: m.role === "assistant" ? "assistant" : "user",
          content: typeof m.content === "string" ? m.content : "",
          timestamp: typeof m.timestamp === "number" ? m.timestamp : Date.now(),
          type: m.type === "image" ? "image" : "text",
          image: m.image
            ? {
                status: String(m.image.status || ""),
                prompt: String(m.image.prompt || ""),
                dataUrl: String(m.image.dataUrl || ""),
                model: m.image.model || null,
                durationMs: Number(m.image.durationMs || 0),
                quota: m.image.quota || null,
                error: String(m.image.error || ""),
                requireAuth: Boolean(m.image.requireAuth),
              }
            : undefined,
          isError: Boolean(m.isError),
        }))
      : [];

    // If an existing session ID is provided and is a valid ObjectId, try updating it
    if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
      const existingSession = await AiChatSession.findOne({
        _id: sessionId,
        userId: req.user._id,
      });

      if (existingSession) {
        existingSession.messages = sanitizedMessages;
        if (title && typeof title === "string" && title.trim()) {
          existingSession.title = title.trim().slice(0, 100);
        } else if (existingSession.title === "New chat" && sanitizedMessages.length > 0) {
          existingSession.title = generateTitleFromMessages(sanitizedMessages);
        }
        await existingSession.save();

        res.status(200).json({
          success: true,
          session: existingSession,
        });
        return;
      }
    }

    // Otherwise create a new session
    const finalTitle =
      (title && typeof title === "string" && title.trim().slice(0, 100)) ||
      generateTitleFromMessages(sanitizedMessages);

    const newSession = await AiChatSession.create({
      userId: req.user._id,
      title: finalTitle,
      messages: sanitizedMessages,
    });

    res.status(201).json({
      success: true,
      session: newSession,
    });
  } catch (error) {
    console.error(`[chatSession] Save session error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to save chat session" });
  }
};

// PATCH /api/ai/sessions/:id - Update title or pinned status
export const patchUserSession = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid session ID" });
      return;
    }

    const updates = {};
    if (typeof req.body.title === "string" && req.body.title.trim()) {
      updates.title = req.body.title.trim().slice(0, 100);
    }
    if (typeof req.body.pinned === "boolean") {
      updates.pinned = req.body.pinned;
    }
    if (typeof req.body.isArchived === "boolean") {
      updates.isArchived = req.body.isArchived;
    }

    const updated = await AiChatSession.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }

    res.status(200).json({
      success: true,
      session: updated,
    });
  } catch (error) {
    console.error(`[chatSession] Patch session error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to update session" });
  }
};

// DELETE /api/ai/sessions/:id - Delete a specific session
export const deleteUserSession = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid session ID" });
      return;
    }

    const deleted = await AiChatSession.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Chat session deleted successfully",
    });
  } catch (error) {
    console.error(`[chatSession] Delete session error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to delete session" });
  }
};

// DELETE /api/ai/sessions - Clear all user chat history
export const clearAllUserSessions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    await AiChatSession.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "All chat sessions cleared successfully",
    });
  } catch (error) {
    console.error(`[chatSession] Clear all sessions error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to clear chat history" });
  }
};
