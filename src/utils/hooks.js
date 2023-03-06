// @flow
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  every,
  get,
  includes,
  isEqual,
  size,
} from 'lodash';
import { useInView } from 'react-intersection-observer';

export const regex: Object = {
  specialChars: /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
  numbers: /[0-9]/,
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const checks = ({
  empty: {
    check: (value: string): bool => size(value) > 0,
    info: 'Cannot be empty',
  },
  maxlength: {
    check: (value: string): bool => size(value) < 30,
    info: 'Cannot be longer than 30 characters',
  },
  special: {
    check: (value: string): bool => !regex.specialChars.test(value),
    info: 'Cannot contain special characters',
  },
  space: {
    check: (value: string): bool => !includes(value, ' '),
    info: 'Cannot contain spaces',
  },
  number: {
    check: (value: string): bool => !regex.numbers.test(value),
    info: 'Cannot contain numbers',
  },
  email: {
    check: (value: string): bool => regex.email.test(value),
    info: 'Invalid email',
  },
});

export const usernameChecks = [
  checks.empty,
  checks.maxlength,
  checks.space,
  checks.special,
];

export const nameChecks = [
  checks.empty,
  checks.maxlength,
  checks.number,
  checks.special,
];

export const emailChecks = [
  checks.empty,
  checks.email,
];

export const isProdEnv = process.env.NODE_ENV === 'production';

export const buildRedirectLink = (path: string): string => window.location.origin + path;

export const orcidOAuthLink = (path: string): string => {
  const baseURL = isProdEnv ? 'https://orcid.org' : 'https://sandbox.orcid.org';
  const clientId = get(process.env, 'REACT_APP_ORCID_CLIENT_ID', '');

  return `${baseURL}/oauth/authorize?client_id=${clientId}&response_type=code&scope=/authenticate&redirect_uri=${buildRedirectLink(path)}`;
};

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

function MultipleObserver({ children, onView }: any): any {
  const { ref, inView } = useInView({ threshold: 0.6 });

  // if ref is in view, call the onView function
  useEffect(() => {
    if (inView) {
      onView();
    }
  }, [inView, onView]);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}

export default MultipleObserver;

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

/*
uploadImage(file).then((res) => {
  console.log('upl img', res);
});
*/
export async function uploadImage (file: File): Promise<string> {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '');
  data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '');

  const response = await fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || ''}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || ''}/image/upload`, {
    method: 'post',
    body: data,
  }).then((res) => res.json());

  return response.url;
}
