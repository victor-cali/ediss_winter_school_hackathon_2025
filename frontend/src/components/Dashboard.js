import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample alerts data
const alerts = [
  {
    id: 1,
    camera: "Camera 1",
    section: "Block A",
    timestamp: "2025-02-26 14:30",
    type: "Hazard",
  },
  {
    id: 2,
    camera: "Camera 2",
    section: "Block B",
    timestamp: "2025-02-26 14:35",
    type: "Normal",
  },
  {
    id: 3,
    camera: "Camera 3",
    section: "Block D",
    timestamp: "2025-02-26 14:40",
    type: "Normal",
  },
  {
    id: 4,
    camera: "Camera 4",
    section: "Block C",
    timestamp: "2025-02-26 14:45",
    type: "Normal",
  },
  {
    id: 5,
    camera: "Camera 5",
    section: "Block E",
    timestamp: "2025-02-26 15:50",
    type: "Hazard",
  },
  {
    id: 6,
    camera: "Camera 6",
    section: "Block D",
    timestamp: "2025-02-27 13:30",
    type: "Normal",
  },
  {
    id: 7,
    camera: "Camera 7",
    section: "Block B",
    timestamp: "2025-02-27 14:35",
    type: "Hazard",
  },
  {
    id: 8,
    camera: "Camera 8",
    section: "Block C",
    timestamp: "2025-02-27 15:40",
    type: "Hazard",
  },
  {
    id: 9,
    camera: "Camera 9",
    section: "Block C",
    timestamp: "2025-02-27 18:45",
    type: "Normal",
  },
  {
    id: 10,
    camera: "Camera 10",
    section: "Block A",
    timestamp: "2025-02-27 20:50",
    type: "Hazard",
  },
];

// 📊 Bar Chart Data (Alert Trends Over Time)
const alertTrends = [
  { time: "2025-02-26 14:30", Hazard: 1, Normal: 0 },
  { time: "2025-02-26 14:35", Hazard: 0, Normal: 2 },
  { time: "2025-02-26 14:40", Hazard: 1, Normal: 1 },
  { time: "2025-02-26 14:45", Hazard: 0, Normal: 3 },
  { time: "2025-02-26 15:50", Hazard: 0, Normal: 2 },
  { time: "2025-02-27 13:30", Hazard: 1, Normal: 0 },
  { time: "2025-02-27 14:35", Hazard: 0, Normal: 1 },
  { time: "2025-02-27 15:40", Hazard: 0, Normal: 2 },
  { time: "2025-02-27 18:45", Hazard: 1, Normal: 1 },
  { time: "2025-02-27 20:50", Hazard: 0, Normal: 0 },
];

// 📊 Pie Chart Data (Alert Type Distribution)
const alertCounts = [
  { name: "Normal", value: 5 },
  { name: "Hazard", value: 4 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Dashboard() {
  return (
    <Box p={3}>
      <Box flex={3}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Box>
      {/* 📌 Alerts Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#559c8b" }}>
              <TableCell sx={{ color: "white" }}>Camera</TableCell>
              <TableCell sx={{ color: "white" }}>Section</TableCell>
              <TableCell sx={{ color: "white" }}>Timestamp</TableCell>
              <TableCell sx={{ color: "white" }}>Alert Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.camera}</TableCell>
                <TableCell>{alert.section}</TableCell>
                <TableCell>{alert.timestamp}</TableCell>
                <TableCell>{alert.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        {/* 📊 Bar Chart - Alerts Over Time */}
        <Paper sx={{ padding: 2, width: 500 }}>
          <Typography variant="h6" align="center">
            Alert Trends Over Time
          </Typography>
          <BarChart width={450} height={300} data={alertTrends}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Normal" fill="#0088FE" />
            <Bar dataKey="Hazard" fill="#00C49F" />
            {/* <Bar dataKey="No Vest" fill="#FFBB28" /> */}
          </BarChart>
        </Paper>

        {/* 📊 Pie Chart - Alert Type Distribution */}
        <Paper sx={{ padding: 2, width: 400 }}>
          <Typography variant="h6" align="center">
            Alert Type Distribution
          </Typography>
          <PieChart width={400} height={300}>
            <Pie
              data={alertCounts}
              cx={200}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {alertCounts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Paper>
      </Box>
    </Box>
  );
}
