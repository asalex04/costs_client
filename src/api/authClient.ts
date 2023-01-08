import {$host} from "./index";
import {setAuth, setUsername} from "../context/auth";
import {handleAxiosErrors} from "../utils/errors";

export class AuthClient {
    static async login (username: string, password: string) {
        try {
            const response = await $host.post('/auth/login', {username, password})
            if (response.status === 200) {
                setAuth(true)
                setUsername(response.data.username)
                localStorage.setItem('token', JSON.stringify(response.data))
                return true
            }
        } catch (error) {
            handleAxiosErrors(error)
        }
    }

    static async registration (username: string, password: string) {
        try {
            const response = await $host.post('/auth/registration', {username, password})
            if (response.status === 201) {
                setAuth(false)
                return true
            }
            return false
        } catch (error) {
            handleAxiosErrors(error)
        }
    }
}