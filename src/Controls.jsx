import './Controls.css'
import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import {
    fileToDataURL,
    generateThumbnailFile,
} from './ImageScalar';

import { useDropzone } from 'react-dropzone'







function DropZoneFileInput() {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.log(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, maxFiles: 1
    })

    return (
        <div className={'dropzone ' + (isDragActive ? "active" : "")} {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <div>Drop the files here ...</div> :
                    <div>Drag image, or click to select</div>
            }
        </div>
    )
}

const AddPointDialog = ({ addNewPointHook, closePointDialog }) => {

    const maxSize = 5120;
    const [errorMessge, setErrorMessage] = useState(null);
    const [file, setFile] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState();

    // Handles input change event and updates state
    async function fileChange(event) {
        let target = event?.target?.files?.[0]
        if (!target) return
        if ((target.size / 1024) > maxSize) {
            setErrorMessage("Images must be smaller than 5mb")
            return
        }
        // set the main file for upload
        setFile(target);
        // generate the thumbnail
        let thumb = await generateThumbnailFile(target, 150)
        // set the thumbnail for upload
        setThumbnail(thumb)
        // set the preview
        setThumbnailPreview(await fileToDataURL(thumb))


    }

    const handleSubmit = (e) => {
        // Prevent the browser from reloading the page
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const o = Object.fromEntries(formData.entries())
        o.public === 'true' ? o.public = true : o.public = false
        addNewPointHook({ pointData: o, file, thumbnail })
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
                        {thumbnailPreview ? <img src={thumbnailPreview} alt="thumbnail" /> : null}
                        <input type="file" accept="image/*" onChange={fileChange} />
                        {/* <DropZoneFileInput /> */}
                        {errorMessge ? <div>Error: {errorMessge}</div> : null}

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


const PointInfoCard = ({ point: { name, coordinates, src, owned_by_user, id, ...rest }, removePointHook }) => {
    // add button states for feedback
    const downloadImage = () => saveAs(src, name + '.png')
    const copyLink = () => {
        let t = new URL(location.href)
        t.searchParams.set('id', id)
        navigator.clipboard.writeText(t)
    }

    return (
        <div className=' bg-gray-500 border flex-col flex p-2 m-1 ' >
            <img className='rounded-lg h-52 md:h-96 w-auto' src={src}></img>
            <div className='name'> {name}</div>
            {rest.public ? <div>Public</div> : <div>Private</div>}
            <div className='flex'>
            <button title="Download" onClick={downloadImage}>⏬</button>
            {rest.public ? <button title="Share" onClick={copyLink}>🔗</button> : null}
            {owned_by_user ? <button title="Delete" onClick={() => removePointHook(id)}>❌</button> : null}
            </div>
        </div>
    )
}




export const ControlPanel = ({ selectedPoints, addNewPointHook, addPointDialogOpen, closePointDialog, user, removePointHook }) => {
    // const inputuseState

    return (
        <div className='flex flex-row  ' >
            {user && addPointDialogOpen ? < AddPointDialog addNewPointHook={addNewPointHook} closePointDialog={closePointDialog} /> : null}
            {selectedPoints.length > 0 ? <>{selectedPoints.map(p => <PointInfoCard removePointHook={removePointHook} key={p.coordinates.join()} point={p} />)}</> : null}

        </div>
    )

}