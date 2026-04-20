import { Grid, Container } from "@mui/material";
import { AptitudeCard } from "../components/Card";
import img1 from "../images/1i.jpg";
import img2 from "../images/2i.png";
import img3 from "../images/3i.jpg";
import img4 from "../images/4i.png";


export const Aptitude = () => {
  const data = [
    {
      title: "Data Interpretation",
      description:
        "Practice real-world data problems with charts and graphs.",
      image: img1,
    },
    {
      title: "Time & Work",
      description: "Solve efficiency and productivity problems.",
      image: img2,
    },
    {
      title: "Profit & Loss",
      description: "Master business calculations easily.",
      image: img3,
    },
    {
      title: "Percentage",
      description: "Strengthen your basics and shortcuts.",
      image: img4,
    },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Grid container spacing={4} xs={12}>
        {data.map((item, i) => (
          <Grid item xs={12} md={6} key={i}>
            <AptitudeCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};