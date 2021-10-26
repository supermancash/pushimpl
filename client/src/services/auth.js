
export const login = async (username, password) => {
    let dataFromFetch;
    fetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
            user: username,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            if (data.accessToken) {
                localStorage.setItem("user", JSON.stringify(data));
            }
            dataFromFetch = data;
        })
    return await dataFromFetch;
}

export const logout = () => {
    localStorage.removeItem("user");
}

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

export const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        return { 'x-access-token' : user.accessToken };
    } else {
        return {};
    }
}
