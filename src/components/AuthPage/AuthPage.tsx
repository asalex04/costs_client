import React, {MutableRefObject, useRef, useState} from 'react';
import cls from './authPage.module.scss'
import {Link, useNavigate} from "react-router-dom";
import {AuthClient} from "../../api/authClient";
import Spinner from "../Spinner/Spinner";
import {handleAlertMessage} from "../../utils/auth";
import {IHandleAuthResponse} from "../../types";

const AuthPage = ({type}: { type: 'login' | 'registration' }) => {
    const navigate = useNavigate()
    const CurrentTitle = type === 'login' ? 'Вход' : 'Регистрация'
    const [isLoading, setIsLoading] = useState(false)
    const usernameRef = useRef() as MutableRefObject<HTMLInputElement>
    const passwordRef = useRef() as MutableRefObject<HTMLInputElement>

    const handleAuthResponse = (props: IHandleAuthResponse) => {
        const {result, navigatePath, alertText} = props
        if (!result) {
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        navigate(navigatePath)
        handleAlertMessage({alertText: alertText, alertStatus: 'success'})
    }

    const handleLogin = async (username: string, password: string) => {
        if (!username || !password) {
            setIsLoading(false)
            handleAlertMessage({alertText: 'Insert all fields', alertStatus: 'warning'})
            return
        }
        const result = await AuthClient.login(username, password)
        handleAuthResponse({result, navigatePath: '/costs', alertText: 'Signed in'})
    }

    const handleRegistration = async (username: string, password: string) => {
        if (!username || !password) {
            setIsLoading(false)
            handleAlertMessage({alertText: 'Insert all fields', alertStatus: 'warning'})
            return
        }
        if (password.length < 4) {
            setIsLoading(false)
            handleAlertMessage({alertText: 'Password must be longer then 4 symbols', alertStatus: 'warning'})
            return
        }
        const result = await AuthClient.registration(username, password)
        handleAuthResponse({result, navigatePath: '/login', alertText: 'Registration completed'})
    }

    const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        switch (type) {
            case "login":
                handleLogin(usernameRef.current.value, passwordRef.current.value)
                break
            case "registration":
                handleRegistration(usernameRef.current.value, passwordRef.current.value)
                break
            default:
                break
        }
    }
    return (
        <div className={cls.wrapper}>
            <div className='container'>
                <h1>{CurrentTitle}</h1>
                <form onSubmit={handleAuth}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Введите имя пользователя</label>
                        <input ref={usernameRef} type="text" className="form-control" placeholder="Username" aria-label="Username"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Введите пароль</label>
                        <input ref={passwordRef} type="password" className="form-control" id="exampleInputPassword1"/>
                    </div>
                    <button className={`btn btn-primary ${cls.authBtn}`}>
                        {isLoading ? <Spinner top={5} left={20}/> : CurrentTitle}
                    </button>
                </form>
                {
                    type === 'registration'
                        ? <div>
                            <span>Уже есть аккаунт?</span>
                            <Link to={'/login'}>Войти</Link>
                        </div>
                        : <div>
                            <span>Еще нет аккаунта?</span>
                            <Link to={'/registration'}>Зарегистрироваться</Link>
                        </div>
                }

            </div>
        </div>
    );
};

export default AuthPage;