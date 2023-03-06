import './Controls.css'
import { useState, useCallback, useRef } from 'react';
import { saveAs } from 'file-saver';
import {
    fileToDataURL,
    generateThumbnailFile,
} from './ImageScalar';

import { useDropzone } from 'react-dropzone'

import { Modal, Button } from "./DialogBoxes"







const DropZoneFileInput = ({ onChange, onDropRejected, maxFiles }) => {


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onChange,
        maxFiles,
        maxSize: 4e6,
        onDropRejected,
    })

    return (
        <div className={'dropzone ' + (isDragActive ? "active" : "")} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (<div>Drop the files here ...</div>) : (<div>Drag image, or click to select</div>)}
        </div>
    )
}




const AddPointDialog = ({ addNewPointHook, closePointDialog }) => {

    const maxFiles = 5;

    const [errorMessge, setErrorMessage] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [mainIndex, setMainIndex] = useState(0);
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState();

    const form = useRef(null)
    console.log({ mainIndex });


    // Handles input change event and updates state
    async function fileChange(uploads) {
        if (!uploads || uploads.length < 1) return
        const stagedImages = []

        for (const upload of uploads) {
            stagedImages.push(upload)
        }
        // set the main file for upload
        setImageFiles(stagedImages);
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
        addNewPointHook({ pointData: o, imageFiles, thumbnail })
        // reset things
        setImageFiles([])
        closePointDialog()
    }

    const submitForm = useCallback(() => form.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })), [form])

    const ImagePreview = (file, i) => {
        const src = URL.createObjectURL(file)

        return <div className={`relative`}>
            {i == mainIndex ? <div className='absolute bottom-1 left-1'>⭐️</div> : null}
            {/* <div className='absolute top-1 right-1'>⭐️</div> */}
            <img onClick={() => setMainIndex(i)} className={`max-w-xs max-h-24`} src={src}></img>
        </div>
    }

    return (
        <Modal title={"Add location"} setShowModal={closePointDialog}
            customButtons={[<Button
                onClick={submitForm}
                addClasses={"text-blue-500"} >
                Submit
            </Button >]}
        >

            <form className='w-96' ref={form} onSubmit={handleSubmit}>
                <label>Name:
                    <input ref={input => { input && input.focus() }} autoFocus name="name" type="text" />
                </label>
                <div className='p-5 flex flex-wrap gap-1 justify-around'>
                    {imageFiles.map(ImagePreview)}
                </div>
                {/* {thumbnailPreview ? <img src={thumbnailPreview} alt="thumbnail" /> : null} */}
                {/* <input type="file" accept="image/*" onChange={fileChange} /> */}
                {imageFiles.length >= maxFiles ? null : <DropZoneFileInput onChange={fileChange} onDropRejected={console.error} maxFiles={maxFiles} />}

                {errorMessge ? <div>Error: {errorMessge}</div> : null}

                <label>Share publically:
                    <input name="public" data-val="true" value="true" defaultChecked type="checkbox" />
                </label>
                <div>
                    <input hidden type="submit" value="💾" />
                </div>
            </form>
        </Modal >

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
                {images && images.map((src, i) => <img key={i} onClick={() => downloadImage(src, i)} className='rounded-lg h-52 md:h-96 w-auto' src={src}></img>)}

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