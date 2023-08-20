import { useCardano, ConnectWalletList, ConnectWalletButton } from '@cardano-foundation/cardano-connect-with-wallet';
import React from 'react';

function WalletConnector() {
  const {
    // isEnabled,
    isConnected,
    // enabledWallet,
    stakeAddress,
    signMessage,
    connect,
    // disconnect,
  } = useCardano();

  const onConnect = () => alert('Successfully connected!');

  return (
    <>
      <ConnectWalletList
        borderRadius={15}
        gap={12}
        primaryColor="#0538AF"
        onConnect={onConnect}
      />

      <ConnectWalletButton
        message="Please sign Augusta Ada King, Countess of Lovelace"
        onSignMessage={(message) => signMessage(message)}
        onConnect={onConnect}
      />
      { isConnected
        ? <span>{ stakeAddress }</span>
        : (
          <button
            onClick={() => connect(
              'acc_name',
              onConnect,
            )}
          >Connect
          </button>
        )
            }
    </>
  );
}

export default WalletConnector;
