import React, { useState } from "react";
import { Grid, Container, Button, Box } from "@mui/material";
import { AptitudeCard } from "../components/Card";
import AssignmentGuidelinesModal from "./AssignmentGuidelinesModal";

import img1 from "../images/1i.jpg";
import img2 from "../images/2i.png";
import img3 from "../images/3i.jpg";
import img4 from "../images/4i.png";
import { useNavigate } from "react-router-dom";

export const Aptitude = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const data = [
    {
      title: "Data Interpretation",
      description:
        "Practice real-world data problems with charts and graphs.",
      image: img1,
      link: '/test'
    },
    {
      title: "Time & Work",
      description: "Solve efficiency and productivity problems.",
      image: img2,
      link: '/test'
    },
    {
      title: "Profit & Loss",
      description: "Master business calculations easily.",
      image: img3,
      link: '/test'
    },
    {
      title: "Percentage",
      description: "Strengthen your basics and shortcuts.",
      image: img4,
      link: '/test'
    },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      

      {/* 📊 CARDS */}
      <Grid container spacing={4}>
        {data.map((item, i) => (
          <Grid item xs={12} md={6} key={i}>
            <AptitudeCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};