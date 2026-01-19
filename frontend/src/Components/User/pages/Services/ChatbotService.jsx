import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

function formatTime(date = new Date()) {
  try {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content:
      "Hi! I can help explain symptoms or lab reports in general terms. I’m not a doctor and I can’t diagnose.\n\nTell me:\n• your age range\n• symptoms\n• how long it’s been happening\n• any red flags (chest pain, breathing trouble, fainting)",
    ts: new Date().toISOString(),
  },
];

function MessageBubble({ role, content, ts }) {
  const isUser = role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.25,
        alignItems: "flex-end",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34 }}>
          <MedicalServicesRoundedIcon fontSize="small" />
        </Avatar>
      )}

      <Box sx={{ maxWidth: "78%", minWidth: "120px" }}>
   <Paper
  elevation={0}
  sx={{
    px: 1.5,
    py: 1.2,
    borderRadius: 3,
    bgcolor: isUser ? "grey.900" : "#f5f5f5",
    color: isUser ? "common.white" : "#000000", // ✅ PURE BLACK
    border: "1px solid",
    borderColor: isUser ? "grey.900" : "grey.300",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }}
>

       <Typography
  sx={{
    fontSize: "0.95rem",
    lineHeight: 1.6,
    fontWeight: 400,
    color: isUser ? "#ffffff" : "#000000", // PURE BLACK
    opacity: 1, // 🔥 IMPORTANT
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  }}
>
  {content}
</Typography>
        </Paper>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            color: "text.secondary",
            textAlign: isUser ? "right" : "left",
          }}
        >
          {formatTime(new Date(ts))}
        </Typography>
      </Box>

      {isUser && (
        <Avatar sx={{ bgcolor: "grey.700", width: 34, height: 34 }}>
          <PersonRoundedIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
}

function TypingBubble() {
  return (
    <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-end" }}>
      <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34 }}>
        <MedicalServicesRoundedIcon fontSize="small" />
      </Avatar>
      <Paper
        elevation={0}
        sx={{
          px: 1.5,
          py: 1.2,
          borderRadius: 3,
          bgcolor: "grey.100",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Thinking…
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default function ChatbotService({ apiBaseUrl, reportContext = null }) {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);
  const isSmall = useMediaQuery("(max-width:600px)");

  // ✅ Always have a backend URL
  const baseUrl = useMemo(() => {
    const raw =
      (apiBaseUrl && String(apiBaseUrl).trim()) || "http://127.0.0.1:8000";
    return raw.replace(/\/+$/, "");
  }, [apiBaseUrl]);

  const endpoint = useMemo(() => `${baseUrl}/api/chat`, [baseUrl]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, loading]);

  const quickPrompts = [
    "I have headache and fever for 2 days.",
    "What does high cholesterol usually mean?",
    "My report shows low hemoglobin — what are common causes?",
    "When should I go to ER for chest pain?",
  ];

  const resetChat = () => {
    setMessages(DEFAULT_MESSAGES);
    setInput("");
  };

  const send = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [
      ...messages,
      { role: "user", content: text, ts: new Date().toISOString() },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    // Debug
    console.log("Chatbot calling:", endpoint);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          report_context: reportContext,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const detail =
          (data && (data.detail || data.error || data.message)) ||
          `Request failed: ${res.status}`;

        throw new Error(detail);
      }

      if (!data || typeof data.reply !== "string") {
        throw new Error("Unexpected server response (missing 'reply').");
      }

      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply, ts: new Date().toISOString() },
      ]);
    } catch (err) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Sorry — I couldn’t reach the server.\n\n" +
            `Error: ${err?.message || "Unknown error"}\n\n` +
            `Backend URL: ${baseUrl}\n` +
            `Tip: Open ${baseUrl}/docs and test POST /api/chat.`,
          ts: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    // Enter to send, Shift+Enter for newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 980,
        mx: "auto",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "grey.200",
        bgcolor: "background.paper",
        pt:10
      }}
    >
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar
          sx={{
            borderBottom: "1px solid",
            borderColor: "grey.200",
            gap: 1.25,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <MedicalServicesRoundedIcon />
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              Medical Chatbot
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Educational info only • Not a diagnosis • Emergencies: seek urgent care
            </Typography>
          </Box>

          <Tooltip title="Reset chat">
            <IconButton onClick={resetChat}>
              <RestartAltRoundedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Quick prompt chips */}
      <Box sx={{ p: 2, pb: 1.25 }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {quickPrompts.map((p) => (
            <Chip
              key={p}
              label={p}
              variant="outlined"
              onClick={() => send(p)}
              sx={{ borderRadius: 999 }}
            />
          ))}
        </Stack>

        {/* <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Connected to: <span style={{ fontFamily: "monospace" }}>{baseUrl}</span>
        </Typography> */}
      </Box>

      <Divider />

      {/* Chat area */}
      <Box
        sx={{
          height: isSmall ? 420 : 520,
          overflowY: "auto",
          px: 2,
          py: 2,
          bgcolor: "grey.50",
        }}
      >
        <Stack spacing={2}>
          {messages.map((m, idx) => (
            <MessageBubble
              key={`${m.ts}-${idx}`}
              role={m.role}
              content={m.content}
              ts={m.ts}
            />
          ))}

          {loading && <TypingBubble />}

          <div ref={endRef} />
        </Stack>
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            minRows={isSmall ? 2 : 2}
            maxRows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "common.white",
              },
            }}
          />

          <Tooltip title="Send">
            <span>
              <IconButton
                onClick={() => send()}
                disabled={loading || !input.trim()}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 3,
                  bgcolor: "grey.900",
                  color: "common.white",
                  "&:hover": { bgcolor: "grey.800" },
                  "&.Mui-disabled": { bgcolor: "grey.300", color: "grey.600" },
                }}
              >
                <SendRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Tip: include age range, duration, severity, and any red flags (breathing trouble, chest pain, fainting).
        </Typography>
      </Box>
    </Paper>
  );
}
