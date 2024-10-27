import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import workflow from "../../assets/images/how-it-works/workflow.png";
import reviewsWorkflow from "../../assets/images/how-it-works/review-workflow.png";

type Props = {
  type: "article" | "review";
};

function HowItWorks({ type }: Props) {
  return (
    <Accordion
      disableGutters
      sx={{
        maxWidth: "max(50%, 1000px)",
        borderRadius: "10px !important",
        "&:before": {
          display: "none",
        },
        backgroundColor: "#f1f1f1",
        color: "#797979",
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<GridExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        How it works
      </AccordionSummary>
      <AccordionDetails>
        <img
          src={type === "article" ? workflow : reviewsWorkflow}
          alt="workflow"
        />
      </AccordionDetails>
    </Accordion>
  );
}

export default HowItWorks;
