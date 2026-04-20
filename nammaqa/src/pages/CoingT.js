import { Grid, Container } from "@mui/material";
import { AptitudeCard } from "../components/Card";

// you can change images later
import img1 from "../images/9i.jpg";
import img2 from "../images/9i.jpg";
import img3 from "../images/9i.jpg";
import img4 from "../images/9i.jpg";

export const CodingTheory = () => {
  const data = [
    {
      title: "Python",
      description: "Learn programming concepts using Python.",
      image: img1,
    },
    {
      title: "Next.js",
      description: "Build modern React apps with Next.js framework.",
      image: img2,
    },
    {
      title: "R Programming",
      description: "Work with data analysis and statistical computing.",
      image: img3,
    },
    {
      title: "Java",
      description: "Understand object-oriented programming with Java.",
      image: img4,
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