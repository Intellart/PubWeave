/* eslint-disable no-import-assign */
import * as redux from 'redux';
import { chainActionsMiddleware, configureStore } from '.';
import axios from '../api/axios';

const dispatchedActions = [];
let store = null;

const flushPromises = () => new Promise(process.nextTick);
const mockAction = () => ({ type: 'TEST_ACTION' });
const mockActionWithPromise = () => ({ type: 'TEST_ACTION', payload: axios.get() });

describe('promiseMiddleware', () => {
  beforeEach(() => {
    dispatchedActions.length = 0;
    store = configureStore({}, null, dispatchedActions);
  });

  test('will add pending suffix for payloads that are promises', () => {
    jest.spyOn(axios, 'get').mockRejectedValue();
    store.dispatch(mockActionWithPromise());
    expect(dispatchedActions.includes('TEST_ACTION_PENDING')).toBeTruthy();
  });

  test('will not add pending suffix for payloads that are not promises', () => {
    store.dispatch(mockAction());
    expect(dispatchedActions.includes('TEST_ACTION_PENDING')).toBeFalsy();
  });

  test('will pass on action for for payloads that are not promises', () => {
    store.dispatch(mockAction());
    expect(dispatchedActions.includes('TEST_ACTION')).toBeTruthy();
  });

  test('will add rejected suffix on rejected promises', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue();
    store.dispatch(mockActionWithPromise());
    await flushPromises();
    expect(dispatchedActions.includes('TEST_ACTION_REJECTED')).toBeTruthy();
  });

  test('will add fulfilled on resolved promises', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue();
    store.dispatch(mockActionWithPromise());
    await flushPromises();
    expect(dispatchedActions.includes('TEST_ACTION_FULFILLED')).toBeTruthy();
  });
});

const mockedDispatch = jest.fn();

describe('chainActionsMiddleware', () => {
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  test('is not included in store middleware if actionChain object is not passed', () => {
    const mockedApplyMiddleware = jest.fn();
    redux.applyMiddleware = mockedApplyMiddleware;
    configureStore({});
    const applyMiddlewareArgumentsSize = mockedApplyMiddleware.mock.calls[0].length;
    expect(applyMiddlewareArgumentsSize).not.toBeGreaterThan(2);
  });

  test('is included in store middleware if actionChain object is passed', () => {
    const mockedApplyMiddleware = jest.fn();
    redux.applyMiddleware = mockedApplyMiddleware;
    configureStore({}, { TEST: 'TEST' });
    const applyMiddlewareArgumentsSize = mockedApplyMiddleware.mock.calls[0].length;
    expect(applyMiddlewareArgumentsSize).toBeGreaterThan(2);
  });

  test('dispatches action (when string) set in actionChain object', () => {
    chainActionsMiddleware({ ACTION_ONE: 'ACTION_TO_FOLLOW_ACTION_ONE' })({ dispatch: mockedDispatch })(() => {})({ type: 'ACTION_ONE' });
    expect(mockedDispatch).toHaveBeenCalledWith({ type: 'ACTION_TO_FOLLOW_ACTION_ONE' });
  });

  test('dispatches action (when object) set in actionChain object', () => {
    chainActionsMiddleware({ ACTION_ONE: () => ({ type: 'ACTION_TO_FOLLOW_ACTION_ONE', payload: 'Dummy' }) })({ dispatch: mockedDispatch })(() => {})({ type: 'ACTION_ONE' });
    expect(mockedDispatch).toHaveBeenCalledWith({ type: 'ACTION_TO_FOLLOW_ACTION_ONE', payload: 'Dummy' });
  });

  test('dispatches actions (when array) set in actionChain object', () => {
    chainActionsMiddleware({
      ACTION_ONE: [
        () => ({ type: 'FIRST_ACTION_TO_FOLLOW_ACTION_ONE', payload: 'Dummy' }),
        () => ({ type: 'SECOND_ACTION_TO_FOLLOW_ACTION_ONE', payload: 'Dummy' }),
        'THIRD_ACTION_TO_FOLLOW_ACTION_ONE',
      ],
    })({ dispatch: mockedDispatch })(() => {})({ type: 'ACTION_ONE' });
    expect(mockedDispatch.mock.calls[0][0]).toEqual({ type: 'FIRST_ACTION_TO_FOLLOW_ACTION_ONE', payload: 'Dummy' });
    expect(mockedDispatch.mock.calls[1][0]).toEqual({ type: 'SECOND_ACTION_TO_FOLLOW_ACTION_ONE', payload: 'Dummy' });
    expect(mockedDispatch.mock.calls[2][0]).toEqual({ type: 'THIRD_ACTION_TO_FOLLOW_ACTION_ONE' });
  });
});
