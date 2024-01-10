import {
    useState,
} from "react";

import "./MapView.css";


//   const filesize = (file) =>{
//     var base64str = file.substr(22);
// var decoded = atob(base64str);
// Buffer.from(data).toString('base64');


// console.log("FileSize: " + decoded.length);

//   }

export const fileToDataURL = (file)=>
     new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result)
        };
        reader.readAsDataURL(file);
    })




export const generateThumbnailFile = async (file, maxHeight) => {
    var reader = new FileReader();
    var canvas = document.createElement("canvas")
    var ctx = canvas.getContext('2d');

    return await new Promise((resolve, reject) => {
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                var scaleRatio = maxHeight / img.height
                let w = Math.min(img.width * scaleRatio, 300)
                let h = img.height * scaleRatio
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                return canvas.toBlob((blob) => resolve(new File([blob], "fileName.jpg", { type: "image/jpeg" })), 'image/jpeg', 0.8)
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    })
}




export const ScalarTest = () => {


    const reader = new FileReader();

    const [file, setFile] = useState("");
    const [thumb, setThumb] = useState("");



    async function fileChange(event) {
        var target = event.target.files[0]
        setFile(target);
        console.log('size',target.size / 1024);
        // 5mb
        // 5120
        var mod = await generateThumbnailFile(target, 150)
        
        setThumb( await fileToDataURL(mod))
    }



    // if(file) var preview = URL.createObjectURL(file)
    return (
        <div className="preview-popup">
            <img src={thumb} alt="" />
            <label style={{ backgroundColor: 'red' }}>Image
                <input type="file" accept="image/*" onChange={fileChange} />

            </label>

        </div>
    )
}