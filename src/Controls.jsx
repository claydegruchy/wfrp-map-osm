import './Controls.css'
import { useState } from 'react';
import { saveAs } from 'file-saver';



const PointInfoCard = ({ point: { name, coordinates, src, owned_by_user, id, ...rest }, removePointHook }) => {
    // add button states for feedback
    const downloadImage = () => saveAs(src, name + '.png')
    const copyLink = () => navigator.clipboard.writeText(location.href + name + coordinates)


    return (
        <div className='card' >
            <img src={src}></img>
            <div className='name'> {name}</div>

            {rest.public ? <div>Public</div> : <div>Private</div>}

            <div>
                <button title="Download" onClick={downloadImage}>⏬</button>
                {rest.public ? <button title="Share" onClick={copyLink}>🔗</button> : null}
                {owned_by_user ? <button title="Delete" onClick={() => removePointHook(id)}>❌</button> : null}

            </div>
        </div>
    )
}


const PointInfoContainer = ({ selectedPoints, removePointHook }) => {
    return (
        <div >
            <h3 >
                Selected point{selectedPoints.length > 1 ? "s" : ""}
            </h3>
            <div className='point-container'>
                {selectedPoints.map(p => <PointInfoCard removePointHook={removePointHook} key={p.coordinates.join()} point={p} />)}
            </div>
        </div >
    )
}



const AddPointDialog = ({ addNewPointHook, closePointDialog }) => {


    const [file, setFile] = useState("");
    // Handles input change event and updates state
    function fileChange(event) {
        setFile(event.target.files[0]);
        
    }

    const handleSubmit = (e) => {
        // Prevent the browser from reloading the page
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const o = Object.fromEntries(formData.entries())
        o.public === 'true' ? o.public = true : o.public = false
        addNewPointHook({pointData:o, file})
        // reset things
        setFile("")
        closePointDialog()
    }

    return (
        <div className='point-container'>
            <div className=' card'>
                <form onSubmit={handleSubmit}>
                    <label>Name:
                        <input ref={input => { input && input.focus(); console.log("foucs") }} autoFocus name="name" type="text" />
                    </label>
                    <label>Image
                        <input type="file" accept="image/*" onChange={fileChange} /> 

                    </label>
                    <label>Share publically:
                        <input name="public" data-val="true" value="true" defaultChecked type="checkbox" />
                    </label>
                    <div>
                        <input type="submit" value="💾" />
                        <button onClick={closePointDialog} title="Cancel">❌</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const SearchBox = () => {
    return (<label> Search
        <input type="text" />
    </label>)
}

export const ControlPanel = ({ selectedPoints, addNewPointHook, addPointDialogOpen, closePointDialog, user, removePointHook }) => {
    // const inputuseState

    return (
        <div className='controlview' >
            {user && addPointDialogOpen ? < AddPointDialog addNewPointHook={addNewPointHook} closePointDialog={closePointDialog} /> : null}
            {/* <SearchBox /> */}

            {selectedPoints.length > 0 ? <PointInfoContainer selectedPoints={selectedPoints} removePointHook={removePointHook} /> : null}
        </div>
    )

}