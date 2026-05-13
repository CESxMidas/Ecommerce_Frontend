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
          <h3 className="font-[700] text-[16px]">
            Categories
          </h3>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col">
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
        className="sidebarAccordion mt-4"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <h3 className="font-[700] text-[16px]">
            Filter By Price
          </h3>
        </AccordionSummary>

        <AccordionDetails>
          <Slider
            defaultValue={[20, 80]}
            valueLabelDisplay="auto"
          />

          <div className="flex justify-between text-white/70 text-sm mt-2">
            <span>$20</span>

            <span>$80</span>
          </div>
        </AccordionDetails>
      </Accordion>
    </aside>
  );
};

export default Sidebar;