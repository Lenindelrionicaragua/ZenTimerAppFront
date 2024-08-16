import { useState, useRef } from "react";
import { useInterval } from "../hooks/useInterval";
import { useSelector, useDispatch } from "react-redux";
import { setRemainingTime, setInitialTime } from "../actions/counterActions";

function useStopwatch() {
  const initialTime = useSelector(state => state.reducer.initialTime);
  const remainingTime = useSelector(state => state.reducer.remainingTime);

  const dispatch = useDispatch();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);
  const [running, setRunning] = useState(false);

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const startTimer = initialTime => {
    dispatch(setInitialTime(initialTime));
    startTimeRef.current = Date.now();
    setRunning(true);
  };

  const pauseStopwatch = () => {
    pauseTimeRef.current = Date.now();
    setRunning(false);
  };

  const resumeStopwatch = () => {
    if (!running) {
      const now = Date.now();
      totalPausedTimeRef.current += now - pauseTimeRef.current;
      // startTimeRef.current += now - pauseTimeRef.current;
      setRunning(true);
    }
  };

  const updateTime = () => {
    if (running) {
      const now = Date.now();

      const elapsedTime = Math.floor(
        (now - startTimeRef.current - totalPausedTimeRef.current) / 1000
      );

      const remainingTime = Math.max(0, initialTime - elapsedTime);
      setElapsedTime(elapsedTime);
      dispatch(setRemainingTime(remainingTime));

      if (remainingTime === 0) {
        setTimeCompleted(true);
        setRunning(false);
      }
    }
  };

  useInterval(updateTime, running ? 1000 : null);

  return {
    initialTime,
    setInitialTime: newTime => dispatch(setInitialTime(newTime)),
    remainingTime,
    setRemainingTime,
    elapsedTime,
    setElapsedTime,
    timeCompleted,
    setTimeCompleted,
    running,
    setRunning,
    pauseStopwatch,
    resumeStopwatch,
    startTimer
  };
}

export default useStopwatch;
