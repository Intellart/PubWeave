import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { findIndex, map } from "lodash";

export type StepType = {
  label: string;
  error?: boolean;
  errorMessage: string;
};

type Props = {
  steps: Array<StepType>;
};

function Conditions({ steps }: Props) {
  const firstFailedStepIndex = findIndex(steps, (step) => step.error);

  return (
    <Stepper
      alternativeLabel
      activeStep={
        firstFailedStepIndex > -1 ? firstFailedStepIndex : steps.length
      }
    >
      {map(steps, (step, index) => {
        const labelProps: {
          optional?: React$Node;
          error?: boolean;
        } = {};
        if (firstFailedStepIndex > -1 && index === firstFailedStepIndex) {
          labelProps.optional = (
            <Typography variant="caption" color="error">
              {steps[firstFailedStepIndex].errorMessage}
            </Typography>
          );
          labelProps.error = true;
        }

        return (
          <Step key={step.label}>
            <StepLabel {...labelProps}>{step.label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

export default Conditions;
