import { IMAGE_MIME_TYPES } from "~/utils/uploader";
import isValid from "date-fns/isValid";
import { ITransKey } from "~/i18n";
import { IAddress } from "~/redux/types";

const isValidEmail = (email: string): boolean =>
  !!email &&
  String(email) &&
  !!String(email).match(
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  );

const isLikeEmail = (email: string): boolean =>
  !!email && String(email) && !!String(email).match(/^([^\@]+)@([^\@]+)\.([^\@]+)$$/);

const isNonEmpty = (value: string): boolean => !!value && value.trim().length > 0;
const isLikePhone = isNonEmpty;

const isAtLeast = (length: number, value: string): boolean =>
  !!value && value.trim().length >= length;

const isMimeOfImage = (mime): boolean => !!mime && IMAGE_MIME_TYPES.indexOf(mime) >= 0;

const isDate = (val: string): boolean => !!val && isValid(new Date(val));
const isStringDate = (val: string): boolean => !!val && !!val.match(/^[\d]{2,4}\-[\d]{2}-[\d]{2}/);
const isAddrWithRaw = ({ raw }: Partial<IAddress>): boolean => !!raw && isNonEmpty(raw);

export const VALIDATORS = {
  EMAIL: isValidEmail,
  LIKE_PHONE: isLikePhone,
  LIKE_EMAIL: isLikeEmail,
  NON_EMPTY: isNonEmpty,
  AT_LEAST: length => isAtLeast.bind(null, length),
  IS_IMAGE_MIME: isMimeOfImage,
  IS_DATE: isDate,
  IS_STRINGY_DATE: isStringDate,
  IS_ADDRESS_WITH_RAW: isAddrWithRaw,
  EVOLVE: (validator: (val: any) => boolean, error: ITransKey) => (val: any) =>
    !val || !validator(val) ? error : null
};

/* example of usage:
const SUBSCRIPTION_VALIDATORS = {
  first_name: VALIDATORS.EVOLVE(VALIDATORS.NON_EMPTY, 'Field_Is_Required'),
  last_name: VALIDATORS.EVOLVE(VALIDATORS.NON_EMPTY, 'Field_Is_Required'),
  email: VALIDATORS.EVOLVE(VALIDATORS.EMAIL, 'Field_Is_Incorrect'),
  phone_number: VALIDATORS.EVOLVE(VALIDATORS.LIKE_PHONE, 'Field_Is_Incorrect'),
};

// takes arrays of items and checks each of them with SUBSCRIPTION_VALIDATORS
export const customerSubscriptionValidator = map(
  pipe(
    pick(keys(SUBSCRIPTION_VALIDATORS)),
    evolve(SUBSCRIPTION_VALIDATORS),
    reject(isNil),
  ),
);

const validation_errors = customerSubscriptionValidator(data);
const has_errors = validation_errors.some(hasNonEmptyFields));

*/
