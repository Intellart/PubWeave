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
  treasuryProps?: any,
};

function TreasuryModal({ onClose, treasuryProps }: Props): Node {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const [treasury, setTreasury] = useState({
    totalAmount: treasuryProps?.totalAmount || '',
    transactionLimit: '',
  });

  useEffect(() => {
    setTreasury({
      totalAmount: treasuryProps?.totalAmount || '',
      transactionLimit: '',
    });
  }, [treasuryProps]);

  const txId = useSelector((state) => selectors.getTxID(state));
  const signature = useSelector((state) => selectors.getSignature(state));
  const txIDFulfilled = useSelector((state) => selectors.getTxIDFulfilled(state));

  const dispatch = useDispatch();
  const fillTreasury = (payload: any) => dispatch(actions.fillTreasury(payload));
  const spendTreasury = (payload: any) => dispatch(actions.spendTreasury(payload));
  const saveSignedMessage = (signature_: string) => dispatch(actions.signMessage(signature_));
  const submitMessage = (signature_: string, tx: string, articleId: number) => dispatch(actions.submitMessage(signature_, tx, articleId));
  const submitSpendMessage = (signature_: string, tx: string, articleId: number) => dispatch(actions.submitSpendMessage(signature_, tx, articleId));

  // const networkType = process.env.REACT_APP_CARDANO_NETWORK_TYPE || 'testnet';

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

  // const {
  //   // isEnabled,
  //   // isConnected,
  //   // enabledWallet,
  //   // stakeAddress,
  //   // accountBalance,
  //   // signMessage,
  //   // usedAddresses,
  //   // enabledWallet,
  //   // installedExtensions,
  //   // connect,
  //   // disconnect,
  //   // connectedCip45Wallet,
  // } = useCardano({
  //   limitNetwork: networkType,
  // });

  const errorList = {
    isEmpty: 'isEmpty',
    lessThanZero: 'lessThanZero',
    greaterThanMax: 'greaterThanMax',
    transactionLimit: 'transactionLimit',
  };

  const errors = {
    [errorList.lessThanZero]: {
      isError: (value: number) => value < 0,
      message: 'Amount must be greater than 0',
    },
    [errorList.greaterThanMax]: {
      isError: (value: number) => value > 100,
      message: 'Amount must be less than 100',
    },
    [errorList.transactionLimit]: {
      isError: (value: number) => value > (treasury.totalAmount || 0) * 0.5,
      message: 'Transaction limit is too high',
    },
  };

  const amountOfReviews = treasuryProps?.amountOfReviews || 0;

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
      description: `The treasury is a smart contract that holds ADA 
      and. You can fill the treasury with ADA from your wallet.`,
      step: (
        <>
          <Input
            error={!isAmountValid}
            label="Total Amount"
            helperText={getError(treasury.totalAmount, amountErrors) || 'Total amount of ADA to be sent to the treasury'}
            type='number'
            readOnly={amountOfReviews > 0}
            currency='₳'
            value={treasury.totalAmount}
            onChange={(newValue: string) => {
              setTreasury({
                ...treasury,
                totalAmount: toNumber(newValue),
              });
            }}
          />

          {!amountOfReviews && (
          <Input
            label="Transaction Limit"
            error={!isTransactionLimitValid}
            helperText={getError(treasury.transactionLimit, transactionLimitErrors) || 'Maximum amount of ADA to be sent in a single transaction'}
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
          )}
          {amountOfReviews > 0 && (
          <Typography variant="caption" color="error">
            You are paying to {amountOfReviews} reviewers. You cannot change the amount.
          </Typography>
          )}
        </>
      ),
      nextText: 'Send',
      isValid: treasury.totalAmount
      && isAmountValid
      && ((treasury.transactionLimit
      && isTransactionLimitValid) || amountOfReviews > 0),
    },
    {
      label: 'Recieved transaction ID',
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
        if (amountOfReviews > 0) {
          spendTreasury({
            article: {
              total_amount: treasury.totalAmount,
              transaction_limit: treasury.transactionLimit,
              article_id: id,
              price_cap: 500,
            },
          });

          break;
        }
        fillTreasury({
          article: {
            total_amount: treasury.totalAmount,
            transaction_limit: treasury.transactionLimit,
            article_id: id,
            price_cap: 500,
          },
        });
        break;
      case 1:
        console.log('Signing message... ', txId);
        window.cardano.signTx(txId).then((signature_: string) => {
        // signMessage(txId, (signature_: string, key_: string | void) => {
          console.log('Message signed', signature_);
          saveSignedMessage(signature_);
        });
        break;
      case 2:
        console.log('Submitting message... ', signature);
        if (amountOfReviews > 0) {
          submitSpendMessage(signature, txId, id);
          break;
        }
        submitMessage(signature, txId, id);
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
