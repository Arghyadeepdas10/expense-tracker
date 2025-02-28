"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { ThemeContext } from "@/Theme/Theme";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Link from "next/link";

interface Setting {
  label: string;
  action: string | (() => void);
}

const pages = ["products"];
const settings = [
  { label: "Account", action: () => (window.location.href = "/account") },
  { label: "Logout", action: "/auth/signout" },
];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);


  const { toggleTheme, theme } = React.useContext(ThemeContext)!;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="sticky" sx={{ boxShadow: "0px 0px 5px blue", backgroundImage:"url('/images/dash.jpg')", backgroundSize:"cover", backgroundPosition:"right"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <CurrencyExchangeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Expense Tracker
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link href={`/${page.toLowerCase()}`} passHref>
                    <Typography textAlign="center">{page}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>


          {/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link href={`/${page.toLowerCase()}`} key={page} passHref>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box> */}

          
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
            <IconButton onClick={toggleTheme} aria-label="toggle theme">
              {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) =>
                  setting.label === "Logout" ? (
                    <form
                      key={setting.label}
                      action={typeof setting.action === "string" ? setting.action : undefined}
                      method="post"
                      style={{ display: "inline" }}
                    >
                      <MenuItem onClick={handleCloseUserMenu}>
                        <button
                          type="submit"
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            cursor: "pointer",
                            color: "inherit",
                          }}
                        >
                          <Typography textAlign="center">{setting.label}</Typography>
                        </button>
                      </MenuItem>
                    </form>
                  ) : (
                    <MenuItem
                      key={setting.label}
                      onClick={() => {
                        if (typeof setting.action === "function") {
                          setting.action();
                        }
                        handleCloseUserMenu();
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Typography
                        textAlign="center"
                        sx={{
                          fontWeight: 500,
                          color: "primary", 
                        }}
                      >
                        {setting.label}
                      </Typography>
                    </MenuItem>
                  )
                )}
              </Menu>
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
