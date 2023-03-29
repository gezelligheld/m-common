import { useEffect, useRef } from 'react';

const useUnmount = (fn: (...args: any) => void) => {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(
    () => () => {
      fnRef.current();
    },
    [],
  );
};

export default useUnmount;
