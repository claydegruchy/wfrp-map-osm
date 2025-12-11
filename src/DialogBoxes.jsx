import React from "react";
import { signInWithGoogle, auth, logout } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useState } from "react";

import "./DialogBoxes.css";

export const Button = ({ children, addClasses, ...rest }) => (
  <button
    {...rest}
    className={
      "background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 " +
      addClasses
    }
    type="button"
    // onClick={() => setShowModal(false)}
  >
    {children}
  </button>
);

import { useRef } from "react";

export const Modal = ({ children, setShowModal }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.showModal();
    ref.current.scrollTo(0, 0);
  }, []);

  return (
    <dialog
      ref={ref}
      className="p-4 bg-white rounded"
      onClose={() => setShowModal(false)}
    >
      <button
        onClick={() => {
          ref.current.close();
          setShowModal(false);
        }}
      >
        Close
      </button>
      {children}
    </dialog>
  );
};

export const buttonClasses =
  "bg-stone-200 text-slate-800 text-sm bg-stone-200 text-black text-sm hover:bg-stone-300 border border-slate-300 hover:border-slate-400";

export const LoginDialog = ({ authChangeHook }) => {
  const [user, loading, error] = useAuthState(auth);
  // update if the user state changes
  useEffect(() => {
    authChangeHook();
  }, [user]);

  return (
    <div className=" ">
      {loading ? "loading" : null}
      {user ? (
        <button className={buttonClasses + ""} onClick={logout}>
          ✔️ {user.displayName}
        </button>
      ) : (
        <button className={buttonClasses + ""} onClick={signInWithGoogle}>
          Sign in
        </button>
      )}
    </div>
  );
};

export const HelpDialog = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className={buttonClasses}>
        ❓
      </button>
      {showModal ? (
        <Modal title={"Help"} setShowModal={setShowModal}>
          <div className=" lg:max-w-3xl text-left text-sm lg:text-md ">
            <div className="border text-sm">
              <br />
              <h2 className="text-xl bold text-slate-900">Updates!</h2>
              <p>2025: Added a search function</p>
            </div>
            <br />
            <h2 className="text-xl bold text-slate-900">What is this?</h2>
            <p>
              This is a searchable Warhammer world map inspired by the amazing
              maps over at gitzmansgallery
            </p>
            {/* <p>This is intended for fan art, but (non-video game) offical art is okay</p> */}
            <br />
            <h2 className="text-xl bold text-slate-900">
              Why did you make this?
            </h2>
            <p>
              I wanted to learn QGIS, I wanted to learn react, and I like
              warhammer, so I made this.
            </p>
            <p>
              Originally I wanted to make a system that would let people share
              maps but then I realised that I really don't like react and didn't
              want to bother with it. Now I mostly use it as a personal tool for
              my campaigns.
            </p>
            <br />
            <h2 className="text-xl bold text-slate-900">
              Why does this look like shit
            </h2>
            <p>
              Because I suck at css today, and sucked even more in 2022 when I
              started making this
            </p>
            <br />
            <h2 className="text-xl bold text-slate-900">
              Why is there really bad looking AI art in here?
            </h2>
            <p>
              I used AI art in some games with my group in 2022, and loaded it
              into the map for easier finding. It was a different time.
            </p>
            <br />
            <h2 className="text-xl bold text-slate-900">Credits</h2>
            <p>
              Big thanks to gitzmansgallery for the main map. Extract from
              gitzmansgallery.com:
            </p>
            <p>
              <i>
                Some original artwork is credited to Andreas Blicher, based upon
                Alfred Nunez Jr.'s outstanding cartography and research. Many
                other sources were used including those from the Warhammer Maps
                page.
              </i>
            </p>
            <p>
              Thanks to Magnus Seter via http://altdorfer.blogspot.com for
              Altdorf. I hope to load the various POIs one day.
            </p>
            <p>
              Big thanks to{" "}
              <a href="https://www.deviantart.com/planjanusza">planjanusza</a>{" "}
              for the free listed assets on their deviantart. Amazing stuff and
              inspired me to make this. Multiple maps are used from here.
            </p>
            <br />
            <h2 className="text-xl bold text-slate-900">
              I have a high def map of a city/part of the world that I want to
              add
            </h2>
            <p>
              I can add maps for you if they're free to use or you own them. Hit
              me up on this
              <a href="https://forms.gle/5RRtzuv3Um5xN9Eh9">Google Form</a> and
              I'll try to add it for you
            </p>
            <br />
            <h2 className="text-xl bold text-slate-900">
              What's next for this thing
            </h2>
            <p>
              Route finding. I made a star map of the alien universe a while back (
              <a href="https://map.weylandyutani.company/">
                https://map.weylandyutani.company/
              </a>
              ), I might bring over the pathfinding systems so you can get map
              directions between locations with accurate distances etc.
            </p>
            <br />
            <p>
              I'll probably drop firebase as I don't want to make this a sharing
              system anymore.
            </p>
            <br />
            <p>Maybe I'll remake it in Svelte or some other language</p>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
