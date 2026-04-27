import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { questionsData } from "../data/questions";
import { reasoningQuestionsData } from "../data/reasoningQuestions";
import {
  Box,
  Card,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  Dialog,
  DialogContent,
  Divider,
  LinearProgress,
} from "@mui/material";

const TestPage = () => {
  const { module, testType } = useParams();
  const navigate = useNavigate();

  const allQuestionsData = {
    ...questionsData,
    ...reasoningQuestionsData,
  };
  const sections = allQuestionsData[module] || {};
  const sectionNames = Object.keys(sections);
  const normalizeSectionName = (value) =>
    value?.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-");
  const matchedSectionName =
    sectionNames.find((name) => normalizeSectionName(name) === testType) ||
    sectionNames[0];

  const [currentSection] = useState(matchedSectionName);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [reviewQuestions, setReviewQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [submitted, setSubmitted] = useState(false);
  const [showSkippedDialog, setShowSkippedDialog] = useState(false);
  const [showReviewChoiceDialog, setShowReviewChoiceDialog] = useState(false);
  const [skippedQuestionIndexes, setSkippedQuestionIndexes] = useState([]);

  const questions = sections[currentSection] || [];
  const question = questions[currentQ];
  const selectedAnswer = answers[`${currentSection}-${currentQ}`];
  const currentKey = `${currentSection}-${currentQ}`;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const formattedTime = `${minutes}:${seconds}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev === 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (opt) => {
    const key = `${currentSection}-${currentQ}`;

    setAnswers({
      ...answers,
      [key]: opt,
    });
    setQuestionStatus({
      ...questionStatus,
      [key]: "answered",
    });
  };

  const markBeforeLeaving = () => {
    const hasAnswer = Boolean(answers[currentKey]);

    setQuestionStatus((prev) => ({
      ...prev,
      [currentKey]: hasAnswer ? "answered" : "skipped",
    }));
  };

  const handleNext = () => {
    markBeforeLeaving();

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrev = () => {
    markBeforeLeaving();

    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const handleSkip = () => {
    setQuestionStatus({
      ...questionStatus,
      [currentKey]: "skipped",
    });

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleQuestionJump = (index) => {
    markBeforeLeaving();
    setCurrentQ(index);
  };

  const handleReviewToggle = () => {
    if (!answers[currentKey]) {
      setShowReviewChoiceDialog(true);
      return;
    }

    setReviewQuestions({
      ...reviewQuestions,
      [currentKey]: !reviewQuestions[currentKey],
    });
  };

  const handleSubmit = () => {
    markBeforeLeaving();

    const skippedIndexes = questions.reduce((indexes, item, index) => {
      const key = `${currentSection}-${index}`;
      return answers[key] ? indexes : [...indexes, index];
    }, []);

    if (skippedIndexes.length > 0) {
      setSkippedQuestionIndexes(skippedIndexes);
      setShowSkippedDialog(true);
      return;
    }

    setSubmitted(true);
  };

  const handleEndSubmit = () => {
    setShowSkippedDialog(false);
    setSubmitted(true);
  };

  const handleCheckQuestions = () => {
    setShowSkippedDialog(false);

    if (skippedQuestionIndexes.length > 0) {
      setCurrentQ(skippedQuestionIndexes[0]);
    }
  };

  const score = questions.reduce((total, item, index) => {
    return answers[`${currentSection}-${index}`] === item.answer
      ? total + 1
      : total;
  }, 0);
  const attemptedCount = questions.reduce((total, item, index) => {
    return answers[`${currentSection}-${index}`] ? total + 1 : total;
  }, 0);
  const skippedCount = questions.length - attemptedCount;
  const incorrectCount = attemptedCount - score;
  const reviewCount = Object.values(reviewQuestions).filter(Boolean).length;
  const accuracy = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;
  const timeSpent = 3600 - timeLeft;
  const timeSpentMinutes = Math.floor(timeSpent / 60);
  const timeSpentSeconds = String(timeSpent % 60).padStart(2, "0");
  const passed = accuracy >= 70;

  if (!question) {
    return (
      <Box p={3}>
        <Typography variant="h5">No questions found.</Typography>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background:
            "radial-gradient(circle at top left, #fff0ba 0%, #fff7de 38%, #f6f7fb 100%)",
          px: { xs: 2, md: 5 },
          py: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1180, mx: "auto" }}>
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: 4,
              boxShadow: "0 28px 80px rgba(27, 53, 87, 0.12)",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #c9101e 0%, #f16822 100%)",
                color: "#fff",
                px: { xs: 3, md: 5 },
                py: { xs: 4, md: 5 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1.35fr 0.95fr" },
                gap: 4,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    mb: 2,
                  }}
                >
                  Assessment Result
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 30, md: 42 },
                    lineHeight: 1.05,
                    fontWeight: 800,
                    maxWidth: 560,
                    mb: 1.5,
                  }}
                >
                  {passed ? "Excellent work." : "Good attempt."}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.88)",
                    maxWidth: 620,
                  }}
                >
                  You completed the {currentSection} assessment. Here is a
                  quick breakdown of your performance, accuracy, and question
                  coverage.
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                    gap: 1.5,
                    mt: 4,
                  }}
                >
                  {[
                    { label: "Correct", value: score },
                    { label: "Incorrect", value: incorrectCount },
                    { label: "Skipped", value: skippedCount },
                    { label: "Review Marked", value: reviewCount },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "rgba(255,255,255,0.13)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <Typography sx={{ fontSize: 13, opacity: 0.78, mb: 0.5 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  alignSelf: "center",
                  justifySelf: { xs: "stretch", lg: "end" },
                }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    backgroundColor: "#fff7f4",
                    color: "#1b3557",
                    minWidth: { lg: 320 },
                  }}
                >
                  <Box
                    sx={{
                      width: 170,
                      height: 170,
                      mx: "auto",
                      borderRadius: "50%",
                      background: `conic-gradient(#1b3557 ${accuracy}%, #ffd7c3 ${accuracy}% 100%)`,
                      display: "grid",
                      placeItems: "center",
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 130,
                        height: 130,
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "inset 0 0 0 1px rgba(27,53,87,0.08)",
                      }}
                    >
                      <Typography sx={{ fontSize: 34, fontWeight: 800 }}>
                        {accuracy}%
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "#6e7a8c" }}>
                        Accuracy
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: 24,
                      fontWeight: 800,
                      mb: 0.6,
                    }}
                  >
                    {score} / {questions.length}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: 14,
                      color: "#627086",
                    }}
                  >
                    {passed
                      ? "You crossed the target score for this round."
                      : "You are close. Review the missed questions and try again."}
                  </Typography>
                </Card>
              </Box>
            </Box>

            <Box
              sx={{
                p: { xs: 3, md: 5 },
                backgroundColor: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
                  gap: 3,
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 4,
                    borderColor: "#edf0f5",
                    p: 3,
                  }}
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 2.5 }}>
                    Performance Overview
                  </Typography>

                  {[
                    { label: "Attempted Questions", value: attemptedCount, color: "#1b3557" },
                    { label: "Correct Answers", value: score, color: "#1d8b2e" },
                    { label: "Incorrect Answers", value: incorrectCount, color: "#d9411d" },
                    { label: "Skipped Questions", value: skippedCount, color: "#9a8b80" },
                  ].map((item) => (
                    <Box key={item.label} sx={{ mb: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.8,
                        }}
                      >
                        <Typography sx={{ fontSize: 15, color: "#435067" }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 800, color: item.color }}>
                          {item.value}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={questions.length ? (item.value / questions.length) * 100 : 0}
                        sx={{
                          height: 10,
                          borderRadius: 999,
                          backgroundColor: "#eef1f5",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            backgroundColor: item.color,
                          },
                        }}
                      />
                    </Box>
                  ))}

                  <Divider sx={{ my: 3 }} />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                      gap: 2,
                    }}
                  >
                    {[
                      { label: "Section", value: currentSection },
                      { label: "Module", value: module },
                      {
                        label: "Time Spent",
                        value: `${timeSpentMinutes}:${timeSpentSeconds}`,
                      },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          backgroundColor: "#f8f9fc",
                          minHeight: 88,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, color: "#6c7890", mb: 0.6 }}>
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: item.label === "Section" ? 16 : 22,
                            fontWeight: 800,
                            lineHeight: 1.3,
                            color: "#1b3557",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>

                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 4,
                    borderColor: "#edf0f5",
                    p: 3,
                  }}
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 2 }}>
                    Question Summary
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "#617087", mb: 2.5 }}>
                    Review each question status at a glance.
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
                      gap: 1.5,
                    }}
                  >
                    {questions.map((item, index) => {
                      const key = `${currentSection}-${index}`;
                      const wasAnswered = Boolean(answers[key]);
                      const isCorrect = answers[key] === item.answer;
                      const statusLabel = !wasAnswered
                        ? "Skipped"
                        : isCorrect
                          ? "Correct"
                          : "Wrong";
                      const colors = !wasAnswered
                        ? { bg: "#f1f3f5", text: "#606c80" }
                        : isCorrect
                          ? { bg: "#e8f6ea", text: "#1d8b2e" }
                          : { bg: "#fff0ec", text: "#d9411d" };

                      return (
                        <Box
                          key={item.id}
                          sx={{
                            p: 1.6,
                            borderRadius: 3,
                            border: "1px solid #eef1f5",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              width: 36,
                              height: 36,
                              mx: "auto",
                              mb: 1,
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              backgroundColor: "#1b3557",
                              color: "#fff",
                              fontWeight: 800,
                            }}
                          >
                            {index + 1}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              py: 0.6,
                              borderRadius: 999,
                              backgroundColor: colors.bg,
                              color: colors.text,
                            }}
                          >
                            {statusLabel}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 1.5,
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(
                          testType
                            ? `/test/${module}/${testType}/guidelines`
                            : `/test/${module}/guidelines`
                        )
                      }
                      sx={{
                        minHeight: 52,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #c9101e 0%, #f16822 100%)",
                        fontWeight: 800,
                        textTransform: "none",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #b40d1a 0%, #de5f1f 100%)",
                        },
                      }}
                    >
                      Retake Assessment
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/${module}`)}
                      sx={{
                        minHeight: 52,
                        borderRadius: 3,
                        borderColor: "#1b3557",
                        color: "#1b3557",
                        fontWeight: 800,
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#1b3557",
                          backgroundColor: "#f7f9fd",
                        },
                      }}
                    >
                      Back to Module
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    );
  }

  const getQuestionBoxStyles = (index) => {
    const key = `${currentSection}-${index}`;
    const status = questionStatus[key];
    const isCurrent = index === currentQ;
    const isReview = reviewQuestions[key];

    if (isCurrent) {
      return { backgroundColor: "#b87918", color: "#fff", borderColor: "#b87918" };
    }

    if (isReview) {
      return { backgroundColor: "#7b3fb2", color: "#fff", borderColor: "#7b3fb2" };
    }

    if (status === "answered") {
      return { backgroundColor: "#1d8b2e", color: "#fff", borderColor: "#1d8b2e" };
    }

    if (status === "skipped") {
      return { backgroundColor: "#888", color: "#111", borderColor: "#888" };
    }

    return { backgroundColor: "#fff", color: "#111", borderColor: "#cfcfcf" };
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(120deg, #f0bf30 0%, #fff8dd 50%, #f0bf30 100%)",
        p: { xs: 2, md: 5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1120,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#c90012",
            color: "#fff",
            px: { xs: 2, md: 3 },
            py: 2,
            mb: 3,
            borderRadius: "2px",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
             {currentSection}
          </Typography>
        </Box>

        <Card
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 82px" },
            minHeight: 490,
            borderRadius: 0,
            boxShadow: "0 0 0 1px #1797ff",
            overflow: "hidden",
          }}
        >
          <Box sx={{ backgroundColor: "#fff", p: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                mb: 6,
              }}
            >
              <Box>
                <Typography sx={{ mb: 1, fontSize: 16 }}>
                  Question {currentQ + 1}
                </Typography>
                <Typography sx={{ fontSize: 22, lineHeight: 1.35 }}>
                  {question.question}
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: 170,
                  mt: 1,
                  px: 2,
                  py: 1.2,
                  backgroundColor: "#d7471f",
                  color: "#fff",
                  borderRadius: "5px",
                  textAlign: "center",
                  fontWeight: 800,
                }}
              >
                Time Left: {formattedTime}
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.5,
              }}
            >
              {question.options.map((opt) => {
                const isSelected = selectedAnswer === opt;

                return (
                  <Button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    sx={{
                      justifyContent: "flex-start",
                      minHeight: 58,
                      px: 1.5,
                      border: "1px solid #ddd",
                      borderRadius: "2px",
                      color: isSelected ? "#fff" : "#111",
                      backgroundColor: isSelected ? "#f0bf30" : "#fff",
                      textTransform: "none",
                      fontSize: 16,
                      "&:hover": {
                        backgroundColor: isSelected ? "#f0bf30" : "#fff8de",
                        borderColor: "#d8d8d8",
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: isSelected ? "3px solid #fff" : "1px solid #333",
                        mr: 1.2,
                        boxSizing: "border-box",
                      }}
                    />
                    {opt}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={Boolean(reviewQuestions[currentKey])}
                    onClick={handleReviewToggle}
                    sx={{
                      p: 0.5,
                      color: "#b87918",
                      "&.Mui-checked": { color: "#b87918" },
                    }}
                  />
                }
                label="Review"
                sx={{
                  mr: 0,
                  "& .MuiFormControlLabel-label": { fontSize: 12 },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mt: 7,
              }}
            >
              <Box>
                <Button
                  variant="contained"
                  onClick={handlePrev}
                  disabled={currentQ === 0}
                  sx={{
                    minWidth: 150,
                    borderRadius: "4px 0 0 4px",
                    backgroundColor: "#d9411d",
                    fontWeight: 800,
                    "&:hover": { backgroundColor: "#c43617" },
                  }}
                >
                  Previous
                </Button>

                {currentQ === questions.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      minWidth: 150,
                      borderRadius: "0 4px 4px 0",
                      backgroundColor: "#1d8b2e",
                      fontWeight: 800,
                      "&:hover": { backgroundColor: "#157323" },
                    }}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      minWidth: 150,
                      borderRadius: "0 4px 4px 0",
                      backgroundColor: "#d9411d",
                      fontWeight: 800,
                      "&:hover": { backgroundColor: "#c43617" },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>

              {currentQ < questions.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleSkip}
                  sx={{
                    minWidth: 150,
                    backgroundColor: "#d9a095",
                    color: "#fff",
                    fontWeight: 800,
                    "&:hover": { backgroundColor: "#c88b80" },
                  }}
                >
                  Skip
                </Button>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: "#fff",
              borderLeft: { xs: "none", md: "1px solid #ededed" },
              borderTop: { xs: "1px solid #ededed", md: "none" },
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: 3,
              py: 3,
              px: 2,
            }}
          >
            {questions.map((item, index) => (
              <Button
                key={item.id}
                onClick={() => handleQuestionJump(index)}
                sx={{
                  minWidth: 0,
                  width: 34,
                  height: 42,
                  p: 0,
                  border: "1px solid",
                  borderRadius: "2px",
                  fontWeight: 700,
                  ...getQuestionBoxStyles(index),
                  "&:hover": {
                    ...getQuestionBoxStyles(index),
                    opacity: 0.92,
                  },
                }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        </Card>
      </Box>

      <Dialog
        open={showSkippedDialog}
        onClose={handleCheckQuestions}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: "calc(100% - 32px)",
            borderRadius: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 4,
          }}
        >
          <Typography sx={{ fontSize: 16, mb: 3 }}>
            You have skipped few questions.
            <br />
            Are you sure to submit answer?
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              mb: 3,
            }}
          >
            {skippedQuestionIndexes.map((index) => (
              <Box
                key={index}
                sx={{
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #888",
                  backgroundColor: "#888",
                  color: "#111",
                  fontWeight: 800,
                }}
              >
                {index + 1}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1.2 }}>
            <Button
              variant="contained"
              onClick={handleEndSubmit}
              sx={{
                width: 120,
                background: "linear-gradient(90deg, #d74d20, #d71919)",
                borderRadius: "5px",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(90deg, #c74218, #c91515)",
                },
              }}
            >
              End
            </Button>

            <Button
              variant="outlined"
              onClick={handleCheckQuestions}
              sx={{
                width: 120,
                borderColor: "#1b3557",
                color: "#111",
                borderRadius: "5px",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#1b3557",
                  backgroundColor: "#f6f8fb",
                },
              }}
            >
              Check
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showReviewChoiceDialog}
        onClose={() => setShowReviewChoiceDialog(false)}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: "calc(100% - 32px)",
            borderRadius: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 4,
          }}
        >
          <Typography sx={{ fontSize: 16, mb: 3 }}>
            Please click an option to choose
            <br />
            review.
          </Typography>

          <Button
            variant="contained"
            onClick={() => setShowReviewChoiceDialog(false)}
            sx={{
              width: 220,
              background: "linear-gradient(90deg, #d74d20, #d71919)",
              borderRadius: "5px",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(90deg, #c74218, #c91515)",
              },
            }}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TestPage;
