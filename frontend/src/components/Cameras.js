import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

const cameraData = [
  { id: 1, camera: "Camera 1", section: "Section 3", streamUrl: "#stream1" },
  { id: 2, camera: "Camera 2", section: "Section 1", streamUrl: "#stream2" },
  { id: 3, camera: "Camera 3", section: "Section 4", streamUrl: "#stream3" },
  { id: 4, camera: "Camera 4", section: "Section 2", streamUrl: "#stream4" },
  { id: 5, camera: "Camera 5", section: "Section 5", streamUrl: "#stream5" },
  { id: 6, camera: "Camera 6", section: "Section 6", streamUrl: "#stream6" },
];

export default function Cameras() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom mb={5}>
        Real-time Camera Feed
      </Typography>

      {/* Flex container to wrap cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2} // Space between cards
        justifyContent="space-around" // Align cards to the left and right
      >
        {cameraData.map((camera) => (
          <Card
            key={camera.id}
            sx={{
              width: "30%", // 3 per row
              minWidth: "200px", // Prevents being too small
              backgroundColor: "#559c8b",
              color: "white",
              borderRadius: "10px",
              overflow: "hidden", // Ensures no weird overlap
              boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
              transition: "0.3s", // Smooth transition for hover effect
              marginBottom: "20px",
              "&:hover": {
                boxShadow: "6px 6px 15px rgba(0, 0, 0, 0.3)", // Stronger shadow on hover
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {camera.camera}
              </Typography>
              <Typography variant="subtitle1">{camera.section}</Typography>
            </CardContent>

            {/* Bottom grayish section */}
            <Box
              sx={{
                backgroundColor: "#d9d9d9",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  color: "black",
                  width: "100%", // Button takes full width
                  // fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  "&:hover": { backgroundColor: "#d9d9d9" }, // Slightly darker hover effect
                }}
                // href={camera.streamUrl}
                href={'https://github.com/victor-cali/ediss_winter_school_hackathon_2025'}
                target="_blank"
                rel="noopener noreferrer"
                
              >
                See the stream
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
