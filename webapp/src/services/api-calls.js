import config from '../config';

const { baseUrl } = config;

export function apiPost(url, payload) {
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...authHeader(),
        },
        body: JSON.stringify(payload),
    };

    console.log('apiPost', url, options);
    return fetch(baseUrl + url, options).then(handleResponse);
}

export function authHeader() {
    // return authorization header with jwt token
    let token = JSON.parse(localStorage.getItem('token'));

    if (token) {
        return { Authorization: 'Bearer ' + token };
    } else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        console.log('response', data);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                //authService.logout();
                //location.reload(true);
            }

            const error = (data && data.statusText) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
