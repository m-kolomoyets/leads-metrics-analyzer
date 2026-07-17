import type { Options } from 'ky';
import ky from 'ky';

export interface OptionsWithTypedJson<TJson> extends Options {
    json: TJson;
}

export interface OptionsWithTypedBody<TBody extends BodyInit | null | undefined> extends Options {
    body: TBody;
}

// TODO: The API error messages should be aligned with BE engineers
// NOTE: Should be used like `HTTPError<BaseErrorData>`
export type BaseErrorData<TData = unknown> = { message: string } & TData;

// Base REST client kept for future third-party integrations. First-party auth/data flows through
// TanStack Start server functions (src/services/*), not this client — so there is no token hook.
export const http = ky.create({
    timeout: false,
    retry: 0,
});
