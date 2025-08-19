import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


export default function SellerLogin() {
const { user, profile, emailSignIn, emailSignUp, googleSignIn } = useAuth()
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [mode, setMode] = useState('login')
const navigate = useNavigate()
const location = useLocation()


useEffect(() => {
if (user && profile?.role === 'seller') {
navigate('/seller/dashboard', { replace: true })
}
}, [user, profile])


async function submit(e) {
e.preventDefault()
if (mode === 'login') await emailSignIn(email, password)
else await emailSignUp(email, password, 'seller')
navigate(location.state?.from?.pathname || '/seller/onboarding', { replace: true })
}


return (
<Page title="Seller Login / Sign Up">
<form onSubmit={submit} className="max-w-md mx-auto bg-white border rounded-xl p-4 space-y-3">
<input className="w-full border rounded-lg px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="w-full border rounded-lg px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white">{mode==='login'?'Login':'Create Seller Account'}</button>
<button type="button" onClick={()=>googleSignIn('seller')} className="w-full px-4 py-2 rounded-lg border">Continue with Google</button>
<div className="text-center text-sm">
{mode==='login' ? (
<span>New seller? <button type="button" className="underline" onClick={()=>setMode('signup')}>Create an account</button></span>
) : (
<span>Already have an account? <button type="button" className="underline" onClick={()=>setMode('login')}>Login</button></span>
)}
</div>
</form>
</Page>
)
}