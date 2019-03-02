import { apiPost } from "./api-calls";

export const authService = {
    signup,
    login,
    // logout,
}

function signup(signupForm) {
    return apiPost('/auth/signup', signupForm);
}

function login(loginForm) {
    return apiPost('/auth/login', loginForm);
}