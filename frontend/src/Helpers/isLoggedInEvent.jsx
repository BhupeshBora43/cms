import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '../store/Slices/auth.slice';

const LogoutListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = () => {
            console.log('Logout event triggered');
            dispatch(setLogin(false));
        };

        window.addEventListener('setLogin', handleLogout);

        return () => {
            window.removeEventListener('setLogin', handleLogout);
        };
    }, [dispatch]);

    return null;
};

export default LogoutListener;
