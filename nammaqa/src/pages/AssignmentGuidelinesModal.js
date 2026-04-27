import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const AssignmentGuidelinesCard = () => {
  const navigate = useNavigate();
  const { module = "aptitude", testType } = useParams();

  const handleStart = () => {
    if (module === "aptitude") {
      navigate(testType ? `/test/aptitude/${testType}` : "/test/aptitude");
      return;
    }

    if (module === "reasoning") {
      navigate(testType ? `/test/reasoning/${testType}` : "/test/reasoning");
      return;
    }

    if (module === "coding-theory") {
      navigate("/coding-theory");
      return;
    }

    if (module === "coding-practical") {
      navigate("/coding-practical");
      return;
    }

    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
  {/* TITLE */}
  <Typography
    variant="h5"
    fontWeight="bold"
    align="center"
    sx={{ mb: 2 }}
  >
    Assignment Guidelines
  </Typography>

  <Divider sx={{ mb: 2 }} />

  {/* INSTRUCTIONS */}
  <Box component="ol" sx={{ pl: 3 }}>
    <Typography component="li" sx={{ mb: 1, fontWeight: "bold" }}>
      Follow all instructions carefully.
    </Typography>

    <Typography component="li" sx={{ mb: 1, fontWeight: "bold" }}>
      Do not refresh during the test.
    </Typography>

    <Typography component="li" sx={{ mb: 1, fontWeight: "bold" }}>
      Complete within the given time.
    </Typography>

    <Typography component="li" sx={{ mb: 1, fontWeight: "bold" }}>
      Avoid switching tabs.
    </Typography>

    <Typography component="li" sx={{ mb: 1, fontWeight: "bold" }}>
      Submit before the deadline.
    </Typography>
  </Box>
</CardContent>

        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{ ml: 2, backgroundColor: "#E9B734" }}
            onClick={handleStart}
          >
            Start Assessment
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default AssignmentGuidelinesCard;
