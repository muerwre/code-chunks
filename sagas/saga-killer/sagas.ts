// Runs saga on RUN_SAGA, but kills it on CANCEL_ALL
import { call, race, take, takeLatest, fork } from 'redux-saga/effects';

export function* sagaKiller(saga, actions, killer) {
  yield takeLatest(actions, function* (...args) {
    yield race({
      task: call(saga, ...args),
      cancel: take(killer),
    });
  });
}

function* mainSaga() {
  yield fork(sagaKiller, workerSaga, ACTIONS.RUN_SAGA, ACTIONS.CANCEL_ALL);
}
