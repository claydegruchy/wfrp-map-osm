import TileGrid from 'ol/tilegrid/TileGrid.js';

import { fromExtent } from 'ol/geom/Polygon';
import { getVectorContext } from "ol/render";



import { Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
const st =
    new Style({
        stroke: new Stroke({
            width: 3,
            color: 'rgba(255, 255, 255, 1)',
            lineDash: [.1, 5] //or other combinations

        })
    })




const imageStorageURL = "https://claydegruchy.github.io/wfrp-map-storage"
// const imageStorageURL = "http://localhost:8080/"


export const WarhammerMainMap = <olLayerTile preload={10} >
    <olSourceXYZ tileUrlFunction={([z, x, y]) => {
        if (z > 7) return null
        // this Z being duplicated is a little stupid 
        // but it makes the files much easier to deal with than having them all in one folder
        return imageStorageURL + `/world-map/${z}/${z}_${x}_${y}.jpg`
    }
    } />
</olLayerTile >


// const AnimatePoly = (event) => {
//     const vectorContext = getVectorContext(event);
//     const { frameState } = event;

//     console.log(vectorContext,
//         frameState);
// }

const MapImportTemplate = ({ folderName, TileGridData, minZoom = 7 }) =>
    <>
        {/* <olLayerVector
            // onPostrender={AnimatePoly}
            style={st}>
            <olSourceVector >
                <olFeature  >
                    <olGeomPolygon args={[
                        fromExtent(TileGridData.extent).getCoordinates()
                    ]} />
                </olFeature>
            </olSourceVector>
        </olLayerVector> */}

        <olLayerTile preload={3} minZoom={minZoom}>
            <olSourceTileImage
                tileGrid={new TileGrid(TileGridData)}
                tileUrlFunction={(tileCoord) => {
                    return (imageStorageURL + '/' + folderName + '{z}/{x}/{y}.png'
                        .replace('{z}', String(tileCoord[0]))
                        .replace('{x}', String(tileCoord[1]))
                        .replace('{y}', String(- 1 - tileCoord[2])));
                }}>
            </olSourceTileImage>
        </olLayerTile>
    </>

export const MarienburgMap = MapImportTemplate({
    folderName: 'marienburg/',
    TileGridData: {
        extent: [-3320017.90883266041, 4701281.93297282793, -3175634.72078718198, 4803354.42623188905],
        origin: [-3320017.90883266041, 4701281.93297282793],
        resolutions: [658.532214574588806, 329.266107287294403, 164.633053643647202, 82.3165268218236008, 41.1582634109118004, 20.5791317054559002, 10.2895658527279501, 5.14478292636397505],
        tileSize: [256, 256]
    }
})

export const AltdorfMap = MapImportTemplate({
    folderName: 'altdorf/',
    TileGridData: {
        extent: [-1879572.67834710842, 3734469.05619834783, -1754782.27834710851, 3824113.85619834764],
        origin: [-1879572.67834710842, 3734469.05619834783],
        resolutions: [537.600000000000023, 268.800000000000011, 134.400000000000006, 67.2000000000000028, 33.6000000000000014, 16.8000000000000007, 8.40000000000000036, 4.20000000000000018],
        tileSize: [256, 256]
    }
})


export const BelAliad = MapImportTemplate({
    folderName: 'bel-aliad/',
    TileGridData: {
        extent: [-6263717.82972954586, -8308152.66590153147, -6072722.52184196468, -8172069.18098247424],
        origin: [-6263717.82972954586, -8308152.66590153147],
        resolutions: [860.097080270560014, 430.048540135280007, 215.024270067640003, 107.512135033820002, 53.7560675169100008, 26.8780337584550004, 13.4390168792275002, 6.71950843961375011],
        tileSize: [256, 256]
    }
})


export const Carroburg = MapImportTemplate({
    folderName: 'carroburg/',
    TileGridData: {
        extent: [-2336072.31802160759, 3813618.46259524534, -2256925.53634464741, 3886329.45650243759],
        origin: [-2336072.31802160759, 3813618.46259524534],
        resolutions: [429.052517984537587, 214.526258992268794, 107.263129496134397, 53.6315647480671984, 26.8157823740335992, 13.4078911870167996, 6.7039455935083998, 3.3519727967541999],
        tileSize: [256, 256]
    }
})

export const Kemperbad = MapImportTemplate({
    folderName: 'kemperbad/',
    TileGridData: {
        extent: [-1299736.61052961973, 3123678.84778461512, -1234865.07755173231, 3183325.4963311227],
        origin: [-1299736.61052961973, 3123678.84778461512],
        resolutions: [316.061062011631975, 158.030531005815988, 79.0152655029079938, 39.5076327514539969, 19.7538163757269984, 9.87690818786349922, 4.93845409393174961, 2.46922704696587481],
        tileSize: [256, 256]
    }
})

export const Miragliano = MapImportTemplate({
    folderName: 'miragliano/',
    TileGridData: {
        extent: [-4605922.50961291138, -188443.516211102135, -4405031.33771685325, -34504.2169261353993],
        origin: [-4605922.50961291138, -188443.516211102135],
        resolutions: [824.168910342803201, 412.084455171401601, 206.0422275857008, 103.0211137928504, 51.5105568964252001, 25.7552784482126, 12.8776392241063, 6.43881961205315001],
        tileSize: [256, 256]
    }
})

export const Nuln = MapImportTemplate({
    folderName: 'nuln/',
    TileGridData: {
        extent: [-1279663.36192043219, 2543263.40051604761, -1156404.03022357263, 2630250.09310057852],
        origin: [-1279663.36192043219, 2543263.40051604761],
        resolutions: [541.130280463644795, 270.565140231822397, 135.282570115911199, 67.6412850579555993, 33.8206425289777997, 16.9103212644888998, 8.45516063224444991, 4.22758031612222496],
        tileSize: [256, 256]
    }
})

export const Praag = MapImportTemplate({
    folderName: 'praag/',
    TileGridData: {
        extent: [2950614.62863361603, 6650407.73730751686, 3058167.03111725114, 6733386.8636055924],
        origin: [2950614.62863361603, 6650407.73730751686],
        resolutions: [436.373383983305587, 218.186691991652793, 109.093345995826397, 54.5466729979131983, 27.2733364989565992, 13.6366682494782996, 6.81833412473914979, 3.4091670623695749],
        tileSize: [256, 256]
    }
})

export const Sartosa = MapImportTemplate({
    folderName: 'sartosa/',
    TileGridData: {
        extent: [-5783856.21840337384, -3808154.81240130635, -5691449.91520323884, -3738727.39074430056],
        origin: [-5783856.21840337384, -3808154.81240130635],
        resolutions: [560.888031563791969, 280.444015781895985, 140.222007890947992, 70.1110039454739962, 35.0555019727369981, 17.527750986368499, 8.76387549318424952, 4.38193774659212476],
        tileSize: [256, 256]
    }
})

export const Ubersreik = MapImportTemplate({
    folderName: 'ubersreik/',
    TileGridData: {
        extent: [-1982290.77342086309, 2918950.9097141684, -1930845.08820988308, 2955383.42348277988],
        origin: [-1982290.77342086309, 2918950.9097141684],
        resolutions: [330.641077877356793, 165.320538938678396, 82.6602694693391982, 41.3301347346695991, 20.6650673673347995, 10.3325336836673998, 5.16626684183369989, 2.58313342091684994],
        tileSize: [256, 256]
    }
})