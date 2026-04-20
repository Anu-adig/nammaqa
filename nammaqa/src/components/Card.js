import { Card, Box, Typography, Button } from "@mui/material";

export const AptitudeCard = ({ title, description, image }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "523px",
        height: "252px",
        pr: "50px",
        gap: "30px",
        background: "#FFFFFF",
        boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* LEFT IMAGE */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "244px",
          height: "252px",
          objectFit: "cover",
          borderRadius: "16px 0 0 16px",
        }}
      />

      {/* RIGHT CONTENT */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
          width: "239px",
        }}
      >
        {/* TITLE */}
        <Typography
          sx={{
            fontFamily: "Arial",
            fontWeight: 700,
            fontSize: "20px",
            color: "#000",
          }}
        >
          {title}
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontFamily: "Arial",
            fontSize: "16px",
            lineHeight: "18px",
            color: "#000",
          }}
        >
          {description}
        </Typography>

        {/* BUTTON */}
        <Button
          sx={{
            width: "207px",
            height: "43px",
            borderRadius: "8px",
            fontWeight: 900,
            fontSize: "18px",
            color: "#F5F5F5",
            textTransform: "none",
            background:
              "radial-gradient(circle at 50% 90%, #C4000E 14%, #D75C21 60%)",
            "&:hover": {
              background:
                "radial-gradient(circle at 50% 90%, #a0000c 14%, #b94a1a 60%)",
            },
          }}
        >
          Take Test
        </Button>
      </Box>
    </Card>
  );
};