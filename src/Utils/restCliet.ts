import { Auth } from 'aws-amplify';

export type ApiResponse<RS, O = {}> = {
  fType?: string;
  subject?: string;
  code?: string;
  why?: string;
  description?: string;
  err?: Error;
  inputData?: O;
} & RS;

export enum ApiResponseType {
  Error = 'Error',
  Unexpected = 'Unexpected'
}

const urlBase = 'https://hgtnbafey6.execute-api.us-east-1.amazonaws.com/moviestore/';

export const apiFetch = async <RS, RQ = {}, O = {}>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | null = null,
  params: string | null = null,
  payload: RQ | null = null,
  controller: AbortController | null = null,
  isJsonResponse = true
): Promise<ApiResponse<RS, O>> => {
  const retries = 1;
  const retryDelay = 1500;
  const token = await Auth.currentSession();
  return new Promise<ApiResponse<RS, O>>((resolve, reject) => {
    const wrappedFetch = (attempt: number) => {
      try {
        const headers: Headers = new Headers();
        headers.append('Authorization', token.getIdToken().getJwtToken());
        window
          .fetch(urlBase + url + (params || ''), {
            body: payload ? JSON.stringify(payload) : null,
            method: method || 'GET',
            signal: controller?.signal,
            headers
          })
          .then((response: Response) => {
            isJsonResponse && response.status !== 202
              ? response
                  .json()
                  .then((data: ApiResponse<RS, O>) => {
                    resolve(data);
                  })
                  .catch((reason) => {
                    reject(reason);
                  })
              : resolve({ fType: 'Empty' } as ApiResponse<RS, O>);
          })
          .catch((error) => {
            if (attempt < retries) {
              retry(attempt);
            } else {
              reject(error);
            }
          });
      } catch (error) {
        if (error.toString().indexOf('TypeError: window.fetch is not a function') > -1) {
          // serverside pre-rendering has no fetch.
          resolve();
          return;
        }
        reject(error);
      }
    };

    const delay = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, retryDelay);
      });
    };

    const retry = (attempt: number) => {
      delay().then(() => {
        wrappedFetch(++attempt);
      });
    };
    // first call
    wrappedFetch(0);
  });
};
