const zeroPad = (num, places) => String(num).padStart(places, '0')

export const secondsToHms = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + ':' : "";
    var mDisplay = m > 0 ? zeroPad(m,(h > 0? 2: 0)) : zeroPad(m,2);
    var sDisplay = ':' + (s > 0 ? zeroPad(s,2) : zeroPad(s,2))
    return hDisplay + mDisplay + sDisplay; 
}
