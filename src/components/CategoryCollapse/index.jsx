import { useState } from "react";
import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { getCategoryListingUrl } from "../../utils/categoryUtils";

import "./index.css";

const CategoryCollapse = ({
  title,
  icon,
  items = [],
  defaultOpen = true,
  onNavigate,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleNavigate = () => {
    onNavigate?.();
  };

  return (
    <div className="categoryCollapse">
      <ListItemButton
        className="category-item"
        onClick={() => setOpen(!open)}
      >
        {icon}

        <ListItemText primary={title} />

        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {items.map((item) => (
            <ListItemButton
              key={item.id || item.slug || item.label}
              className="subcategory-item"
              component={Link}
              to={getCategoryListingUrl(item)}
              onClick={handleNavigate}
            >
              {item.icon}

              <ListItemText
                primary={item.label || item.name}
                secondary={
                  item.productCount != null
                    ? `${item.productCount} products`
                    : undefined
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default CategoryCollapse;
