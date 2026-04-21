import { Grid, Container } from "@mui/material";
import { AptitudeCard } from "../components/Card";

// you can change these images later
import img1 from "../images/5j.jpg";
import img2 from "../images/6j.jpg";
import img3 from "../images/7j.jpg";
import img4 from "../images/8j.png";

const Reasoning = () => {
  const data = [
    {
      title: "Coding-Decoding",
      description: "Solve pattern-based coding and decoding problems.",
      image: img1,
      link: '/test'
    },
    {
      title: "Blood Relations",
      description: "Understand family relationships logically.",
      image: img2,
      link: '/test'
    },
    {
      title: "Direction Sense",
      description: "Practice questions based on directions and movement.",
      image: img3,
      link: '/test'
    },
    {
      title: "Number Series",
      description: "Identify patterns in number sequences.",
      image: img4,
      link: '/test'
    },
  ];

  return (
    <Container sx={{ mt: 5 }}>
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

export default Reasoning;