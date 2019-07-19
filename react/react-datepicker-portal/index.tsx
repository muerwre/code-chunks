import React, { useCallback, useState, useEffect, ReactNode } from 'react';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import { format, isValid, parse } from 'date-fns/esm';
import ReactDOM from 'react-dom';

import * as styles from '~/styles/datepicker.scss';
import * as input_style from '~/styles/inputs.scss';
import { ITransKey, Trans } from '~/i18n';

interface IDateInputProps {
  value: string;
  placeholder?: string;
  handler: (value: string) => void;
  required?: boolean;
  title?: ITransKey;
  error?: ITransKey;
  date_format?: string;
  max?: Date;
  min?: Date;
}

// This creates portal
const PopperContainer = ({ children }: { children: ReactNode[] }): ReactNode => (
  ReactDOM.createPortal(children, document.body)
);

const DateInput: React.FunctionComponent<IDateInputProps> = ({
  handler,
  required = false,
  error,
  date_format = 'yyyy-MM-dd',
  title,
  value,
  min,
  max,
}) => {
  const [focused, setFocused] = useState(false);
  const [date, setDate] = useState(null);

  const onFocus = useCallback(() => setFocused(true), [focused]);
  const onBlur = useCallback(() => setFocused(false), [focused]);

  const onDateChange = useCallback(
    selected => {
      if (!selected || !isValid(new Date(selected))) return handler('');

      const parsed_date = format(new Date(selected), date_format);

      if (parsed_date) return handler(parsed_date);
    }, [handler, date_format],
  );

  useEffect(
    () => {
      if (!value) return setDate(null);

      const parsed_value = parse(value, date_format, new Date());

      if (parsed_value && isValid(parsed_value)) return setDate(parsed_value);
    },
    [value, date_format, setDate],
  );

  return (
    <div className={classNames(
      input_style.input_text_wrapper,
      {
        [input_style.required]: required,
        [input_style.focused]: focused,
        [input_style.has_status]: !!status || !!error,
        [input_style.has_value]: !!date,
        [input_style.has_error]: !!error,
      },
    )}>
      <DatePicker
        className={classNames(input_style.input_text)}
        onChange={onDateChange}
        dayClassName={() => styles.day}
        calendarClassName={styles.calendar}
        dateFormat={date_format}
        selected={date}
        fixedHeight
        onFocus={onFocus}
        onBlur={onBlur}
        previousMonthButtonLabel=""
        nextMonthButtonLabel=""
        maxDate={max}
        minDate={min}
        popperContainer={PopperContainer}
        // popperPlacement="auto-start"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: '0, -1',
          },
          preventOverflow: {
            boundariesElement: 'viewport',
          },
          // computeStyle: {
          //   gpuAcceleration: false,
          // },
        }}
        // withPortal
        popperProps={{ positionFixed: true }}
      />
      {
        title &&
        <div className={input_style.title}>
            <span>
              <Trans i18nKey={title} />
            </span>
        </div>
      }
      {
        error && <div className={input_style.error}><span><Trans i18nKey={error} /></span></div>
      }
    </div>
  );
};

export { DateInput };
