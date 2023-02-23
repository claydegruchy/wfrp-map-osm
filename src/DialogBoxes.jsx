import { signInWithGoogle, auth, logout } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';
import { useState } from 'react';


const buttonClasses = 'bg-stone-200 text-slate-800 text-sm bg-stone-200 text-black text-sm hover:bg-stone-300 border border-slate-300 hover:border-slate-400'

export const LoginDialog = ({ authChangeHook }) => {
    const [user, loading, error] = useAuthState(auth);
    // update if the user state changes
    useEffect(() => { authChangeHook() }, [user])

    return (
        <div className=' '>
            {loading ? "loading" : null}
            {user ? <button className={buttonClasses + ""} onClick={logout}>✔️ {user.displayName}</button>
                : <button className={buttonClasses + ""} onClick={signInWithGoogle}>
                    Sign in</button>}
        </div>
    )
}

export const HelpDialog = () => {
    const [open, setOpen] = useState(false)

    return <div>
        <button onClick={() => setOpen(!open)} className={buttonClasses}>❓</button>
        {open ? <div className=' top-0 left-52  absolute h-32 w-52' >
            <button className='absolute top-0 right-0'>x</button>
            <div className={buttonClasses}>lmao</div>
        </div> : null}
    </div>
}