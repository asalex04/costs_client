import {IAlert} from "../types";
import {setAlert} from "../context/alert";
import {setAuth, setUsername} from "../context/auth";
import {setCosts} from "../context";

export const handleAlertMessage = (alert: IAlert) => {
    setAlert(alert)
    setTimeout(() => setAlert({alertText: '', alertStatus: ''}), 3000)
}

export const removeUser = () => {
    localStorage.removeItem('token')
    setAuth(false)
    setUsername('')
    setCosts([])
}

export const getAuthDataFromLS = () => {
    try {
        const LsData = JSON.parse(localStorage.getItem('token') as string)
        if (!LsData) return removeUser()
        return LsData
    } catch (err) {
        removeUser()
    }
}