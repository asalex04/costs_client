import React from 'react';
import {useTheme} from "../../hooks/useTheme";
import {useStore} from "effector-react";
import {$auth, $username} from "../../context/auth";
import {removeUser} from "../../utils/auth";
import cls from './Header.module.scss'

const Header = () => {
    const {theme, toggleTheme} = useTheme()
    const username = useStore($username)
    const loggedIn = useStore($auth)

    return (
        <header className={`navbar navbar-dark bg-${theme === 'dark' ? 'dark' : 'primary'}`}>
            <div className='container'>
                <h1 style={{color: "white"}}>Costs App</h1>
                {username && <h2 style={{color: "white"}}>{username}</h2>}
                <button
                    onClick={toggleTheme}
                    className={`btn btn-${theme === 'dark' ? 'light' : 'dark'} ${cls.btnTheme}`}
                >
                    { theme === 'dark' ? 'Go light' : 'Go dark' }
                </button>
                {loggedIn &&
                    <button onClick={removeUser} className={`btn btn-primary ${cls.btnEnter}`}
                    >
                        Выход
                    </button>
                }
            </div>

        </header>
    );
};

export default Header;