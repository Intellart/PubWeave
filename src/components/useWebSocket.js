// @flow
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { createConsumer } from '@rails/actioncable';
import { secondsToMilliseconds } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEqual } from 'lodash';
import { actions } from '../store/articleStore';
import { selectors } from '../store/userStore';
// import { actions } from '../store/eventStore';

export type MessagePayload = {
    type: string,
    method: string,
    data: any,
    states: string,
};

type Props = {
  articleId: number,
  enabled: boolean,
};

function useWebSocket({ articleId, enabled = false }: Props): any {
  const user = useSelector((state) => selectors.getUser(state), isEqual);

  const connectionStatus = useRef('awaiting');

  // console.log('isAdmin', isAdmin);

  const dispatch = useDispatch();
  const wsUpdateBlock = (payload: any) => dispatch(actions.wsUpdateBlock(payload, user.id));
  const wsCreateBlock = (payload: any) => dispatch(actions.wsCreateBlock(payload, user.id));
  const wsRemoveBlock = (payload: any) => dispatch(actions.wsRemoveBlock(payload, user.id));
  const wsLockBlock = (payload: any) => dispatch(actions.wsLockBlock(payload));
  const wsUnlockBlock = (payload: any) => dispatch(actions.wsUnlockBlock(payload));

  // const createReservation = (/* reservation: Reservation, userRole:string */) => dispatch(/* actions.wsCreateReservation(reservation, userRole) */);
  // const changeStateReservation = (
  //   /* reservation: Reservation,
  //   beforeState: string,
  //   afterState: string, */
  // ) => dispatch(/* actions.wsChangeStateReservation(reservation, beforeState, afterState, props.userRole) */);

  const status = {
    awaiting: 'awaiting',
    connected: 'connected',
    disconnected: 'disconnected',
  };

  const messageTypes = {
    section: 'section',
  };

  const messageActions = {
    update: 'update',
    create: 'create',
    destroy: 'destroy',
    lock: 'lock',
    unlock: 'unlock',
  };

  const consumer = useRef(createConsumer(
    (process.env.REACT_APP_DEV_BACKEND || 'http://localhost:3000').replace('http', 'ws') + `/cable${get(user, 'email') ? '?id=' + get(user, 'email') : ''}`));

  useEffect(() => {
    if (!articleId || !enabled) return;

    consumer.current.subscriptions.create({
      channel: 'ArticleChannel',
      user_email: user.email,
      article_id: articleId,
    }, {
      received(payload) {
        // eslint-disable-next-line no-console
        console.log('payload', payload);
        switch (payload.type) {
          case messageTypes.section:
            switch (payload.method) {
              case messageActions.update:
                // console.log('payload', payload.data);
                wsUpdateBlock(payload.data);
                break;
              case messageActions.create:
                wsCreateBlock(payload.data);
                break;
              case messageActions.destroy:
                wsRemoveBlock(payload.data);
                break;
              case messageActions.lock:
                wsLockBlock(payload.data);
                break;
              case messageActions.unlock:
                wsUnlockBlock(payload.data);
                break;
              default:
                break;
            }
            break;
            // case messageTypes.reservation:
            //   if (payload.method === messageActions.create) {
            //     createReservation(/* payload.data */ /* props.userRole */);
            //   } else if (payload.method === messageActions.transition) {
            //   //   const [before, after] = payload.states.split(' -> ');
            //   //   const beforeState = statusNames[before];
            //   //   const afterState = statusNames[after];

          //     changeStateReservation(/* payload.data */ /* beforeState, afterState */);
          //   }
          //   break;
          default:
            break;
        }
      },
    });

    const intervalId = setInterval(() => {
      const connected = !consumer.current?.connection.disconnected;

      if (connected && (connectionStatus.current === status.awaiting || connectionStatus.current === status.disconnected)) {
        connectionStatus.current = status.connected;
        // toast.success('ActionCable connected');
        // eslint-disable-next-line no-console
        console.log('WebSocket connection established');
      }

      if (!connected && connectionStatus.current === status.connected) {
        connectionStatus.current = status.disconnected;
        // toast.error(<Error error={{
        //   response: {
        //     status: 500,
        //     statusText: t('errors.action_cable.title'),
        //     data: {
        //       Error: [t('errors.action_cable.summary')],
        //     },
        //   },
        // }}
        // />);
        toast.error('WebSocket connection lost');
      }
    }, secondsToMilliseconds(5));

    return () => {
      clearInterval(intervalId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      consumer.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, enabled]);
}

export default useWebSocket;
