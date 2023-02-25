import { signInWithGoogle, auth, logout } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';
import { useState } from 'react';


import React from "react";

export const Modal = ({ children, title, setShowModal }) => {

    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                {title}
                            </h3>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                            <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                {children}
                            </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={() => console.log(false)} className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}



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
    const [showModal, setShowModal] = useState(false);

    return (<>
        <button onClick={() => setShowModal(true)} className={buttonClasses}>❓</button>
        {showModal ? <Modal title={'Help'} setShowModal={setShowModal}>
            <div> this is some text content</div>
            <div> this is some text content</div>
            <div> this is some text content</div>
            <div> this is some text content</div>
            <div> this is some text content</div>
        </Modal> : null}

    </>)

}