/*
* This is the basic client that will attempt to get data out of LERC tiles.
* The data from each tile of the LERC data set is stored into an array under the
* correct layer during tile load, and each time the map is moved around, zoomed, etc.,
* the visible lerc tiles are drawn based on user given parameters like color and
* range.
*/
import LERC from "./LercCodec";
import {
    getPalette,
    getPaletteLegend,
    getLookup as getPaletteLookup,
  } from '../modules/palettes/selectors';
import { cloneDeep as lodashCloneDeep } from 'lodash';

// graceal this needs to be deleted later
var defaultNoDataValue = 65535;

/**
 * Loads a lerc layer tile to the map
 * @param {object} tile
 * @param {object} src Link to LERC layer
 * @param {map} layer information about properties of the layer
 * @param {object} map OpenLayers map
 * @param {object} state State of the map
 * @param {object} tilegrid OlTileGridWMTS
 */
export function tileLoader(tile, src, layer, map, state, tilegrid, groupString) {
    console.log("graceal1 layer is ");
    console.log(layer);
    console.log("groupstring is "+groupString);
    const lercCodec = new LERC();
    const img = tile.getImage();
    const STATE_LOADING = 1;
    const STATE_LOADED = 2;
    const STATE_ERROR = 3;

    // load in the image with crossOrigin allowances
    tile.state = STATE_LOADING;
    tile.changed();
    let view = map.getView();
    fetch(src)
        .then(response => {
            return response.arrayBuffer();
        })
        .then(buffer => {
            // graceal how do I find no data value?
            const decodedData = lercCodec.decode(buffer, { returnMask: true, noDataValue: defaultNoDataValue });
            const { pixelData, width, height } = decodedData;

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            let zoom = tilegrid.getZForResolution(view.getResolution(), 0);

            // copy pixelData to new array with a deep copy, and pass that into drawTiles
            let size = tilegrid.getTileSize(zoom);
            let opacity = 255;

            const palette = getPalette(layer.id, 0, groupString || "active", state);
            const legend = getPaletteLegend(layer.id, 0, groupString || "active", state);
            console.log("graceal1 palette is");
            console.log(palette);

            const max = palette.legend.colors.length - 1;
            const start = palette.min ? legend.refs.indexOf(palette.entries.refs[palette.min]) : 0;
            const end = palette.max ? legend.refs.indexOf(palette.entries.refs[palette.max]) : max;

            const filter = start != 0 || end != max;

            drawTile(
                pixelData,
                layer,
                ctx,
                tile,
                tilegrid,
                size,
                start,
                end,
                opacity,
                filter,
                map,
                state
            );

            img.decodedPixels = pixelData;
            img.src = canvas.toDataURL();
            tile.state = STATE_LOADED;
            tile.changed();
        })
        .catch(error => {
            console.error("Tile loading error:", error);
            tile.state = STATE_ERROR;
            tile.changed();
        });
}

/*
* Draws a tile at the starting pixel with the given size, opacity, and
* using the color_scale and min, max specified.
*/
function drawTile(
    pixelData,
    layer,
    context,
    tile,
    tilegrid,
    size,
    min,
    max,
    opacity,
    filter,
    map,
    state
) {
    var tile_coord = tile.getTileCoord();
    var pixel = findDrawTilePixel(tilegrid, tile_coord, map);
    pixel = [Math.round(pixel[0]), Math.round(pixel[1])];
    var image = context.createImageData(size, size);
    var values = pixelData;
    var no_data_value = defaultNoDataValue;

    /* If the filter is not on, display everything, just make numbers above max max color and below min min color */
    if (!filter) {
        for (let j = 0; j < values.length; j++) {
            var value = values[j];
            if (value != no_data_value) {
                if (value < min) {
                    value = min;
                }
                if (value > max) {
                    value = max;
                }
                var colors = getGreyScalar(value, min, max)
                image.data[j * 4] = colors[0];
                image.data[j * 4 + 1] = colors[1];
                image.data[j * 4 + 2] = colors[2];
                image.data[j * 4 + 3] = opacity;
            } else {
                image.data[j * 4] = 0;
                image.data[j * 4 + 1] = 0;
                image.data[j * 4 + 2] = 0;
                image.data[j * 4 + 3] = 0;
            }
        }
    } else {
        /* If the filter is on, do not display pixels below min and above max */
        for (let j = 0; j < values.length; j++) {
            var value = values[j];
            if (value != no_data_value && value > min && value < max) {
                var colors = getGreyScalar(value, min, max)
                image.data[j * 4] = colors[0];
                image.data[j * 4 + 1] = colors[1];
                image.data[j * 4 + 2] = colors[2];
                image.data[j * 4 + 3] = opacity;
            } else {
                image.data[j * 4] = 0;
                image.data[j * 4 + 1] = 0;
                image.data[j * 4 + 2] = 0;
                image.data[j * 4 + 3] = 0;
            }
        }
    }
    /* Fixes issues with retina displays by drawing and scaling on a different canvas */
    var new_canvas = document.createElement("canvas");
    new_canvas.width = size * devicePixelRatio;
    new_canvas.height = size * devicePixelRatio;

    context.putImageData(image, 0, 0);

    /* if the user has changed the palette, make sure to update the color */
    if (layer.custom) {
        const lookup = getPaletteLookup(layer.id, "active", state);
        changeColorPalette(image, lookup, new_canvas, context)
    }
}

