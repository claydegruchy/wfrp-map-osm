import { signInWithGoogle, auth, logout } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";




export const LoginHandler = () => {
    const [user, loading, error] = useAuthState(auth);

    return (
        <div>
            {loading?"loading":null}
            {user ? <div>{user.displayName} ✔️</div> : <div>Sign in to save progress</div>}
            {user ? <button onClick={logout}>signout</button> : <button onClick={signInWithGoogle}>signin</button>}
        </div>
    )
}