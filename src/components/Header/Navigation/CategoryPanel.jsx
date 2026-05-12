import { useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import FolderIcon from "@mui/icons-material/Folder";
import GamesIcon from "@mui/icons-material/SportsEsports";
import WindowIcon from "@mui/icons-material/Window";
import SecurityIcon from "@mui/icons-material/Security";
import AppsIcon from "@mui/icons-material/Apps";
import LaptopIcon from "@mui/icons-material/Laptop";
import CodeIcon from "@mui/icons-material/Code";
import MovieIcon from "@mui/icons-material/Movie";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import StorageIcon from "@mui/icons-material/Storage";
import CloudIcon from "@mui/icons-material/Cloud";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BrushIcon from "@mui/icons-material/Brush";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import "./CategoryPanel.css";

const CategoryPanel = ({ open, toggleDrawer }) => {
  const [menus, setMenus] = useState({
    games: false,
    software: true,
    multimedia: false,
    developer: false,
    mobile: false,
  });

  const toggleMenu = (menu) => {
    setMenus({
      ...menus,
      [menu]: !menus[menu],
    });
  };

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box className="category-panel">
        <div className="category-title">Categories</div>

        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

          {/* GAMES */}
          <ListItemButton
            className="category-item"
            onClick={() => toggleMenu("games")}
          >
            <GamesIcon className="category-icon" />

            <ListItemText primary="Games" />

            {menus.games ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={menus.games} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="Action Games" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="RPG Games" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="Strategy Games" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="FPS Games" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="Online Multiplayer" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* SOFTWARE */}
          <ListItemButton
            className="category-item"
            onClick={() => toggleMenu("software")}
          >
            <FolderIcon className="category-icon" />

            <ListItemText primary="Software" />

            {menus.software ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={menus.software} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton className="subcategory-item">
                <WindowIcon className="category-icon-small" />
                <ListItemText primary="Windows Tools" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <SecurityIcon className="category-icon-small" />
                <ListItemText primary="Antivirus" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <AppsIcon className="category-icon-small" />
                <ListItemText primary="Office Apps" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <LaptopIcon className="category-icon-small" />
                <ListItemText primary="System Utilities" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <StorageIcon className="category-icon-small" />
                <ListItemText primary="Backup & Recovery" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <CloudIcon className="category-icon-small" />
                <ListItemText primary="Cloud Sync" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* MULTIMEDIA */}
          <ListItemButton
            className="category-item"
            onClick={() => toggleMenu("multimedia")}
          >
            <MovieIcon className="category-icon" />

            <ListItemText primary="Multimedia" />

            {menus.multimedia ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={menus.multimedia} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton className="subcategory-item">
                <MovieIcon className="category-icon-small" />
                <ListItemText primary="Video Editors" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <MusicNoteIcon className="category-icon-small" />
                <ListItemText primary="Audio Tools" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <BrushIcon className="category-icon-small" />
                <ListItemText primary="Graphic Design" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <CameraAltIcon className="category-icon-small" />
                <ListItemText primary="Photo Editors" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* DEVELOPER */}
          <ListItemButton
            className="category-item"
            onClick={() => toggleMenu("developer")}
          >
            <CodeIcon className="category-icon" />

            <ListItemText primary="Developer Tools" />

            {menus.developer ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={menus.developer} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="VS Code Extensions" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="Terminal Tools" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="Git Clients" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="API Testing" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* MOBILE */}
          <ListItemButton
            className="category-item"
            onClick={() => toggleMenu("mobile")}
          >
            <PhoneAndroidIcon className="category-icon" />

            <ListItemText primary="Mobile Apps" />

            {menus.mobile ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={menus.mobile} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="Android Apps" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="iOS Apps" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="APK Downloads" />
              </ListItemButton>

              <ListItemButton className="subcategory-item">
                <ListItemText primary="Mobile Security" />
              </ListItemButton>

            </List>
          </Collapse>

          <Divider sx={{ marginY: 1.5, opacity: 0.2 }} />

          {/* EXTRA MENU */}
          <ListItemButton className="category-item">
            <ListItemText primary="🔥 Trending Downloads" />
          </ListItemButton>

          <ListItemButton className="category-item">
            <ListItemText primary="⭐ Top Rated Software" />
          </ListItemButton>

          <ListItemButton className="category-item">
            <ListItemText primary="🆕 New Releases" />
          </ListItemButton>

          <ListItemButton className="category-item">
            <ListItemText primary="🎁 Free Tools" />
          </ListItemButton>

        </List>
      </Box>
    </Drawer>
  );
};

export default CategoryPanel;