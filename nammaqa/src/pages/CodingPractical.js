import { Grid, Container } from "@mui/material";
import { AptitudeCard } from "../components/Card";

// images
import img1 from "../images/10i.webp";
import img2 from "../images/11i.webp";
import img3 from "../images/12i.webp";
import img4 from "../images/13i.webp";

export const CodingPractical = () => {
  const data = [
    {
      title: "Python",
      description: "Practice coding problems using Python.",
      image: img1,
      link: '/test'
    },
    {
      title: "Java",
      description: "Solve real-world programming problems in Java.",
      image: img2,
      link: '/test'
    },
    {
      title: "Database & SQL",
      description: "Write queries and work with relational databases.",
      image: img3,
      link: '/test'
    },
    {
      title: "C++",
      description: "Build strong problem-solving skills using C++.",
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