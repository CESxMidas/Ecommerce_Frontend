import CategoryCollapse from "../../CategoryCollapse";

import "./CategoryPanel.css";

import {
  FaGamepad,
  FaWindows,
  FaShieldAlt,
  FaCode,
} from "react-icons/fa";

const categoryData = [
  {
    title: "Games",

    icon: <FaGamepad className="category-icon" />,

    items: [
      {
        label: "Action Games",
      },

      {
        label: "RPG Games",
      },

      {
        label: "FPS Games",
      },
    ],
  },

  {
    title: "Software",

    icon: <FaWindows className="category-icon" />,

    items: [
      {
        label: "Windows Tools",

        icon: (
          <FaWindows className="category-icon-small" />
        ),
      },

      {
        label: "Antivirus",

        icon: (
          <FaShieldAlt className="category-icon-small" />
        ),
      },
    ],
  },

  {
    title: "Developer Tools",

    icon: <FaCode className="category-icon" />,

    items: [
      {
        label: "VS Code Extensions",
      },

      {
        label: "Git Clients",
      },
    ],
  },
];

const CategoryPanel = () => {
  return (
    <div className="categoryPanel">

      {/* HEADING */}
      <div className="categoryPanelHeading">
        <h3>All Categories</h3>

        <span>
          Browse all collections
        </span>
      </div>

      {/* BODY */}
      <div className="categoryPanelWrapper">
        {categoryData.map((item, index) => (
          <CategoryCollapse
            key={index}
            title={item.title}
            icon={item.icon}
            items={item.items}
          />
        ))}
      </div>

    </div>
  );
};

export default CategoryPanel;