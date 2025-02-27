import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TuneIcon from "@mui/icons-material/Tune";
import { useMqtt } from "../hooks/mqtt"; // Assuming useMqtt is already handling MQTT logic

const initialAlerts = [
  // {
  //   ip_address: "127.0.1.1",
  //   timestamp: "2025-02-27T11:55:21.200775",
  //   camera_sector: "Sector B",
  //   status: "normal",
  //   image: "", // Placeholder for image, you can integrate dynamic data here
  // },
  // {
  //   ip_address: "127.0.1.1",
  //   timestamp: "2025-02-27T11:55:21.200775",
  //   camera_sector: "Sector A",
  //   status: "normal",
  //   image: "",
  // },
  // Add more mock data as needed for initial rendering
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cameraFilter, setCameraFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const { message, isConnected } = useMqtt(); // message contains the new alert data

  useEffect(() => {
    if (message) {
      // Assuming `message` is an object with the structure of an alert
      setAlerts((prevAlerts) => [...prevAlerts, { ...JSON.parse(message), id: prevAlerts.length }]);
    }
  }, [message]); // This effect runs whenever a new message is received

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

  const filteredAlerts = alerts.filter((alert) => {
    return (
      (statusFilter === "all" || alert.status === statusFilter) &&
      (cameraFilter === "all" || alert.camera_sector === cameraFilter)
    );
  });

  return (
    <Box display="flex" p={3}>
      <Box flex={3.5}>
        <Typography variant="h4" gutterBottom>
          Alerts
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Icon</strong></TableCell>
                <TableCell><strong>Number</strong></TableCell>
                <TableCell><strong>IP Address</strong></TableCell>
                <TableCell><strong>Camera Sector</strong></TableCell>
                <TableCell><strong>Timestamp</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => {
                  const isHazard = alert.status === "hazard";
                  return (
                    <TableRow
                      key={alert.id}
                      hover
                      onClick={() => handleAlertClick(alert)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: isHazard ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 128, 0, 0.2)",
                        borderBottom: "2px solid white",
                      }}
                    >
                      <TableCell>
                        <IconButton>
                          {isHazard ? (
                            <WarningIcon sx={{ color: "red" }} />
                          ) : (
                            <CheckCircleIcon sx={{ color: "green" }} />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{`Alert #${alert.id}`}</TableCell>
                      <TableCell>{alert.ip_address}</TableCell>
                      <TableCell>{alert.camera_sector}</TableCell>
                      <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography sx={{ color: "gray", mt: 2 }}>No alerts found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Filters */}
      <Box flex={1} ml={3} sx={{ borderLeft: "1px solid lightgray", pl: 3 }}>
        <Box display="flex" alignItems="center" justifyItems="center" mb={2} gap={1}>
          <Typography variant="h5">Filters</Typography>
          <TuneIcon sx={{ alignSelf: "center", justifyContent: "center", alignItems: "center" }} />
        </Box>

        {/* Status Filter */}
        <Typography variant="subtitle1">Status</Typography>
        {/* <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="hazard">Hazard</MenuItem>
          </Select>
        </FormControl> */}
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(event, newValue) => setStatusFilter(newValue || "all")}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="hazard" sx={{ color: "red" }}>
            Hazard
          </ToggleButton>
          <ToggleButton value="normal" sx={{ color: "green" }}>
            Normal
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Camera Sector Filter */}
        <Typography variant="subtitle1">Camera Sector</Typography>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Camera Sector</InputLabel>
          <Select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
            label="Camera Sector"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Sector A">Sector A</MenuItem>
            <MenuItem value="Sector B">Sector B</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Modal for alert details */}
      <Modal open={!!selectedAlert} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          {selectedAlert && (
            <>
              <Box bgcolor={"#559c8b"} p={2} display={"flex"} justifyContent={"center"} color={"white"}>
                <Typography variant="h4">Alert {selectedAlert.id + 1}</Typography>
              </Box>
              <Box mt={1} p={4}>
                <Typography>
                  <strong>Camera Sector:</strong> {selectedAlert.camera_sector}
                </Typography>
                <Typography>
                  <strong>Timestamp:</strong> {selectedAlert.timestamp}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {selectedAlert.status}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
