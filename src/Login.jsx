import { signInWithGoogle, auth, logout } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';


const buttonClasses = 'bg-stone-200 text-slate-800 text-sm bg-stone-200 text-black text-sm hover:bg-stone-300 border border-slate-300 hover:border-slate-400'

export const LoginHandler = ({ authChangeHook }) => {
    const [user, loading, error] = useAuthState(auth);
    // update if the user state changes
    useEffect(() => { authChangeHook() }, [user])

    return (
        <div className=' '>
            {loading ? "loading" : null}
            {user ? <button className={buttonClasses+""} onClick={logout}>✔️ {user.displayName}</button>
                : <button className={buttonClasses+""} onClick={signInWithGoogle}>
                    Sign in</button>}
        </div>
    )
}