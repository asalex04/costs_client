import {useEffect, useState} from "react";

export const useTheme = () => {
    const initialTheme = localStorage.getItem('theme') || 'dark'
    const [theme, setTheme] = useState(initialTheme)
    const darkTheme = "https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/bootstrap-dark.min.css"
    const lightTheme = "https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"

    const setCurrentMode = (theme: string) => {
        const link = document.getElementById('them-link') as HTMLLinkElement
        link.href = theme === 'dark' ? darkTheme : lightTheme
    }

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        setCurrentMode(theme)
    }
    useEffect(() => {setCurrentMode(theme)}, [theme])

    return {toggleTheme, theme}
}