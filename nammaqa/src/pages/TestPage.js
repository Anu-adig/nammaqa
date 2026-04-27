import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";

const TestPage = () => {
  const { module } = useParams();

  const allQuestionsData = {
    ...questionsData,
    ...reasoningQuestionsData,
  };
  const sections = allQuestionsData[module] || {};
  const sectionNames = Object.keys(sections);

  const [currentSection] = useState(sectionNames[0]);
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
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          p: 2,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 620, p: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Assessment Submitted
          </Typography>
          <Typography variant="h6">
            Your score: {score} / {questions.length}
          </Typography>
        </Card>
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
