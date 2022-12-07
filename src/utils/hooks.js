// @flow
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { every, isEqual } from 'lodash';

export const useScreenSize = (): Object => {
  const tabletQuery = window.matchMedia('(max-width: 991px)');
  const mobileQuery = window.matchMedia('(max-width: 769px)');
  const [screenSize, setScreenSize] = useState({
    isTablet: tabletQuery.matches,
    isMobile: mobileQuery.matches,
  });

  useEffect(() => {
    const handler = () => {
      setScreenSize({
        isTablet: tabletQuery.matches,
        isMobile: mobileQuery.matches,
      });
    };

    tabletQuery.addEventListener('change', handler);
    mobileQuery.addEventListener('change', handler);

    return () => {
      tabletQuery.removeEventListener('change', handler);
      mobileQuery.removeEventListener('change', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isDesktop: !screenSize.isTablet && !screenSize.isMobile,
    isTablet: screenSize.isTablet,
    isMobile: screenSize.isMobile,
  };
};

export const useLocationInfo = (): Object => {
  const location = useLocation();

  return {
    currentRoute: location.pathname,
  };
};

export const useDebounce = (value: any, delay: number = 500): any => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedState = (defaultValue: any, onDebounceChange: Function, delay: number = 500): any => {
  const [inputVal, setInputVal] = useState(defaultValue);
  const debouncedValue = useDebounce(inputVal, delay);
  const refValue = useRef(debouncedValue);

  useEffect(() => {
    if (!isEqual(refValue.current, debouncedValue)) {
      refValue.current = debouncedValue;
      onDebounceChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return [
    inputVal,
    setInputVal,
  ];
};

export const useOutsideClickEffect = (
  callback: Function,
  refs: Array<any>,
) => {
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (every(refs, (ref: any) => !ref?.current?.contains(e.target))) {
        callback(e);
      }
    };

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [callback, refs]);
};

export const useScrollTopEffect = () => {
  const locationInfo = useLocationInfo();

  useEffect(() => {
    document.querySelector('.scroll-wrapper')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [locationInfo.currentRoute]);
};
