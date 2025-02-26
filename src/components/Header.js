import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import LogoImg from "../assets/logo.png";
import { Button } from "@mui/material";

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

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const activeAlerts = React.useMemo(
    () => initialAlerts.filter((alert) => alert.status === "active"),
    []
  ).length;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          color="inherit"
          onClick={() => navigate("/cameras")}
        >
          <Badge color="error">
            <CameraAltIcon />
          </Badge>
        </IconButton>
        <p>Real-time feed</p>
      </MenuItem>
      <MenuItem onClick={() => console.log("clickedd")}>
        <IconButton
          size="large"
          aria-label={`show ${activeAlerts} new notifications`}
          color="inherit"
          onClick={() => navigate("/alerts")}
        >
          <Badge badgeContent={activeAlerts} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          onClick={() => navigate("/dashboard")}
        >
          <BarChartIcon />
        </IconButton>
        <p>Dashboard</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#559c8b",
          height: 80,
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <img src={LogoImg} alt="PPE Manager Logo" style={{ height: 50 }} />
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Tooltip
              title={
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Real-time Feed
                </span>
              }
              arrow
            >
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                onClick={() => navigate("/cameras")}
              >
                <Badge color="error">
                  <CameraAltIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {/* <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                borderColor: "white",
                borderWidth: "1px",
                padding: "8px 16px",
                color: "white",
                "&:hover": {
                  backgroundColor: "#d9d9d9",
                  color: "black",
                  borderColor: "black",
                },
              }}
              onClick={() => navigate("/cameras")}
              // title="Real-time Stream"
            >
              Real-time Stream {'\t'}<CameraAltIcon color="white"/>
            </Button> */}

            <Tooltip
              title={
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Notifications
                </span>
              }
              arrow
            >
              <IconButton
                size="large"
                aria-label={`show ${activeAlerts} new notifications`}
                color="inherit"
                onClick={() => navigate("/alerts")}
              >
                <Badge badgeContent={activeAlerts} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Dashboard
                </span>
              }
              arrow
            >
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                // onClick={handleProfileMenuOpen}
                color="inherit"
                onClick={() => navigate("/dashboard")}
              >
                <BarChartIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
