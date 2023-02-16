import './Controls.css'
import { useState } from 'react';
import { saveAs } from 'file-saver';




const PointInfoCard = ({ point: { name, coordinates, src } }) => {
    // add button states for feedback
    const downloadImage = () => saveAs(src, name + '.png')
    const copyLink = () => navigator.clipboard.writeText(location.href + name + coordinates)


    return (
        <div className='card' >
            <img src={src}></img>
            <div className='name'> {name}</div>
            <div>
                <button title="Download" onClick={downloadImage}>⏬</button>
                <button title="Share" onClick={copyLink}>🔗</button>

            </div>

        </div>
    )
}


const PointInfoContainer = ({ selectedPoints }) => {
    return (
        <div >
            <h3 >
                Selected point{selectedPoints.length > 1 ? "s" : ""}
            </h3>
            <div className='point-container'>
                {selectedPoints.map(p => <PointInfoCard key={p.coordinates.join()} point={p} />)}
            </div>
        </div >
    )
}



const AddPointDialog = ({ addNewPointHook, closePointDialog }) => {
    const handleSubmit = (e) => {
        // Prevent the browser from reloading the page
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const o = Object.fromEntries(formData.entries())
        o.public === 'true' ? o.public = true : o.public = false
        addNewPointHook(o)
        closePointDialog()
    }

    return (
        <div className='add-point-dialog'>
            <form onSubmit={handleSubmit}>
                <label>Name:
                    <input name="name" defaultValue={Math.random() * 10} type="text" />
                </label>
                <label>SRC:
                    <input name="src" type="text" />
                </label>
                <label>Share publically:
                    <input name="public" data-val="true" value="true" checked type="checkbox" />
                </label>

                <input type="submit" value="💾" />
                <button onClick={closePointDialog} >x</button>


            </form>

        </div>)
}

const SearchBox = () => {
    return (<label> Search
        <input type="text" />
    </label>)
}

export const ControlPanel = ({ selectedPoints, addNewPointHook, addPointDialogOpen, closePointDialog }) => {
    // const inputuseState


    return (
        <div className='controlview' >
            {addPointDialogOpen ? < AddPointDialog addNewPointHook={addNewPointHook} closePointDialog={closePointDialog} /> : "Right click to add a new location"}
            {/* <SearchBox /> */}

            {selectedPoints.length > 0 ? <PointInfoContainer selectedPoints={selectedPoints} /> : null}
        </div>
    )

}