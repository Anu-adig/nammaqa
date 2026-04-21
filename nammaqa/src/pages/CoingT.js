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
      link: '/test'
    },
    {
      title: "Next.js",
      description: "Build modern React apps with Next.js framework.",
      image: img2,
      link: '/test'
    },
    {
      title: "R Programming",
      description: "Work with data analysis and statistical computing.",
      image: img3,
      link: '/test'
    },
    {
      title: "Java",
      description: "Understand object-oriented programming with Java.",
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