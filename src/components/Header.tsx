import * as React from "react";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

export default function Header() {
  const navigate = useNavigate();
  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header>
      <div id="app-name-logo" onClick={handleNavigateToDashboard}>
        <img src="/logo.png" alt="logo" />
        <h3>Real-Time Stock Market</h3>
      </div>
      <Button
        id="hamburger-menu"
        aria-controls={open ? "hamburger-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleShowMenu}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="hamburger-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "hamburger-menu",
        }}
      >
        <MenuItem onClick={handleClose}>Summarizer</MenuItem>
        <MenuItem onClick={handleClose}>My Portfolio</MenuItem>
      </Menu>
      <div id="header-buttons">
        <button>Summarizer</button>
        <button>My Portfolio</button>
      </div>
    </header>
  );
}
