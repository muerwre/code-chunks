import { useCallback, useEffect, useRef, useState } from 'react';
import { ITransKey } from '~/i18n';
import { dropObjKey } from '~/utils/fn';

export const useCloseOnEscape = (onRequestClose: () => void, ignore_inputs = true) => {
  const onEscape = useCallback(event => {
    if (event.key !== 'Escape') return;
    if (ignore_inputs && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) return;

    onRequestClose();
  }, [onRequestClose]);

  useEffect(() => {
    window.addEventListener('keyup', onEscape);

    return () => { window.removeEventListener('keyup', onEscape); };
  }, [onEscape]);
};

export const useResetInputErrors = (
  resetAction: (errors: Record<string, ITransKey>) => void,
  data: Record<string, any>,
  errors: Record<string, ITransKey>,
) => {
  Object.keys(data).forEach(field => useEffect(() => {
    if (errors[field]) resetAction(dropObjKey(errors, field));
  }, [data[field]]));
};

export const useDelayedReady = (setReady: (val: boolean) => void, delay: number = 500) => {
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay);

    return () => { if (timer) clearTimeout(timer); };
  });
};
