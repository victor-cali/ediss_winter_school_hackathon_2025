import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Modal,
  Button,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SampleImg from "../assets/sample.jpg";
import TuneIcon from "@mui/icons-material/Tune";

const initialAlerts = [
  {
    id: 1,
    camera: 3,
    section: 4,
    status: "active",
    timestamp: "2024-02-26 12:30",
    annotations: "Anomaly detected",
    deviceId: "D123",
  },
  {
    id: 2,
    camera: 6,
    section: 2,
    status: "active",
    timestamp: "2024-02-25 15:45",
    annotations: "False positive",
    deviceId: "D456",
  },
  {
    id: 3,
    camera: 7,
    section: 5,
    status: "active",
    timestamp: "2024-02-26 09:10",
    annotations: "Checked manually",
    deviceId: "D789",
  },
  {
    id: 4,
    camera: 6,
    section: 1,
    status: "active",
    timestamp: "2024-02-26 14:00",
    annotations: "Movement detected",
    deviceId: "D321",
  },
  {
    id: 5,
    camera: 9,
    section: 6,
    status: "active",
    timestamp: "2024-02-26 12:30",
    annotations: "Anomaly detected",
    deviceId: "D123",
  },
  {
    id: 6,
    camera: 2,
    section: 9,
    status: "active",
    timestamp: "2024-02-25 15:45",
    annotations: "False positive",
    deviceId: "D456",
  },
  {
    id: 7,
    camera: 4,
    section: 5,
    status: "active",
    timestamp: "2024-02-26 09:10",
    annotations: "Checked manually",
    deviceId: "D789",
  },
  {
    id: 8,
    camera: 7,
    section: 4,
    status: "active",
    timestamp: "2024-02-26 14:00",
    annotations: "Movement detected",
    deviceId: "D321",
  },
  {
    id: 9,
    camera: 3,
    section: 5,
    status: "active",
    timestamp: "2024-02-26 12:30",
    annotations: "Anomaly detected",
    deviceId: "D123",
  },
  {
    id: 10,
    camera: 4,
    section: 9,
    status: "active",
    timestamp: "2024-02-25 15:45",
    annotations: "False positive",
    deviceId: "D456",
  },
  {
    id: 11,
    camera: 1,
    section: 1,
    status: "active",
    timestamp: "2024-02-26 09:10",
    annotations: "Checked manually",
    deviceId: "D789",
  },
  {
    id: 12,
    camera: 9,
    section: 1,
    status: "active",
    timestamp: "2024-02-26 14:00",
    annotations: "Movement detected",
    deviceId: "D321",
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cameraFilter, setCameraFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

  const handleResolve = () => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === selectedAlert.id ? { ...alert, status: "resolved" } : alert
      )
    );
    setSelectedAlert(null);
  };

  const filteredAlerts = alerts.filter((alert) => {
    return (
      (statusFilter === "all" || alert.status === statusFilter) &&
      (cameraFilter === "all" || alert.camera === cameraFilter) &&
      (sectionFilter === "all" || alert.section === sectionFilter)
    );
  });

  return (
    <Box display="flex" p={3}>
      <Box flex={3}>
        <Typography variant="h4" gutterBottom>
          Alerts
        </Typography>
        <List>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <ListItem button onClick={() => handleAlertClick(alert)}>
                  <ListItemIcon>
                    {alert.status === "active" ? (
                      <WarningIcon sx={{ color: "red" }} />
                    ) : (
                      <CheckCircleIcon sx={{ color: "green" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`Alert #${alert.id}. Camera ${alert.camera}. Section ${alert.section}.`}
                    sx={{ color: alert.status === "active" ? "red" : "blue" }}
                  />
                  <Box>
                    <ListItemText
                      primary={"Posted 10 min ago"}
                      sx={{ color: "gray" }}
                    />
                  </Box>
                </ListItem>
                {index < filteredAlerts.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Typography sx={{ color: "gray", mt: 2 }}>
              No alerts found.
            </Typography>
          )}
        </List>
      </Box>

      {/* Filters */}
      <Box flex={1} ml={3} sx={{ borderLeft: "1px solid lightgray", pl: 3 }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyItems={"center"}
          mb={2}
          gap={1}
        >
          <Typography variant="h5">Filters</Typography>
          <TuneIcon
            sx={{
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </Box>
        <Typography variant="subtitle1">Status</Typography>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(event, newValue) => setStatusFilter(newValue || "all")}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="active" sx={{ color: "red" }}>
            Active
          </ToggleButton>
          <ToggleButton value="resolved" sx={{ color: "green" }}>
            Resolved
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Camera</Typography>
          <Select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {[...new Set(alerts.map((alert) => alert.camera))].map((camera) => (
              <MenuItem key={camera} value={camera}>
                Camera {camera}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Typography variant="subtitle1">Section</Typography>
          <Select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {[...new Set(alerts.map((alert) => alert.section))].map(
              (section) => (
                <MenuItem key={section} value={section}>
                  Section {section}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Box>

      {/* Modal */}
      <Modal
        open={!!selectedAlert}
        onClose={handleCloseModal}
        sx={{ borderRadius: 50 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            // height: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          {selectedAlert && (
            <>
              <Box
                bgcolor={"#559c8b"}
                p={2}
                display={"flex"}
                justifyContent={"center"}
                color={"white"}
                sx={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
              >
                <Typography variant="h4">Alert #{selectedAlert.id}</Typography>
              </Box>
              <Box
                mt={1}
                p={4}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ width: "80%" }}>
                  {/* <Typography variant="h4" sx={{ color: "blue", mb: 2 }}>
                    Alerts Details
                  </Typography> */}
                  <Typography>
                    <strong>Camera:</strong> {selectedAlert.camera}
                  </Typography>
                  <Typography>
                    <strong>Section:</strong> {selectedAlert.section}
                  </Typography>
                  <Typography>
                    <strong>Timestamp:</strong> {selectedAlert.timestamp}
                  </Typography>
                  <Typography>
                    <strong>Annotations:</strong> {selectedAlert.annotations}
                  </Typography>
                  <Typography>
                    <strong>Device ID:</strong> {selectedAlert.deviceId}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {selectedAlert.status}
                  </Typography>
                </Box>
                <Box>
                  <img
                    src={SampleImg}
                    alt="Alert"
                    width="100%"
                    style={{ borderRadius: 5 }}
                  />
                </Box>
              </Box>
              <Box mt={2} mb={4} display="flex" justifyContent="flex-start">
                <Box
                  display="flex"
                  justifyContent={"center"}
                  gap={2}
                  sx={{ alignSelf: "center", width: "100%", height: 50 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseModal}
                    // sx={{borderRadius: 50}}
                    sx={{
                      backgroundColor: "#d9d9d9",
                      color: "white",
                      borderRadius: "10px",
                      fontWeight: 600,
                      width: "200px",
                      "&:hover": {
                        // backgroundColor: "#4a897a", // Slightly darker green on hover
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Soft shadow effect
                        transform: "scale(1.05)", // Slight size increase
                      },
                    }}
                  >
                    Close
                  </Button>

                  {selectedAlert.status === "active" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleResolve}
                      // sx={{borderRadius: 50}}
                      sx={{
                        backgroundColor: "#559c8b",
                        color: "white",
                        borderRadius: "10px",
                        fontWeight: 600,
                        width: "200px",
                        "&:hover": {
                          // backgroundColor: "#4a897a", // Slightly darker green on hover
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Soft shadow effect
                          transform: "scale(1.05)", // Slight size increase
                        },
                      }}
                    >
                      Resolve
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
