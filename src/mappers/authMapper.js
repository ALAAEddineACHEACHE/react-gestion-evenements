export const mapRegisterRequest = (form) => ({
    username: form.username,
    email: form.email,
    password: form.password,
    role: form.role
});

export const mapLoginRequest = (form) => ({
    email: form.email,
    password: form.password
});

export const mapVerifyRequest = (email, code) => ({
    email,
    verificationCode: code
});
