import React, { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@mdi/react";
import {
  mdiArrowUpBold,
  mdiArrowDownBold,
  mdiPlay,
  mdiPause,
  mdiRepeat,
} from "@mdi/js";
import "./styles.css";

const beepSrc =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

export default function PomodoroClock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerType, setTimerType] = useState("Session");
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [timer, setTimer] = useState(25 * 60);

  const beepRef = useRef(null);

  const handleIncrement = (e) => {
    const value = e.target.value;

    if (value === "break") {
      if (breakLength < 60 && !isTimerRunning) {
      setBreakLength(breakLength + 1);}
    }

    if (value === "session") {
      if (sessionLength < 60 && !isTimerRunning) {
      setSessionLength(sessionLength + 1);
      setTimer(sessionLength * 60 + 60);
    }}
  };

  const handleDecrement = (e) => {
    const value = e.target.value;

    if (value === "break") {
      if (breakLength > 1 && !isTimerRunning) {
      setBreakLength(breakLength - 1);
    }}

    if (value === "session") {
      if (sessionLength > 1 && !isTimerRunning) {
      setSessionLength(sessionLength - 1);
      setTimer(sessionLength * 60 - 60);}
    }
  };

  const convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${minutes}:${seconds}`;
  };

  const handlePausePlay = () => {
    if (isTimerRunning) {
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
    }
  };

  const handleSwitch = useCallback(() => {
    if (timerType === "Session") {
      setTimerType("Break");
      setTimer(breakLength * 60);
    } else if (timer === "Break") {
      setTimerType("Session");
      setTimer(sessionLength * 60);
    }
  }, [timerType, timer, breakLength, sessionLength]);

  useEffect(() => {
    let countdown = null;
    if (isTimerRunning && timer > 0) {
      countdown = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (isTimerRunning && timer === 0) {
      countdown = setInterval(() => {
        setTimer(timerType === "Break" ? sessionLength * 60 : breakLength * 60);
        setTimerType(timerType === "Break" ? 'Session' : 'Break')
      }, 1000);
      beepRef.current.play();
      handleSwitch();
    } else {
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [
    isTimerRunning,
    timerType,
    timer,
    breakLength,
    sessionLength,
    handleSwitch,
  ]);

  const HandleTimerReset = () => {
    setSessionLength(25);
    setBreakLength(5);
    setTimerRunning(false);
    setTimerType("Session");
    setTimer(25 * 60);
  };

  return (
    <div className="App">
      <main className="pomodoro">
        <h1 className="App-title">Pomodoro Clock</h1>
        <div className="container">
          <div className="break-wrapper">
            <h4 id="break-label">Break Length</h4>
            <div className="controls">
              <button
                className="btn"
                id="break-decrement"
                value="break"
                onClick={handleDecrement}
              >
                <Icon
                  path={mdiArrowDownBold}
                  title="Decrease Break Timer"
                  size={0.75}
                />
              </button>
              <span id="break-length">{breakLength}</span>
              <button
                className="btn"
                value="break"
                id="break-increment"
                onClick={handleIncrement}
              >
                <Icon
                  path={mdiArrowUpBold}
                  title="Increase Break Timer"
                  size={0.75}
                />
              </button>
            </div>
          </div>
          <div className="session-wrapper">
            <h4 id="session-label">Session Length</h4>
            <div className="controls">
              <button
                className="btn"
                id="session-decrement"
                value="session"
                onClick={handleDecrement}
              >
                <Icon
                  path={mdiArrowDownBold}
                  title="Decrease Session Timer"
                  size={0.75}
                />
              </button>
              <span id="session-length">{sessionLength}</span>
              <button
                className="btn"
                value="session"
                id="session-increment"
                onClick={handleIncrement}
              >
                <Icon
                  path={mdiArrowUpBold}
                  title="Increase Session Timer"
                  size={0.75}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="timer-wrapper">
          <h4 id="timer-label">{timerType}</h4>
          <h1 id="time-left">{convertToTime(timer)}</h1>
        </div>
        <div className="controls">
          <button className="btn" id="start_stop" onClick={handlePausePlay}>
            { isTimerRunning ? <Icon path={mdiPause} title="Start Timer" size={0.8} /> : <Icon path={mdiPlay} title="Start Timer" size={0.8} />}
          </button>
          <button className="btn" id="reset" onClick={HandleTimerReset}>
            <Icon path={mdiRepeat} title="Reset Timer" size={0.8} />
          </button>
        </div>
      </main>
      <audio id="beep" preload="auto" src={beepSrc} ref={beepRef} />
    </div>
  );
}
