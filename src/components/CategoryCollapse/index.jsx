// CategoryCollapse.jsx

import { useState } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import "./index.css";

const CategoryCollapse = ({
  title,
  icon,
  items,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="categoryCollapse">
      {/* MAIN */}
      <ListItemButton
        className="category-item"
        onClick={() => setOpen(!open)}
      >
        {icon}

        <ListItemText primary={title} />

        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      {/* SUB */}
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit>
        <List disablePadding>
          {items.map((item, index) => (
            <ListItemButton
              key={index}
              className="subcategory-item"
            >
              {item.icon}

              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default CategoryCollapse;