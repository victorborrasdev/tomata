import React, {useEffect, useState} from 'react';
import styles from './Timer.module.css'
import {Button} from '../button/Button';

const SEQUENCE = [25, 5];
const WORK_TIME = 25;
const REST_TIME = 5;

const WORK_STATE = 'work'
const REST_STATE = 'rest'

const TIMES = {
  [WORK_STATE]: WORK_TIME,
  [REST_STATE]: REST_TIME
}

function Timer() {
  const [currentState, setCurrentState] = useState(WORK_STATE);
  const [delta, setDelta] = useState(TIMES[currentState] * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (delta > 0 && isActive) {
      const interval = setInterval(() => {
        setDelta(delta - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [delta, isActive]);

  useEffect(() => {
    if (delta === 0 && isActive) {
      setIsActive(false);
      setCurrentState(currentState === WORK_STATE ? REST_STATE : WORK_STATE);
    }
  }, [delta, isActive]);

  useEffect(() => {
    setDelta(TIMES[currentState] * 60)
  }, [currentState])

  useEffect(() => {
    if (delta === 0) {
      const audio = new Audio(require('../../assets/alarm.mp3'))
      audio.play()
    }
  }, [delta])

  const secondsDifference = (Math.floor(delta % 60)).toString()
      .padStart(2, '0');
  const minutesDifference = (Math.floor(delta / 60)).toString()
      .padStart(2, '0');

  return (
      <div className={styles.timer}>
        <h1 data-testid="countdown" className={styles.countdown}>
          {`${minutesDifference}:${secondsDifference}`}
        </h1>
        {isActive && <Button data-testid="pause-button"
                             onClick={() => setIsActive(false)}>
          Pause
        </Button>}
        {!isActive && <Button data-testid="activation-button"
                              onClick={() => setIsActive(true)}>
          Start
        </Button>}
      </div>
  );
}

export default Timer;