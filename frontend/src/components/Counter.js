// components/Counter.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../actions/counterActions';

const Counter = () => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.value);

  return (
    <div>
      <p>
        Clicked: <span id="value">{value}</span> times
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </p>
    </div>
  );
};

export default Counter;
