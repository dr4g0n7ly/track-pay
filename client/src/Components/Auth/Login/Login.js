import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from '../../Profile/Profile';
import Sidebar from '../../Sidebar/Sidebar'
import '../Auth.css'

const Login = () => {

    const dNow = Date.parse(new Date())
    const expiry = Date.parse(localStorage.getItem('expiry'))
    if (expiry < dNow) {
        localStorage.clear()
    } 

    const [user, setUser] = useState()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user-email');
        if (loggedInUser) {
            setUser(loggedInUser)
        } else {
            setUser()
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            })

            const data = await res.json()
            toast(data.msg)

            if (!res.ok) {
                return console.log(' response not ok fetch error')
            }

            const resUser = JSON.stringify(data.userSession.email)
            console.log(resUser)

            const diff = 180 // 2 minute sessionds
            const curDateObj = new Date();
            const expDateObj = new Date(curDateObj.getTime() + diff*60000);

            localStorage.setItem('user-email', resUser)
            localStorage.setItem('expiry',expDateObj)

            setEmail('')
            setPassword('')

            window.location.reload(false);

            return
        } catch (error) {
            toast('server error')
            console.log(error)
            return console.log('fetch error')
        }

    }


    if (user) {
        return (
            <Profile/>
        )
    }
    

    return (
        <div>
            <ToastContainer />
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="label">Email-ID:</label>
                <br/>
                <input
                    id="email"
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    value = { email }
                    required
                />
                <br/>
                <br/>

                <label htmlFor="pwd" className="label">Password:</label>
                <br/>
                <input
                    id="pwd"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value = { password }
                    required
                />
                <br/>
                <br/>

                <button disabled={email === '' || password === '' ? true : false}>
                    Log in
                </button>
                <br/>
                    
                <p className="suggestion">
                    Don't have an account?  
                    <span>
                    <Link to="/signup">  Register</Link>
                    </span>
                </p>
            </form>
            <Sidebar icon="profile"/>
        </div>
    )
}

export default Login