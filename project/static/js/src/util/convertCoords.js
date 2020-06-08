export function toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.round((minutesNotTruncated - minutes)*10 * 60)/10;

    return degrees + "°" + minutes + "'" + seconds + "\"";
}

export function convertDMS(lat, lng) {
    let dms = '';
    let dmsCardinal = '';
    if (lat){
        dms = toDegreesMinutesAndSeconds(lat);
        dmsCardinal = lat >= 0 ? "N" : "S";
    }
    if (lng){
        dms = toDegreesMinutesAndSeconds(lng);
        dmsCardinal = lng >= 0 ? "E" : "W";
    }

    return dms + " " + dmsCardinal;
}