export const HTTP_RESPONSES = {
  SUCCESS: 200,
  CREATED: 201,
  CONNECTION_REFUSED: 408,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429
};

export interface IApiErrorResult {
  detail?: string;
  code?: string;
}

export interface IResultWithStatus<T> {
  status: any;
  data?: Partial<T> & IApiErrorResult;
  error?: string;
  debug?: string;
}

export const resultMiddleware = <T extends {}>({
  status,
  data
}: {
  status: number;
  data: T;
}): { status: number; data: T } => {
  return data && { status, data };
};

export const errorMiddleware = <T extends any>(debug): IResultWithStatus<T> =>
  debug && debug.response
    ? debug.response
    : {
        status: HTTP_RESPONSES.CONNECTION_REFUSED,
        data: null,
        debug,
        error: "Network_Disconnected"
      };
