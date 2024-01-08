import React from "react";
import { signInWithGoogle, auth, logout } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';
import { useState } from 'react';

import './DialogBoxes.css'



export const Button = ({ children, addClasses, ...rest }) => <button {...rest}
    className={"background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 " + addClasses}
    type="button"
// onClick={() => setShowModal(false)}
>
    {children}
</button>

export const Modal = ({ children, title, setShowModal, customButtons }) => (
    <div
        className=" justify-left items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className={"relative w-auto my-6 mx-0 z-10 p-3 " + (new URLSearchParams(location.search).get('overlay') ? "max-w-sm" : "max-w-3xl")}>
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
                <div className="flex items-center justify-around p-6 border-t border-solid border-slate-200 rounded-b">
                    {customButtons ? customButtons : null}
                    <Button onClick={() => setShowModal(false)} addClasses={"text-red-500 "}>Close</Button>


                </div>
            </div>
        </div>
        <div onClick={() => setShowModal(false)}

            className="opacity-25 fixed inset-0 z-0 bg-black"></div>
    </div>

)



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

// 

export const HelpDialog = () => {
    const [showModal, setShowModal] = useState(false);

    return (<>
        <button onClick={() => setShowModal(true)} className={buttonClasses}>❓</button>
        {showModal ? <Modal title={'Help'} setShowModal={setShowModal}>
            <div className=' lg:max-w-3xl text-left text-sm lg:text-md '>
                <div className='border text-sm'>
                    <h2 className='text-xl bold text-slate-900'>Updates!</h2>
                    <p>Added zoomable maps for ubersreik, altdorf, bel-aliad, carroburg, kemperbad, marienburg, miragliano, nuln, praag and sartosa</p>
                </div>
                <h2 className='text-xl bold text-slate-900'>What is this</h2>
                <p>This is a Warhammer world map sharing system inspired by the amazing maps over at gitzmansgallery.</p>
                {/* <p>The system allows you to view the old world, zoom in to street level in some locations, and share your art, battlemaps, and stories.</p> */}
                {/* <p>This is intended for fan art, but (non-video game) offical art is okay</p> */}
                <p>This is mostly made for my personal use (keeping track of cool art is hard!) but I plan on opening it up so others can add art from their adventures in the old world.</p>
                <p>It's a work in progress, so please be patient with me as I add more features.</p>

                <h2 className='text-xl bold text-slate-900'>Credits</h2>
                <p>
                    Big thanks to gitzmansgallery for the main map. Extract from gitzmansgallery.com:
                    <div className="italic"> Some original artwork is credited to Andreas Blicher, based upon Alfred Nunez, Jr.'s outstanding cartography and research. Many other sources were used including those from the Warhammer Maps page.</div>
                </p>
                <p>
                    Thanks to Magnus Seter via http://altdorfer.blogspot.com for Altdorf. I hope to load the various POIs one day.
                </p>
                <p>
                    Big thanks to https://www.deviantart.com/planjanusza for the free listed assets on their deviantart. Amazing stuff and inspired me to make this. Multiple maps are used from here.
                </p>

                <h2 className='text-xl bold text-slate-900'>How do I add new locations?</h2>
                <p>Right now, you can't. This feature is a work in progress.</p>
                {/* <ol className='list-decimal indent-3'>
                    <li>Login in the top left</li>
                    <li>Right click a location</li>
                    <li>Add some art that you think is cool for that location, and maybe some battlemaps if you have them (file size limit ~5mb)</li>
                    <li>Star the image that you want to show in the preview (art works best for this)</li>
                    <li>Check the box if you want to share them publically so everyone can enjoy them</li>
                </ol> */}
                {/* <p className='italic'>If you didn't create the images, make sure to credit the artist who did!</p> */}


                <h2 className='text-xl bold text-slate-900'>I have a high def map of a city/part of the world that I want to add</h2>
                Adding zoomable maps is not yet automated, but <a href='https://forms.gle/5RRtzuv3Um5xN9Eh9'>use this form</a> and I'll try to add it for you
            </div>

        </Modal> : null}

    </>)

}