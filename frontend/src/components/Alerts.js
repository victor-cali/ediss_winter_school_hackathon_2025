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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SampleImg from "../assets/sample.jpg";
import TuneIcon from "@mui/icons-material/Tune";
import tmp from "../assets/example.json";

const initialAlerts = [
  {
    ip_address: "127.0.1.1",
    timestamp: "2025-02-27T11:55:21.200775",
    camera_sector: "Sector B",
    status: "normal", //hazard
    image: `data:image/png;base64,${tmp.image}`,
    // id: 1,
    // camera: 3,
    // section: 4,
    // status: "active",
    // timestamp: "2024-02-26 12:30",
    // annotations: "Anomaly detected",
    // deviceId: "D123",
  },
  // {
  //   ip_address: '123',
  //   timestamp: '2024-02-25 15:45',
  //   camera_sector: '1',
  //   status: 'Active',
  //   image: '',
  // },
  {
    ip_address: "127.0.1.1",
    timestamp: "2025-02-27T11:55:21.200775",
    camera_sector: "Sector A",
    status: "normal", //hazard
    image: `data:image/png;base64,${tmp.image}`,
  },
  {
    ip_address: "127.0.1.1",
    timestamp: "2025-02-27T11:55:21.200775",
    camera_sector: "Sector A",
    status: "normal", //hazard
    image: `data:image/png;base64,${tmp.image}`,
  },
  {
    ip_address: "127.0.1.1",
    timestamp: "2025-02-27T11:55:21.200775",
    camera_sector: "Sector C",
    status: "normal", //hazard
    image: `data:image/png;base64,${tmp.image}`,
  },
  {
    ip_address: "127.0.1.1",
    timestamp: "2025-02-27T11:55:21.200775",
    camera_sector: "Sector A",
    status: "normal", //hazard
    image: `data:image/png;base64,${tmp.image}`,
  },
  {
    ip_address: "127.0.1.1",
    timestamp: "2025-02-27T11:55:21.200775",
    camera_sector: "Sector A",
    status: "hazard", //hazard
    image: `data:image/png;base64,${tmp.image}`,
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(
    initialAlerts.map((alert, index) => ({
      ...alert,
      id: index, // Assign a unique ID
    }))
  );
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
        alert.id === selectedAlert.id ? { ...alert, status: "hazard" } : alert
      )
    );
    setSelectedAlert(null);
  };

  const filteredAlerts = alerts.filter((alert) => {
    return (
      (statusFilter === "all" || alert.status === statusFilter) &&
      (cameraFilter === "all" || alert.camera_sector === cameraFilter)
      // && (sectionFilter === "all" || alert.section === sectionFilter)
    );
  });

  return (
    <Box display="flex" p={3}>
      <Box flex={3.5}>
        <Typography variant="h4" gutterBottom>
          Alerts
        </Typography>
        {/* <List>
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
                    primary={`Alert #${alert.id}. Camera ${alert.camera_sector}. Section ${alert.section}.`}
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
        </List> */}
            <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong></strong></TableCell> {/* For the Icon */}
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
                  mb={1}
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
                <Typography sx={{ color: "gray", mt: 2 }}>
                  No alerts found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
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
          <ToggleButton value="hazard" sx={{ color: "red" }}>
            Hazard
          </ToggleButton>
          <ToggleButton value="normal" sx={{ color: "green" }}>
            Normal
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Camera Sector</Typography>
          <Select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {[...new Set(alerts.map((alert) => alert.camera_sector))].map(
              (camera) => (
                <MenuItem key={camera} value={camera}>
                  Camera {camera}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        {/* <FormControl fullWidth>
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
        </FormControl> */}
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
                <Typography variant="h4">
                  Alert {selectedAlert.id + 1}
                </Typography>
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
                <Box sx={{ width: "80%", alignItems: "space-between", height: '350px' }}>
                  <Box mb={27}>
                  {/* <Typography variant="h4" sx={{ color: "blue", mb: 2 }}>
                    Alerts Details
                  </Typography> */}
                  <Typography>
                    <strong>Camera Sector:</strong> {selectedAlert.camera_sector}
                  </Typography>
                  {/* <Typography>
                    <strong>Section:</strong> {selectedAlert.section}
                  </Typography> */}
                  <Typography>
                    <strong>Timestamp:</strong> {selectedAlert.timestamp}
                  </Typography>
                  {/* <Typography>
                    <strong>Annotations:</strong> {selectedAlert.annotations}
                  </Typography>
                  <Typography>
                    <strong>Device ID:</strong> {selectedAlert.deviceId}
                  </Typography> */}
                  <Typography>
                    <strong>Status:</strong> {selectedAlert.status}
                  </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseModal}
                    // sx={{borderRadius: 50}}
                    mt={3}
                    sx={{
                      backgroundColor: "#559c8b",
                      color: "white",
                      borderRadius: "10px",
                      fontWeight: 600,
                      width: "200px",
                      // alignSelf: "flex-end",
                      height: "50px",
                      "&:hover": {
                        // backgroundColor: "#4a897a", // Slightly darker green on hover
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Soft shadow effect
                        transform: "scale(1.05)", // Slight size increase
                      },
                    }}
                  >
                    Close
                  </Button>
                </Box>
                <Box>
                  <img
                    src={`data:image/png;base64,${tmp.image}`}
                    alt="Alert"
                    width="100%"
                    style={{ borderRadius: 5 }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
