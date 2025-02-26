import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

export default function Dashboard() {
  return (
    <Box display="flex" p={3}>
      <Box flex={3}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Box>
    </Box>
  );
}
