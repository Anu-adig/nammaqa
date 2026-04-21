import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { questionsData } from "../data/questions";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";

const TestPage = () => {
  const { module } = useParams();

  const sections = questionsData[module];
  const sectionNames = Object.keys(sections);

  const [currentSection, setCurrentSection] = useState(sectionNames[0]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);

  const questions = sections[currentSection];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev === 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (opt) => {
    setAnswers({
      ...answers,
      [`${currentSection}-${currentQ}`]: opt,
    });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const handleSubmit = () => {
    alert("Test Submitted");
  };

  return (
    <Box p={3}>
      <Typography variant="h5">{module}</Typography>

      <Typography mt={2}>
        {questions[currentQ].question}
      </Typography>

      {questions[currentQ].options.map((opt, i) => (
        <Button key={i} onClick={() => handleAnswer(opt)}>
          {opt}
        </Button>
      ))}

      <Box mt={2}>
        <Button onClick={handlePrev}>Prev</Button>
        <Button onClick={handleNext}>Next</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Box>
  );
};

export default TestPage;