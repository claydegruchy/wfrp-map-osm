import './Controls.css'

import { saveAs } from 'file-saver';


const PointInfoCard = ({ point: { name, coordinate, src } }) => {
    // add button states for feedback
    const downloadImage = () => saveAs(src, name + '.png')
    const copyLink = () => navigator.clipboard.writeText(location.href + name + coordinate)


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
                {selectedPoints.map(p => <PointInfoCard key={p.coordinate.join()} point={p} />)}
            </div>
        </div >
    )
}


const addPoint = (points, setPoints) => {
    console.log(points)
    setPoints([...points, {
        name: Math.random().toString(), coordinate: [Math.random() * 1000000, Math.random() * 1000000]
    }])
}



const SearchBox = () => {
    return (<label> Search
        <input type="text" />
    </label>)
}

export const ControlPanel = ({ points, setPoints, selectedPoints }) => {

    return (
        <div className='controlview' >
            <div>
                <div>controls</div>
            </div>
            {/* <SearchBox /> */}
            <div>
                <button onClick={() => addPoint(points, setPoints)}>+</button>
            </div>
            {selectedPoints.length > 0 ? <PointInfoContainer selectedPoints={selectedPoints} /> : null}
        </div>
    )

}