import Router from "next/router";
import { ReactNode, useContext, createContext, useEffect, useState } from "react";
// import { api2 } from "../services/api2";
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { api } from "../services/apiCLient";
interface AuthProps {
    children: ReactNode;
}

interface SignInCredentials { email: string, password: string }

type User = {
    email: string;
    permissions: string[];
    roles: string[];
    name: string;
};

type AuthContextType = {
    signIn({ email, password }: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    singOut: () => void;
    user: User | undefined;
}

export const AuthContext = createContext({} as AuthContextType);

let authChannel : BroadcastChannel

export function AuthProvider({ children }: AuthProps) {

    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;

    useEffect(() => {

        const { '@dashGo:token': token } = parseCookies()

        if (token) {

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            api.get('/me').then(response => {
                const { email, name, permissions, roles } = response.data
                setUser({ email, name, permissions, roles })
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [])


    useEffect(() => {
        authChannel = new BroadcastChannel('auth');

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'singOut':
                    singOut()
                    break;
            
                default:
                    break;
            }
        }
    }, [])
    async function signIn({ email, password }: SignInCredentials) {
        try {
            const { data } = await api.post('sessions', { email, password })
            console.log(data)

            const { permissions, roles, name, token, refreshToken } = data;

            setCookie(undefined, '@dashGo:token', token, {
                maxAge: 60 * 60 * 24 * 30,  // 30 days
                path: '/',
            });
            setCookie(undefined, '@dashGo:refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30,  // 30 days
                path: '/',
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`
            Router.push('/dashboard')
        } catch (error) {
            console.log(error)
        }
    }

    function singOut() {
        destroyCookie(undefined, '@dashGo:token');
        destroyCookie(undefined, '@dashGo:refreshToken');
        authChannel.postMessage('singOut')
        Router.push('/')
    }

    return (
        <AuthContext.Provider value={{ signIn, singOut, user, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)