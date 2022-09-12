import Router from "next/router";
import { ReactNode, useContext, createContext, useEffect, useState } from "react";
import { api2 } from "../services/api2";
import { parseCookies, setCookie } from 'nookies'
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
    user: User | undefined;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProps) {

    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;

    useEffect(() => {

        const { '@dashGo:token': token } = parseCookies()

        if (token) {

            api2.defaults.headers['Authorization'] = `Bearer ${token}`

            api2.get('/me').then(response => {
                const { email, name, permissions, roles } = response.data
                console.log(response.data)
                setUser({ email, name, permissions, roles })
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [])


    async function signIn({ email, password }: SignInCredentials) {
        try {
            const { data } = await api2.post('sessions', { email, password })
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

            api2.defaults.headers['Authorization'] = `Bearer ${token}`
            Router.push('/dashboard')
        } catch (error) {
            console.log(error)
        }




    }

    return (
        <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)