function changeColorPalette(imageData, lookup, new_canvas, context) {
    const octets = new_canvas.width * new_canvas.height * 4;
    console.log("graceal1 lookup");
    console.log(lookup)

    // Process each pixel to color-swap single color palettes
    const pixels = imageData.data;
    const colorLookupObj = lodashCloneDeep(lookup);
    const defaultColor = Object.keys(lookup)[0];
    const paletteColor = lookup[Object.keys(lookup)[0]];

    // Load black/transparent into the lookup object
    colorLookupObj['0,0,0,0'] = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
    };

    for (let i = 0; i < octets; i += 4) {
        const pixelColor = `${pixels[i + 0]},${
            pixels[i + 1]},${
            pixels[i + 2]},${
            pixels[i + 3]}`;

        if (!colorLookupObj[pixelColor]) {
            // Handle non-transparent pixels that do not match the palette exactly
            const defaultColorArr = defaultColor.split(',');
            const pixelColorArr = pixelColor.split(',');

            // Determine difference of pixel from default to replicate anti-aliasing
            const rDifference = pixelColorArr[0] - defaultColorArr[0];
            const gDifference = pixelColorArr[1] - defaultColorArr[1];
            const bDifference = pixelColorArr[2] - defaultColorArr[2];
            const alphaValue = pixelColorArr[3];

            // Store the resulting pair of pixel color & anti-aliased adjusted color
            colorLookupObj[pixelColor] = {
            r: paletteColor.r + rDifference,
            g: paletteColor.g + gDifference,
            b: paletteColor.b + bDifference,
            a: alphaValue,
            };
        }

        // set the pixel color
        imageData.data[i + 0] = colorLookupObj[pixelColor].r;
        imageData.data[i + 1] = colorLookupObj[pixelColor].g;
        imageData.data[i + 2] = colorLookupObj[pixelColor].b;
        imageData.data[i + 3] = colorLookupObj[pixelColor].a;
    }
    context.putImageData(imageData, 0, 0);
}

/* Finds the top left pixel that specifies where a tile should be drawn from */
function findDrawTilePixel(tilegrid, tile_coord, map) {
    var extent = tilegrid.getTileCoordExtent(tile_coord);
    var coord = [extent[0], extent[3]];
    var pixel = map.getPixelFromCoordinate(coord);
    return pixel;
}

function getImgData(mapLayer, tileCoord) {
    return mapLayer
        .getSource()
        .tileCache.get(tileCoord.join("/"))
        .getImage().decodedPixels;
}

// most basic color function that will be used for LERC unless the palette is changed
function getGreyScalar(val, min, max) {
    var colors = [];
    colors[0] = 255 * (val - min) / (max - min);
    colors[1] = colors[0];
    colors[2] = colors[0];
    return colors;
}

/**
 * Finds the value where the mouse currently is
 * This function is not currently in use, but left in for future potential use
 */
export function findValue(map, pixel, layer) {
    var coord = map.getCoordinateFromPixel(pixel); // this line seems to be correct
    var tilegrid = layer.getSource().getTileGrid();
    var tileCoord = tilegrid.getTileCoordForCoordAndResolution(
        coord,
        map.getView().getResolution()
    );

    var tile_extent = tilegrid.getTileCoordExtent(tileCoord); // this seems right
    var tilePixel = map.getPixelFromCoordinate([tile_extent[0], tile_extent[3]]);
    var row = pixel[0] - tilePixel[0];
    var column = pixel[1] - Math.round(tilePixel[1]);
    var zoom = tilegrid.getZForResolution(map.getView().getResolution()); // this seems to be correct
    var i = Math.round(column * tilegrid.getTileSize(zoom) + row);
    var value = getImgData(layer, tileCoord)[i];

    // if the value equals the no data value, set value to N/A. Need to find way to get the layer's no data value
    /*if (value == getNoDataValue(layer, tileCoord)) {
        value = "N/A";
    }*/
    return value;
}