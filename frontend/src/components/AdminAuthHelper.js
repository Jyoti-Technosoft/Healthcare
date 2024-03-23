import Cookies from 'js-cookie';
import { loginAdminApi, registerUserApi } from './Api';
import { setActiveDashboard } from '../actions/submenuActions';
// import { useDispatch } from 'react-redux';
// const dispatch = useDispatch();

export async function handleAdminLogin(email, password, navigate, setLoginError) { 
    try {
        const userData = {
            email: email,
            password: password,
        };

        const response = await loginAdminApi(userData);

        var now = new Date();
        var minutes = 60;
        now.setTime(now.getTime() + (minutes * 60 * 1000));

        const authTokenFromResponse = response.token;
        const userEmail = response.email;
        const userId = response.userId;
        const role = response.role;

        if (authTokenFromResponse) {
            Cookies.set('authToken', authTokenFromResponse, {
                expires: now,
                sameSite: 'lax',
                secure: true,
            });
        }

        if (userEmail) {
            Cookies.set('email', email, {
                expires: now,
                sameSite: 'lax',
                secure: true, 
            });
        }

        if (role) {
            Cookies.set('role', role, {
                expires: now,
                sameSite: 'lax',
                secure: true,
            });
        }

        if (userId) {
            Cookies.set('userId', userId, {
                expires: now,
                sameSite: 'lax',
                secure: true,
            });
            navigate('/dashboard', { state: { Email: email } });
            // dispatch(setActiveDashboard("dashboard"));
        } else {
            setLoginError("Login failed. Please try again later.");
        }
    } catch (err) {
        setLoginError("Invalid username or password. Please try again.");

    }
}

export async function handleAdminRegistration(email, password, navigate, setRegistrationError) {
    try {
        const userData = {
            email,
            password,
        };
        await registerUserApi(userData);
        alert("User Registration Successfully");
        navigate('/login');
    } catch (err) {
        setRegistrationError("Registration failed! Please try again.");
    }
}
