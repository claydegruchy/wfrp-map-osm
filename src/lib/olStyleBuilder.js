import { Fill, Stroke, Circle as CircleStyle, Style, Text } from 'ol/style';

export const olStyleBuilder = (i = {}) => {
    // this immense clunky hunk of shit sets the styles

    let {
        strokeWidth,
        strokeColor,
        fillColor,
        circleRadius,
        txt,
    } = {
        strokeWidth: 1.25,
        strokeColor: '#3399CC',
        fillColor: 'rgba(255,255,255,0.1)',
        circleRadius: 5,
        txt: '',
        ...i
    }

    const fill = new Fill({
        color: fillColor,
    });
    const stroke = new Stroke({
        color: strokeColor,
        width: strokeWidth,
    });
    const text = new Text({
        text: txt,
        scale: 1.3,
        fill: new Fill({
            color: '#000000'
        }),
        stroke: new Stroke({
            color: '#FFFF99',
            width: 3.5
        })
    })

    return new Style({
        image: new CircleStyle({
            fill: fill,
            stroke: stroke,
            radius: circleRadius,
        }),
        fill,
        stroke, text
    })

}