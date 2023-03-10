import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"
import Login from "../Auth/Login/Login"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddAccount.css'


const AddAccount = () => {

    const [user, setUser] = useState()

    const [accName, setAccName] = useState('Account 1')
    const [digits, setDigits] = useState('')
    const [validDigits, setValidDigits] = useState(false)
    const [balance, setBalance] = useState()

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user-email');
        if (loggedInUser) {
            setUser(loggedInUser)
        } else {
            setUser()
        }
    }, []);

    const handleBalanceChange = (e) => {
        if (e.target.value.length !== 4) {
            setValidDigits(false)
        } else {
            setValidDigits(true)
        }
        setDigits(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (digits === '') {
            setDigits('XXXX')
        }

        const userEmail = user.replace(/['"]+/g, '')
        
        try {
            const res = await fetch('/accounts/addaccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    name: accName,
                    digits: digits,
                    balance: balance
                }),
            })

            const data = await res.json()
            toast(data.msg)

            if (!res.ok) {
                return console.log('res not ok - fetch error')
            }

            setAccName('New Account')
            setDigits('')
            setValidDigits(false)
            setBalance('')  

            navigate('/accounts')

        } catch (err) {
            console.log(err)
            toast('fetch error')
        }

             

    }

    if (!user) {
        return (
            <Login/>
        )
    }

    return (
        <div>
            <ToastContainer/>
            <h1>Add account</h1>
            <form onSubmit={handleSubmit}>

                <label htmlFor="accname" className="label">Enter account name:</label>
                <br/>
                <input
                    type="text"
                    id="accname"
                    onChange={(e) => setAccName(e.target.value)}
                    value = { accName }
                    placeholder="Account 1"
                    required
                />

                <br/>
                <br/>

                <label htmlFor="digits" className="label">Last 4 digits:</label>    
                <br/>
                <input
                    type="number"
                    min="1000"
                    max="9999"
                    placeholder="XXXX (optional)"
                    id="digits"
                    onChange={handleBalanceChange}
                    value = { digits }
                />
                <p className={!validDigits &&  digits !== '' ? "error" : "no-error"}>
                    4 digits must be entered
                </p>

                <br/>
                <br/>

                <label htmlFor="balance" className="label">Enter account balance:</label>    
                <br/>
                <input
                    type="number"
                    placeholder="0"
                    id="digits"
                    onChange={(e) => setBalance(e.target.value)}
                    value = { balance }
                />  

                <br/>
                <br/>

                <button disabled={!validDigits || !balance? true : false}>
                    Create account
                </button>

            </form>

            <Sidebar icon="2"/>
        </div>
        
    )
}

export default AddAccount