class KyError extends Error {
    name = 'KyError';
    get isKyError() {
        return true;
    }
}
class HTTPError extends KyError {
    name = 'HTTPError';
    response;
    request;
    options;
    data;
    constructor(response, request, options) {
        const code = response.status || response.status === 0 ? response.status : '';
        const title = response.statusText ?? '';
        const status = `${code} ${title}`.trim();
        const reason = status ? `status code ${status}` : 'an unknown error';
        super(`Request failed with ${reason}: ${request.method} ${request.url}`);
        this.response = response;
        this.request = request;
        this.options = options;
    }
}
const isErrorType = (error, cls) => error instanceof cls || error?.name === cls.name;
function isHTTPError(error) {
    return isErrorType(error, HTTPError);
}
export { isHTTPError as i };
