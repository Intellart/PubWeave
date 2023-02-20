import {
  Button, Modal, Step, StepContent, StepLabel, Stepper, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import steps1 from '../../assets/images/gifs/steps1.gif';
import steps2 from '../../assets/images/gifs/steps2.gif';
import steps3 from '../../assets/images/gifs/steps3.gif';
import steps4 from '../../assets/images/gifs/steps4.gif';

type Props = {
  open: boolean,
  onClose: Function,
  onFinished: Function,
};

function TutorialModal (props: Props): Node {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: 'Create a descriptive article title',
      description: '',
      image: steps1,
    },
    {
      label: 'Add category and tags',
      description:
        'Add categories and tags to your article to make it easier for readers to find.',
      image: steps2,
    },
    {
      label: 'Edit your text',
      description: 'Select text to edit it. You can change the font, mark it as a heading, or add a link.',
      image: steps3,
    },
    {
      label: 'Add images, videos, tables, equations, and more',
      description: 'Click the plus button to add a block. You can add images, videos, tables, equations, and more.',
      image: steps4,
    },

  ];

  useEffect(() => {
    if (activeStep === steps.length) {
      props.onFinished();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  return (
    <Modal
      open={props.open}
      onClose={() => props.onClose()}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Box sx={{
        maxWidth: 400,
        bgcolor: 'rgb(255, 255, 255)',
        padding: 2,
        boxShadow: 24,
        borderRadius: 5,
      }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <img
                  src={step.image}
                  alt={step.label}
                  style={{ width: '100%' }}
                />
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Modal>
  );
}

export default TutorialModal;
