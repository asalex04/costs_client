import Header from "./components/Header/Header";
import AuthPage from "./components/AuthPage/AuthPage";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {useStore} from "effector-react";
import {$auth, setAuth, setUsername} from "./context/auth";
import {$alert} from "./context/alert";
import Alert from "./components/Alert/Alert";
import CostsPage from "./components/CostsPage/CostsPage";
import {useEffect} from "react";
import {getAuthDataFromLS, removeUser} from "./utils/auth";

function App() {
    const auth = useStore($auth)
    const alert = useStore($alert)

    useEffect(() => {
        const isLogin = getAuthDataFromLS()
        if (!isLogin || !isLogin.access_token || !isLogin.refresh_token) {
            removeUser()
        } else {
            setAuth(true)
            setUsername(isLogin.name)
        }
    }, [])

    return (
        <div className="App">
            <Header/>
            {alert.alertText && <Alert props={alert}/>}
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={auth ? <Navigate to={'/costs'}/> : <Navigate to='login'/>}/>
                    <Route path='/registration' element={<AuthPage type={'registration'}/>}/>
                    <Route path='/login' element={auth ? <Navigate to={'/costs'}/> : <AuthPage type={'login'}/>}/>
                    <Route path='/costs' element={auth ? <CostsPage/> : <Navigate to='/login'/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
