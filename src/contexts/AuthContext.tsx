import Router from "next/router";
import { ReactNode, useContext, createContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { api } from "../services/api";
import { isAfter } from "date-fns";
import { toast } from "react-toastify";

interface AuthProps {
    children: ReactNode;
}

interface SignInCredentials { email: string, password: string }

export interface ISignInResponse {
    name: string,
    avatarUrl: string,
    email: string,
    token: string,
    expiresIn: number
    loggedAt: string
}
type User = {
    email: string;
    name: string;
    avatarUrl: string;
};

type AuthContextType = {
    signIn({ email, password }: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    singOut: () => void;
    user: User | undefined;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProps) {

    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;

    const { '@dashGo:user': tempUser } = parseCookies()
    const userToken: ISignInResponse = JSON.parse(tempUser ?? "{}")

    useEffect(() => {
        if (userToken.token) {
            const isAuthValidy = verifyAuth(userToken)
            if (isAuthValidy) {
                api.defaults.headers['Authorization'] = `Bearer ${userToken.token}`

                api.get('/me').then(response => {
                    const { email, name, avatarUrl }: User = response.data
                    setUser({ email, name, avatarUrl })
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }, [])

    async function signIn({ email: login, password }: SignInCredentials) {
        try {
            const { data } = await api.post<ISignInResponse>('/signIn', { email: login, password })
            const { name, avatarUrl, email } = data;

            setUser({ name, avatarUrl, email })

            setCookie(undefined, '@dashGo:user', JSON.stringify(data), {
                maxAge: 60 * 60 * 24 * 30,  // 30 days
                path: '/',
            });

            api.defaults.headers['Authorization'] = `Bearer ${data.token}`
            
            Router.push('/dashboard')
            toast.success("Bem vindo!")
        } catch (error) {
            console.log(error)
        }
    }

    function singOut() {
        destroyCookie(undefined, '@dashGo:user');
        Router.push('/')
        toast.info("Você foi desconectado!")

    }

    function verifyAuth(userInfos: ISignInResponse) {

        const loggedAt = new Date(userInfos.loggedAt)
        // Armazena quadno que o token vai expirar
        const whenTokenExpire = loggedAt.setHours(loggedAt.getHours() + (userInfos.expiresIn / 60 / 60));
        // const whenTokenExpire = tempLoggedAt.setHours(tempLoggedAt.getHours() + 8);

        // Caso o token vá expirar depois da data atual, então o token ainda é válido
        if (isAfter(whenTokenExpire, new Date())) {
            console.log('token válido!')
            return true;
        } else {
            // Caso o token já tenha expirado, então faz o logout
            singOut()
            console.log('token inválido!')
            return false
        }
    }


    return (
        <AuthContext.Provider value={{ signIn, singOut, user, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)