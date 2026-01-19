"use client";

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
// import MedicationIcon from "@mui/icons-material/Medication";
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { analyzeReportAPI, askQuestionAPI, uploadReport } from "../../../../api/api";
import BackendStatusChecker from "../../../BackendStatus";

function TabPanel({ value, index, children }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ mt: 3 }}>
      {value === index ? children : null}
    </Box>
  );
}

export default function DiseasePredictor() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0 upload, 1 results, 2 chat, 3 actions
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");

  const urgencyChip = useMemo(() => {
    const u = report?.urgency || "routine";
    if (u === "urgent") return { label: "Urgent", color: "error" };
    if (u === "moderate") return { label: "Moderate", color: "warning" };
    return { label: "Routine", color: "success" };
  }, [report?.urgency]);

  const analyzeReport = async () => {
    if (!file) return alert("Please upload a file first.");
    try {
      setAnalyzing(true);
      setReport(null);
      console.log("Starting analysis for file:", file.name);

      // Step 1: Upload PDF
      const uploadRes = await uploadReport(file);
      const reportId = uploadRes.report_id;
      console.log("Uploaded Report ID:", reportId);

      // Step 2: Analyze uploaded report
      const analysisRes = await analyzeReportAPI(reportId);
      console.log("Analysis Result:", analysisRes);

      // Step 3: Set result to display
      setReport({
        patientName: analysisRes.patient_name || "Unknown",
        reportType: analysisRes.report_type || "Unknown Report",
        date: new Date().toISOString().split("T")[0],
        keyFindings: Array.isArray(analysisRes.key_findings) ? analysisRes.key_findings : [],
        summary: analysisRes.summary || "No summary available.",
        nextSteps: Array.isArray(analysisRes.next_steps) ? analysisRes.next_steps : [],
        urgency: analysisRes.urgency || "routine",
        reportId,
      });

      setActiveTab(1);
    } catch (err) {
      console.error(err);
      alert("Error analyzing report: " + (err?.message || "Unknown error"));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    console.log("Selected file:", uploadedFile);
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;
    if (!report?.reportId) return alert("No analyzed report found.");

    const question = userQuestion.trim();

    // Add user question to chat
    const newMessages = [...chatMessages, { type: "user", text: question }];
    setChatMessages(newMessages);
    setUserQuestion("");

    try {
      const response = await askQuestionAPI(report.reportId, question);
      const aiResponse = response?.answer || "No answer available.";
      setChatMessages([...newMessages, { type: "ai", text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setChatMessages([...newMessages, { type: "ai", text: "Sorry, something went wrong." }]);
    }
  };

  const canUseReportTabs = Boolean(report);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",pt:10 // from-blue-50 to-indigo-50 vibe
      }}
    >
      <BackendStatusChecker />

      {/* Header */}
      <Paper elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
              }}
            >
              <DescriptionIcon sx={{ color: "white" }} />
            </Avatar>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "grey.900", lineHeight: 1.1 }}>
                AI Health Report Analyzer
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.600" }}>
                AI assistant designed to explain medical reports and guide next steps
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tabs */}
        <Paper
          elevation={1}
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 0.5,
            mb: 3,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="fullWidth"
            TabIndicatorProps={{
              sx: {
                height: 0, // we mimic the "pill button" look by styling tabs directly
              },
            }}
            sx={{
              "& .MuiTab-root": {
                borderRadius: 1.5,
                minHeight: 48,
                textTransform: "none",
                fontWeight: 600,
                color: "grey.600",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "white",
                backgroundColor: "#3b82f6",
                boxShadow: "0px 6px 16px rgba(59, 130, 246, 0.25)",
              },
            }}
          >
            <Tab icon={<UploadFileIcon />} iconPosition="start" label="Upload Report" />
            <Tab
              icon={<DescriptionIcon />}
              iconPosition="start"
              label="Results"
              disabled={!canUseReportTabs}
              sx={!canUseReportTabs ? { color: "grey.400" } : undefined}
            />
            <Tab
              icon={<ChatBubbleOutlineIcon />}
              iconPosition="start"
              label="Ask Questions"
              disabled={!canUseReportTabs}
              sx={!canUseReportTabs ? { color: "grey.400" } : undefined}
            />
            <Tab
              icon={<EventIcon />}
              iconPosition="start"
              label="Next Steps"
              disabled={!canUseReportTabs}
              sx={!canUseReportTabs ? { color: "grey.400" } : undefined}
            />
          </Tabs>
        </Paper>

        {/* Upload Tab */}
        <TabPanel value={activeTab} index={0}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              p: { xs: 2, md: 3 },
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box textAlign="center" sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "grey.900", mb: 0.5 }}>
                  Upload Your Health Report
                </Typography>
                <Typography variant="body2" sx={{ color: "grey.600" }}>
                  We support PDF lab reports, test results, and medical documents
                </Typography>
              </Box>

              {/* Dropzone-style */}
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "grey.300",
                  borderRadius: 3,
                  p: { xs: 4, md: 6 },
                  textAlign: "center",
                  transition: "border-color 150ms ease",
                  "&:hover": { borderColor: "#60a5fa" },
                }}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                  <UploadFileIcon sx={{ fontSize: 64, color: "grey.400", mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "grey.700" }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" sx={{ color: "grey.500" }}>
                    PDF files only (Max 10MB)
                  </Typography>
                </label>
              </Box>

              {/* Selected file + analyze */}
              {file && (
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#eff6ff",
                    borderColor: "#bfdbfe",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <DescriptionIcon sx={{ fontSize: 32, color: "#2563eb" }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "grey.900" }}>{file.name}</Typography>
                        <Typography variant="body2" sx={{ color: "grey.600" }}>
                          {(file.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Box>
                    </Stack>

                    <Button
                      variant="contained"
                      onClick={analyzeReport}
                      disabled={analyzing}
                      startIcon={analyzing ? <AutorenewIcon /> : null}
                      sx={{
                        px: 3,
                        py: 1,
                        fontWeight: 700,
                        bgcolor: "#2563eb",
                        "&:hover": { bgcolor: "#1d4ed8" },
                        "&.Mui-disabled": { bgcolor: "grey.400" },
                        ...(analyzing
                          ? {
                              "& .MuiButton-startIcon > *": {
                                animation: "spin 1s linear infinite",
                              },
                              "@keyframes spin": {
                                from: { transform: "rotate(0deg)" },
                                to: { transform: "rotate(360deg)" },
                              },
                            }
                          : {}),
                      }}
                    >
                      {analyzing ? "Analyzing..." : "Analyze Report"}
                    </Button>
                  </Stack>
                </Paper>
              )}

              {/* Feature cards */}
              <Grid container spacing={2} sx={{ mt: 3 }} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", textAlign: "center" }}>
                    <ErrorOutlineIcon sx={{ fontSize: 32, color: "#3b82f6", mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "grey.700" }}>
                      Secure & Private
                    </Typography>
                    <Typography variant="caption" sx={{ color: "grey.500" }}>
                      Your data is encrypted
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", textAlign: "center" }}>
                    <CheckCircleIcon sx={{ fontSize: 32, color: "#22c55e", mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "grey.700" }}>
                      AI-Powered
                    </Typography>
                    <Typography variant="caption" sx={{ color: "grey.500" }}>
                      Advanced analysis
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", textAlign: "center" }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 32, color: "#a855f7", mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "grey.700" }}>
                      Ask Anything
                    </Typography>
                    <Typography variant="caption" sx={{ color: "grey.500" }}>
                      Get instant answers
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Results Tab */}
        <TabPanel value={activeTab} index={1}>
          {report ? (
            <Stack spacing={3}>
              {/* Summary Card */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "grey.900" }}>
                        {report.reportType}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "grey.600" }}>
                        Date: {report.date}
                      </Typography>
                    </Box>

                    <Chip
                      label={urgencyChip.label}
                      color={urgencyChip.color}
                      variant="filled"
                      sx={{ fontWeight: 700, px: 1 }}
                    />
                  </Stack>

                  <Paper
                    sx={{
                      bgcolor: "#eff6ff",
                      borderLeft: "4px solid #3b82f6",
                      borderRadius: 1.5,
                      p: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, color: "grey.900", mb: 1 }}>
                      Summary in Plain English:
                    </Typography>
                    <Typography sx={{ color: "grey.700" }}>{report.summary}</Typography>
                  </Paper>
                </CardContent>
              </Card>

              {/* Detailed Findings */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "grey.900", mb: 2 }}>
                    Detailed Results
                  </Typography>

                  <Stack spacing={1.5}>
                    {report.keyFindings.map((finding, idx) => {
                      const isWarn = finding.status === "elevated" || finding.status === "low";
                      return (
                        <Paper
                          key={idx}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "grey.50",
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 700, color: "grey.900" }}>{finding.metric}</Typography>
                              <Typography variant="body2" sx={{ color: "grey.600" }}>
                                Normal range: {finding.range}
                              </Typography>
                            </Box>

                            <Box textAlign="right">
                              <Typography sx={{ fontWeight: 900, fontSize: 18, color: "grey.900" }}>
                                {finding.value}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: isWarn ? "#ca8a04" : "#16a34a",
                                }}
                              >
                                {String(finding.status || "normal").charAt(0).toUpperCase() +
                                  String(finding.status || "normal").slice(1)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          ) : (
            <Alert severity="info">No report available. Upload and analyze a PDF first.</Alert>
          )}
        </TabPanel>

        {/* Chat Tab */}
        <TabPanel value={activeTab} index={2}>
          {report ? (
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "grey.900", mb: 2 }}>
                  Ask Questions About Your Report
                </Typography>

                <Paper
                  sx={{
                    height: 384, // h-96
                    overflowY: "auto",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                    mb: 2,
                  }}
                >
                  {chatMessages.length === 0 ? (
                    <Box sx={{ textAlign: "center", mt: 8, color: "grey.500" }}>
                      <ChatBubbleOutlineIcon sx={{ fontSize: 64, color: "grey.400", mb: 1 }} />
                      <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Ask me anything about your report</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        I&apos;ll explain it in simple terms
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {chatMessages.map((msg, idx) => {
                        const isUser = msg.type === "user";
                        return (
                          <Box key={idx} sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                          <Paper
  elevation={0}
  sx={{
    maxWidth: 520,
    p: 2,
    borderRadius: 3,
    bgcolor: isUser ? "#2563eb" : "#ffffff",
    border: "1px solid",
    borderColor: isUser ? "#2563eb" : "#d1d5db",
    boxShadow: isUser ? "0px 10px 24px rgba(37, 99, 235, 0.18)" : "none",
  }}
>
                                <Typography
    sx={{
      fontSize: "0.95rem",
      lineHeight: 1.7,
      fontWeight: 400,
      color: isUser ? "#ffffff" : "#000000", // ✅ PURE BLACK for AI
      opacity: 1, // ✅ no washed-out effect
      whiteSpace: "pre-wrap",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}
  >
    {msg.text}
  </Typography>
                            </Paper>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Paper>

                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Type your question..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAskQuestion();
                    }}
                    sx={{
                      "& .MuiInputBase-root": { bgcolor: "white" },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAskQuestion}
                    sx={{
                      px: 3,
                      fontWeight: 800,
                      bgcolor: "#2563eb",
                      "&:hover": { bgcolor: "#1d4ed8" },
                    }}
                  >
                    Send
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">No report available. Upload and analyze a PDF first.</Alert>
          )}
        </TabPanel>

        {/* Actions Tab */}
        <TabPanel value={activeTab} index={3}>
          {report ? (
            <Stack spacing={3}>
              {/* Next steps */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "grey.900", mb: 2 }}>
                    Recommended Next Steps
                  </Typography>

                  <Stack spacing={1.5}>
                    {report.nextSteps.map((step, idx) => (
                      <Paper
                        key={idx}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f9fafb",
                          display: "flex",
                          gap: 1.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <CheckCircleIcon sx={{ color: "#22c55e", mt: "2px" }} />
                        <Typography sx={{ color: "grey.700" }}>{step}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Grid container spacing={2}>
                {/* <Grid item xs={12} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "box-shadow 150ms ease",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <CardContent>
                      <EventIcon sx={{ fontSize: 40, color: "#3b82f6", mb: 1 }} />
                      <Typography sx={{ fontWeight: 800, color: "grey.900", mb: 0.5 }}>Book Appointment</Typography>
                      <Typography variant="body2" sx={{ color: "grey.600" }}>
                        Schedule a follow-up with your doctor
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid> */}
              <Grid item xs={12} md={4}>
  <Card
    elevation={3}
    onClick={() => navigate("/doctor")}
    sx={{
      borderRadius: 3,
      cursor: "pointer",
      transition: "all 150ms ease",
      "&:hover": {
        boxShadow: 6,
        transform: "translateY(-2px)",
      },
    }}
  >
    <CardContent>
      <EventIcon sx={{ fontSize: 40, color: "#3b82f6", mb: 1 }} />
      <Typography sx={{ fontWeight: 800, color: "grey.900", mb: 0.5 }}>
        Book Appointment
      </Typography>
      <Typography variant="body2" sx={{ color: "grey.600" }}>
        Schedule a follow-up with your doctor
      </Typography>
    </CardContent>
  </Card>
</Grid>

               <Grid item xs={12} md={4}>
                  <Card
                    elevation={3}
                     onClick={() => navigate("/services/chatbot")}
                    sx={{
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "box-shadow 150ms ease",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <CardContent>
                      <PsychologyAltIcon sx={{ fontSize: 40, color: "#a855f7", mb: 1 }} />
                      <Typography sx={{ fontWeight: 800, color: "grey.900", mb: 0.5 }}>AI Assistant</Typography>
                      <Typography variant="body2" sx={{ color: "grey.600" }}>
                       AI assistant providing instant, easy-to-understand health insights.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    elevation={3}
                     onClick={() => navigate("/doctor")}
                    sx={{
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "box-shadow 150ms ease",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <CardContent>
                      <LocalAtmIcon sx={{ fontSize: 40, color: "#22c55e", mb: 1 }} />
                      <Typography sx={{ fontWeight: 800, color: "grey.900", mb: 0.5 }}>Find Affordable Care</Typography>
                      <Typography variant="body2" sx={{ color: "grey.600" }}>
                        Explore cost-effective options near you
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

 
              </Grid>
            </Stack>
          ) : (
            <Alert severity="info">No report available. Upload and analyze a PDF first.</Alert>
          )}
        </TabPanel>
      </Container>

      {/* Footer */}
      <Container maxWidth="lg" sx={{ py: 3, textAlign: "center" }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 1, color: "grey.600" }}>
          <ErrorOutlineIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Important: This tool is for educational purposes only
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "grey.600" }}>
          Always consult with healthcare professionals for medical advice and treatment decisions.
        </Typography>
      </Container>
    </Box>
  );
}
