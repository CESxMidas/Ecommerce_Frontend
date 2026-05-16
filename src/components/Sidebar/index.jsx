/* Sidebar/index.jsx */

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

const Sidebar = () => {
  return (
    <aside className="sidebar">

      {/* CATEGORY */}
      <Accordion
        defaultExpanded
        className="sidebarAccordion"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <h3 className="sidebarTitle">
            Categories
          </h3>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col gap-1">

            <FormControlLabel
              control={<Checkbox />}
              label="Windows"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Office"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Games"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Antivirus"
            />

          </div>
        </AccordionDetails>
      </Accordion>

      {/* PRICE */}
      <Accordion
        defaultExpanded
        className="sidebarAccordion sidebarSpacing"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <h3 className="sidebarTitle">
            Filter By Price
          </h3>
        </AccordionSummary>

        <AccordionDetails>

          <Slider
            defaultValue={[20, 80]}
            valueLabelDisplay="auto"
          />

          <div className="priceRange">
            <span>$20</span>

            <span>$80</span>
          </div>

        </AccordionDetails>
      </Accordion>

      {/* BRANDS */}
      <Accordion
        className="sidebarAccordion sidebarSpacing"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <h3 className="sidebarTitle">
            Brands
          </h3>
        </AccordionSummary>

        <AccordionDetails>

          <div className="flex flex-col gap-1">

            <FormControlLabel
              control={<Checkbox />}
              label="Microsoft"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Adobe"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Steam"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Riot Games"
            />

          </div>

        </AccordionDetails>
      </Accordion>

      {/* RATING */}
      <Accordion
        className="sidebarAccordion sidebarSpacing"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <h3 className="sidebarTitle">
            Rating
          </h3>
        </AccordionSummary>

        <AccordionDetails>

          <div className="flex flex-col gap-1">

            <FormControlLabel
              control={<Checkbox />}
              label="5 Stars"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="4 Stars & Up"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="3 Stars & Up"
            />

          </div>

        </AccordionDetails>
      </Accordion>

    </aside>
  );
};

export default Sidebar;