import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./index.css";

const Sidebar = ({
  categories = [],
  brands = [],
  selectedCategoryIds = [],
  selectedBrands = [],
  priceRange = [0, 100],
  priceBounds = [0, 100],
  onCategoryChange,
  onBrandChange,
  onPriceChange,
}) => {
  const toggleCategory = (categoryId) => {
    if (!onCategoryChange) return;

    const id = String(categoryId);

    if (selectedCategoryIds.includes(id)) {
      onCategoryChange(selectedCategoryIds.filter((item) => item !== id));
    } else {
      onCategoryChange([...selectedCategoryIds, id]);
    }
  };

  const toggleBrand = (brand) => {
    if (!onBrandChange) return;

    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((item) => item !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const renderCategoryOptions = (items, depth = 0) =>
    items.flatMap((category) => [
      <FormControlLabel
        key={category.id}
        className="sidebarCategoryOption"
        style={{ marginLeft: depth * 12 }}
        control={
          <Checkbox
            checked={selectedCategoryIds.includes(String(category.id))}
            onChange={() => toggleCategory(String(category.id))}
          />
        }
        label={
          <span className="sidebarCategoryLabel">
            {category.name}
            {category.productCount > 0 && (
              <em>{category.productCount}</em>
            )}
          </span>
        }
      />,
      ...renderCategoryOptions(category.children || [], depth + 1),
    ]);

  return (
    <aside className="sidebar">
      <Accordion defaultExpanded className="sidebarAccordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3 className="sidebarTitle">Categories</h3>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col gap-1">
            {categories.length === 0 ? (
              <p className="sidebarEmpty">No categories</p>
            ) : (
              renderCategoryOptions(categories)
            )}
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        className="sidebarAccordion sidebarSpacing"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3 className="sidebarTitle">Filter By Price</h3>
        </AccordionSummary>

        <AccordionDetails>
          <Slider
            value={priceRange}
            min={priceBounds[0]}
            max={priceBounds[1]}
            valueLabelDisplay="auto"
            onChange={(_, value) => onPriceChange?.(value)}
          />

          <div className="priceRange">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion className="sidebarAccordion sidebarSpacing">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3 className="sidebarTitle">Brands</h3>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col gap-1">
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                }
                label={brand}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </aside>
  );
};

export default Sidebar;
