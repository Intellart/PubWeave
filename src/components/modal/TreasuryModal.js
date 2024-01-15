// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
// import { get } from 'lodash';
import type { Article } from '../../store/articleStore';
import UserInfoInput from '../elements/UserInfoInput';

type Props = {
  article: Article,
  onClose: () => void,
};

function TreasuryModal({ article, onClose }: Props): Node {
  const [treasury, setTreasury] = useState({
    totalAmount: '',
    transactionLimit: '',
  });

  return (
    <div className="treasury-modal">
      <p className="treasury-modal-subtitle">Fill treasury from your wallet</p>
      <div className="treasury-modal-form">
        <UserInfoInput
          label="Amount"
          type="number"
          after="ADA"
          value={treasury.totalAmount}
          onClick={(e: any) => {
            setTreasury({
              ...treasury,
              totalAmount: e.target.value,
            });
          }}
        />
        <UserInfoInput
          label="Transaction Limit"
          type="text"
          value={treasury.transactionLimit}
          onClick={(e: any) => {
            setTreasury({
              ...treasury,
              transactionLimit: e.target.value,
            });
          }}
        />
      </div>
      <div className="treasury-modal-buttons">
        <button
          type="button"
          className="confirm-button"
          onClick={() => {
            console.log(article);
            onClose();
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default TreasuryModal;
