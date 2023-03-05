import './Controls.css'
import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import {
    fileToDataURL,
    generateThumbnailFile,
} from './ImageScalar';

import { useDropzone } from 'react-dropzone'

import { Modal } from "./DialogBoxes"







const DropZoneFileInput = ({ onChange }) => {


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onChange,
        maxFiles: 5,
        maxSize: 2120,
        onDropRejected: e => console.error(e)
    })

    return (
        <div className={'dropzone ' + (isDragActive ? "active" : "")} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (<div>Drop the files here ...</div>) : (<div>Drag image, or click to select</div>)}
        </div>
    )
}

const AddPointDialog = ({ addNewPointHook, closePointDialog }) => {

    const maxSize = 2120;
    const [errorMessge, setErrorMessage] = useState(null);
    const [images, setimages] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState();

    // Handles input change event and updates state
    async function fileChange(uploads) {
        if (!uploads || uploads.length < 1) return
        const stagedImages = []

        for (const upload of uploads) {
            if ((upload.size / 1024) > maxSize) {
                setErrorMessage("Images must be smaller than 5mb")
                return
            }
            stagedImages.push(upload)
        }
        // set the main file for upload
        setimages(stagedImages);
        // generate the thumbnail
        let thumb = await generateThumbnailFile(uploads[0], 150)
        // set the thumbnail for upload
        setThumbnail(thumb)
        // set the preview
        setThumbnailPreview(await fileToDataURL(thumb))


    }

    const handleSubmit = (e) => {
        console.log("submitting", e);
        // Prevent the browser from reloading the page
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const o = Object.fromEntries(formData.entries())
        o.public === 'true' ? o.public = true : o.public = false
        addNewPointHook({ pointData: o, file, thumbnail })
        // reset things
        setimages("")
        closePointDialog()
    }

    return (
        <div className='point-container bg-white'>
            <Modal></Modal>
            <div className=' card'>
                <form onSubmit={handleSubmit}>
                    <label>Name:
                        <input ref={input => { input && input.focus(); console.log("foucs") }} autoFocus name="name" type="text" />
                    </label>
                    <label>Image
                        {thumbnailPreview ? <img src={thumbnailPreview} alt="thumbnail" /> : null}
                        {/* <input type="file" accept="image/*" onChange={fileChange} /> */}
                        <DropZoneFileInput onChange={fileChange} />
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


const PointInfoCard = ({ point: { name, coordinates, images, owned_by_user, id, ...rest }, removePointHook }) => {
    // add button states for feedback
    const downloadImage = (src, i) => saveAs(src, name + i + '.png')
    const copyLink = () => {
        let t = new URL(location.href)
        t.searchParams.set('id', id)
        navigator.clipboard.writeText(t)
    }

    return (
        <div className=' bg-gray-500 border flex-col flex p-2 m-1 ' >
            <div>
                {images.map((src, i) => <img key={i} onClick={() => downloadImage(src, i)} className='rounded-lg h-52 md:h-96 w-auto' src={src}></img>)}

            </div>
            <div className='name'> {name}</div>
            {rest.public ? <div>Public</div> : <div>Private</div>}
            <div className='flex'>
                {/* <button title="Download" onClick={downloadImage}>⏬</button> */}
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