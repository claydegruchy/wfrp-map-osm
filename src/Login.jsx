import { signInWithGoogle, auth, logout } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';




export const LoginHandler = ({ authChangeHook }) => {
    const [user, loading, error] = useAuthState(auth);
    // update if the user state changes
    useEffect(() => { authChangeHook() }, [user])

    return (
        <div>
            {loading ? "loading" : null}
            {user ? <div>{user.displayName} ✔️</div> : <div>Sign in to save progress</div>}
            {user ? <button onClick={logout}>signout</button> : <button onClick={signInWithGoogle}>signin</button>}
        </div>
    )
}