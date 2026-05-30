import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CategoryCollapse from "../../CategoryCollapse";
import { fetchCategories } from "../../../services/categoryService";
import { getCategoryIcon } from "../../../utils/categoryUtils";

import "./CategoryPanel.css";

const CategoryPanel = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setCategories([]);
          setError(loadError.message || "Không tải được danh mục");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleNavigate = () => {
    onNavigate?.();
  };

  return (
    <div className="categoryPanel">
      <div className="categoryPanelHeading">
        <h3>All Categories</h3>
        <span>Browse collections by category</span>
      </div>

      <div className="categoryPanelQuick">
        <Link
          to="/productListing"
          className="categoryPanelQuickLink"
          onClick={handleNavigate}
        >
          View all products
        </Link>
      </div>

      <div className="categoryPanelWrapper">
        {loading && (
          <p className="categoryPanelStatus">Loading categories...</p>
        )}

        {!loading && error && (
          <p className="categoryPanelStatus categoryPanelStatus--error">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          categories.map((category) => (
            <CategoryCollapse
              key={category.id}
              title={`${category.name}${
                category.productCount > 0
                  ? ` (${category.productCount})`
                  : ""
              }`}
              icon={getCategoryIcon(category.icon)}
              items={[
                {
                  ...category,
                  label: `All ${category.name}`,
                  name: `All ${category.name}`,
                  icon: getCategoryIcon(
                    category.icon,
                    "category-icon-small"
                  ),
                },
                ...(category.children || []).map((child) => ({
                  ...child,
                  label: child.name,
                  icon: getCategoryIcon(
                    child.icon,
                    "category-icon-small"
                  ),
                })),
              ]}
              onNavigate={handleNavigate}
            />
          ))}
      </div>
    </div>
  );
};

export default CategoryPanel;
