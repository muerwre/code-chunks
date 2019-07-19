import React, { FC, ReactChild, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { IInputTextProps } from '~/redux/types';
import * as styles from './styles.scss';
import { InputText } from '~/components/inputs/InputText';
import Popper, { Placement } from 'popper.js';

type IProps = IInputTextProps & {
  placement?: Placement;
  children?: ReactChild;
  show_on_focus?: boolean;
};

const InputWithPopper: FC<IProps> = ({
                                       placement = 'auto-start',
                                       children = null,
                                       show_on_focus = true,
                                       ...props
                                     }) => {
  const wrapper = useRef(null);
  const popper = useRef(null);
  const [input, setInput] = useState(null);
  const [minWidth, setMinWidth] = useState(0);
  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => {
    setFocused(true);
    window.removeEventListener('mousedown', onOuterClick);
    window.addEventListener('mousedown', onOuterClick);
  }, [setFocused, input]);

  const onOuterClick = event => {
    if (popper.current.contains(event.target) || wrapper.current.contains(event.target)) {
      if (input && input.focus) setTimeout(() => input.focus(), 0);
      return;
    }

    setFocused(false);
    window.removeEventListener('mousedown', onOuterClick);
  };

  useEffect(() => () => window.removeEventListener('mousedown', onOuterClick), []);
  useEffect(() => {
    console.log({ wrapper, popper });
    if (!wrapper.current || !popper.current) return;
    setMinWidth(wrapper.current.getBoundingClientRect().width);

    const pop = new Popper(wrapper.current, popper.current, {
      placement,
      positionFixed: true,
      modifiers: {
        offset: {
          enabled: true,
          offset: '0, -1',
        },
      },
    });

    return () => pop.destroy();
  }, [wrapper, popper, placement, focused, children]);

  return (
    <div className={styles.wrap} ref={wrapper}>
      <InputText
        onFocusCapture={onFocus}
        // onBlurCapture={onBlur}
        onRef={setInput}
        {...props}
      />
      {
        ReactDOM.createPortal(
          <div
            className={styles.popper}
            ref={popper}
            style={{
              // minWidth,
              display: (focused || !show_on_focus) ? 'block' : 'none'
            }}
          >
            <div className={styles.content}>
              {children}
            </div>
          </div>,
          document.body,
        )
      }
    </div>
  );
};

export { InputWithPopper };
