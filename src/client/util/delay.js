// @flow
import { addMinutes, format } from 'date-fns';
import cc from 'classnames';
import React from 'react';

export function delayString(delay?: number = 0) {
  if (delay < 0) {
    return `-${Math.abs(delay)}`;
  }

  return `+${delay}`;
}

export function delayStyle(classes: { delayed: string, early: string }, delay?: number) {
  if (delay == null) return '';
  if (delay > 0) return classes.delayed;

  return classes.early;
}

export function delayTime(
  classes: { delayed: string, early: string, time: string },
  rawTime: ?number,
  delay?: number,
  timeConfig: boolean
) {
  if (!rawTime) {
    return null;
  }
  const time = timeConfig && delay ? addMinutes(rawTime, delay) : rawTime;

  return (
    <div className={cc(classes.time, delayStyle(classes, delay))}>
      <span>{format(time, 'HH:mm')}</span>
      {delay != null && <span>{delayString(delay)}</span>}
    </div>
  );
}