export const mapRegisterRequest = (form) => ({
    username: form.username, // <-- remplacer form.name par form.username
    email: form.email,
    password: form.password,
    role: "ROLE_USER"
});

export const mapLoginRequest = (form) => ({
    email: form.email,
    password: form.password
});

export const mapVerifyRequest = (email, code) => ({
    email,
    verificationCode: code
});
