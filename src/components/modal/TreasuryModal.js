// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
// import { get } from 'lodash';
// import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box, Button, Chip, Paper, Step, StepContent, StepLabel, Stepper, Typography,
} from '@mui/material';
import {
  find, toNumber, truncate,
} from 'lodash';
// import type { Article } from '../../store/articleStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { actions, selectors } from '../../store/cardanoStore';
import Input from '../elements/Input';

type Props = {
  onClose: () => void,
  type: 'fill' | 'spend',
};

function TreasuryModal({ onClose, type }: Props): Node {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const [treasury, setTreasury] = useState({
    totalAmount: '',
    transactionLimit: '',
  });

  const txId = useSelector((state) => selectors.getTxID(state));
  const signature = useSelector((state) => selectors.getSignature(state));
  const txIDFulfilled = useSelector((state) => selectors.getTxIDFulfilled(state));
  const witnessSet = useSelector((state) => selectors.getWitnessSet(state));

  const dispatch = useDispatch();
  const buildFill = (payload: any) => dispatch(actions.buildFill(payload));
  const buildSpend = (payload: any) => dispatch(actions.buildSpend(payload));
  const saveSignedMessage = (signature_: string) => dispatch(actions.signMessage(signature_));
  const sumbitFill = (signature_: string, tx: string, articleId: number) => dispatch(actions.sumbitFill(signature_, tx, articleId));
  const submitSpend = (signature_: string, tx: string, articleId: number, ws: string) => dispatch(actions.submitSpend(signature_, tx, articleId, ws));
  const clearTx = () => dispatch(actions.clearTx());

  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  console.log('txIDFulfilled', txIDFulfilled);

  useEffect(() => {
    if (txId) {
      setNextButtonDisabled(false);
      setActiveStep(1);
    }
  }, [txId]);

  useEffect(() => {
    if (txIDFulfilled) {
      // refresh page with this as param
      setSearchParams({ tx: txIDFulfilled });
      clearTx();
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txIDFulfilled]);

  useEffect(() => {
    if (signature) {
      setNextButtonDisabled(false);
      setActiveStep(2);
    }
  }, [signature]);

  const errorList = {
    isEmpty: 'isEmpty',
    lessThanZero: 'lessThanZero',
    greaterThanMax: 'greaterThanMax',
    transactionLimit: 'transactionLimit',
  };

  const errors = {
    [errorList.lessThanZero]: {
      isError: (value: number) => (value < 1) && (value !== ''),
      message: 'Amount must be greater or equal to 1',
    },
    [errorList.greaterThanMax]: {
      isError: (value: number) => value > 1000,
      message: 'Amount must be at most 1000',
    },
    [errorList.transactionLimit]: {
      isError: (value: number) => value < (treasury.totalAmount || 0),
      message: 'Transaction limit cannot be lower than total amount',
    },
  };

  const amountErrors = [errorList.lessThanZero, errorList.greaterThanMax];
  const transactionLimitErrors = [errorList.lessThanZero, errorList.greaterThanMax, errorList.transactionLimit];

  const getError = (value: number | null | string, errorsList: Array<string>) => {
    const error = find(errorsList, (errorName: string) => errors[errorName].isError(value));

    return error ? errors[error].message : '';
  };

  const isAmountValid = !getError(treasury.totalAmount, amountErrors);
  const isTransactionLimitValid = !getError(treasury.transactionLimit, transactionLimitErrors);

  const steps = [
    {
      label: 'Input amount and transaction limit',
      description: `The treasury is a smart contract that holds ADA.
      You can fill the treasury with ADA from your wallet.`,
      step: (type === 'fill') ? (
        <>
          <Input
            error={!isAmountValid}
            label="Total Amount"
            helperText={getError(treasury.totalAmount, amountErrors) || 'Total ADA amount to be sent to the treasury'}
            type='number'
            currency='₳'
            value={treasury.totalAmount}
            onChange={(newValue: string) => {
              setTreasury({
                ...treasury,
                totalAmount: toNumber(newValue),
              });
            }}
          />
          <Input
            label="Transaction Limit"
            error={!isTransactionLimitValid}
            helperText={getError(treasury.transactionLimit, transactionLimitErrors) || 'Max ADA to be sent in one transaction (if in doubt enter same value in both cells)'}
            type='number'
            currency='₳'
            value={treasury.transactionLimit}
            onChange={(newValue: string) => {
              setTreasury({
                ...treasury,
                transactionLimit: toNumber(newValue),
              });
            }}
          />
        </>
      ) : (

        <Typography variant="caption" color="error">
          You are paying to selected reviewers. You cannot change the amount.
        </Typography>
      ),
      nextText: 'Send',
      isValid: type === 'spend' || (
        treasury.totalAmount
      && isAmountValid
      && treasury.transactionLimit
      && isTransactionLimitValid),
    },
    {
      label: 'Received transaction ID',
      description:
      'You now have a transaction ID. You can use this to sign the transaction.',
      step: (<Chip
        label={txId}
        variant="default"
        color="primary"
      />),
      nextText: 'Sign',
      isValid: true,
    },
    {
      label: 'Send signed transaction',
      description: 'You can now send the signed transaction to the blockchain.',
      step: (
        <Chip
          label={truncate(signature, { length: 15 })}
          variant="default"
          color="primary"
          avatar={<FontAwesomeIcon icon={faPaperPlane} />}
        />),
      nextText: 'Send',
      isValid: true,

    },
  ];

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleNext = () => {
    setNextButtonDisabled(true);

    switch (activeStep) {
      case 0:
        if (type === 'fill') {
          const fillPayload = {
            article: {
              total_amount: treasury.totalAmount,
              transaction_limit: treasury.transactionLimit,
              price_cap: 500,
              article_id: id,
            },
          };
          buildFill(fillPayload);
          break;
        } else {
          const spendPayload = {
            article: {
              article_id: id,
            },
          };
          buildSpend(spendPayload);
          break;
        }

      case 1:
        if (type === 'spend') {
          console.log('Signing message... ', txId);
          window.cardano.signTx(txId, true).then((signature_: string) => {
            console.log('Message signed', signature_);
            saveSignedMessage(signature_);
          });
        } else {
          console.log('Signing message... ', txId);
          window.cardano.signTx(txId).then((signature_: string) => {
            console.log('Message signed', signature_);
            saveSignedMessage(signature_);
          });
        }
        break;

      case 2:
        console.log('Submitting message... ', signature);
        if (type === 'spend') {
          submitSpend(signature, txId, id, witnessSet);
        } else {
          sumbitFill(signature, txId, id);
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="treasury-modal">
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
      >
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
              <Box sx={{
                mt: 2,
                mb: 2,
                display: 'flex',
                gap: '1rem',
              }}
              >
                {step.step}
              </Box>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={nextButtonDisabled || !step.isValid}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : step.nextText}
                  </Button>
                  {/* <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button> */}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}

export default TreasuryModal;
