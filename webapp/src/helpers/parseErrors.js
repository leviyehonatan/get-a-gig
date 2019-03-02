export function parseResponseErrorsToStringArray(errors) {
    return errors.map(error => error.message);
}

export function findResponseError(errors, path) {
    return errors.find(error => error.path === path);
}

export function parseGraphQlError(error) {
    console('parseGra', Object.entries(error));
    const { networkError } = error;
    if (networkError) {
        console.log(networkError, Object.entries(networkError));
        return error.networkError.map(err => err);
    }
}
