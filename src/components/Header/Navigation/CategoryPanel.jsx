import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import "./CategoryPanel.css";

const CategoryPanel = ({ open, toggleDrawer }) => {
  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box className="category-panel">
        <div className="category-title">Categories</div>

        <List sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {["Games", "Software", "Antivirus", "Windows", "Office"].map(
            (text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton className="category-item">
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ),
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default CategoryPanel;
