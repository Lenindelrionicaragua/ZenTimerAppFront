import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useStopwatch from "../../hooks/useStopwatch";
import useInfoText from "../../hooks/useInfoText";
import {
  setActivityIndex,
  setIsRunning,
  setHasStarted,
  setFirstRun,
  setRemainingTime,
  setInitialTime,
  setTimeCompleted
} from "../../actions/counterActions";

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true, // Needed to use default export
  default: jest.fn()
}));

const store = createStore(rootReducer);

const wrapper = ({ children }) => (
  <Provider store={createStore(rootReducer)}>{children}</Provider>
);

describe("useStopwatchScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should call setInfoTextWithTimeout with correct arguments when handleNoActivityNoTime is called", () => {
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      activityIndex: { activityIndex: null },
      initialTime: 300,
      remainingTime: 300
    };

    const store = createStore(rootReducer, initialState);

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleNoActivityNoTime();
    });

    expect(updateInfoText).toHaveBeenCalledWith(
      "Default time and activity selected."
    );

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should call setInfoTextWithTimeout with correct arguments when handleActivityNoTime is called", () => {
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      activityIndex: { activityIndex: null },
      initialTime: { initialTime: 300 },
      remainingTime: { remainingTime: 300 },
      isRunning: { isRunning: false },
      firstRun: { firstRun: false },
      hasStarted: { hasStarted: false }
    };

    const store = createStore(rootReducer, initialState);

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleActivityNoTime();
    });

    expect(updateInfoText).toHaveBeenCalledWith("Default time selected.");

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should call updateInfoText with correct arguments when handleNoActivityTime is called", () => {
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      activityIndex: { activityIndex: null },
      initialTime: 300,
      remainingTime: 0
    };

    const store = createStore(rootReducer, initialState);

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleNoActivityTime();
    });

    expect(updateInfoText).toHaveBeenCalledWith("Default activity selected.");

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should call setIsRunning, setFirsRun and setHasStarted with TRUE, when ActivityTime is called", () => {
    const dispatch = jest.fn();
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      activityIndex: { activityIndex: null },
      initialTime: { initialTime: 300 },
      remainingTime: { remainingTime: 300 },
      isRunning: { isRunning: false },
      firstRun: { firstRun: false },
      hasStarted: { hasStarted: false }
    };

    const store = createStore(rootReducer, initialState);

    const dispatchSpy = jest.spyOn(store, "dispatch");

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleActivityTime();
    });

    expect(store.dispatch).toHaveBeenNthCalledWith(3, setFirstRun(true));
    expect(store.dispatch).toHaveBeenNthCalledWith(4, setHasStarted(true));

    act(() => {
      jest.advanceTimersByTime(5000);
    });
  });
});
