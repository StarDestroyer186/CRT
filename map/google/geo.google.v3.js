var geocoder;
function getGeoNames(lng, lat, element, style) {
    if(!geocoder){
        geocoder = new google.maps.Geocoder();
    }
    var pt = new google.maps.LatLng(lat, lng);
    geocoder.geocode({
        "latLng": pt
    },
    function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results[1]) {
            ret = results[0].formatted_address;
            element.removeClass().addClass("success");
            if (style == "text") {
                element.text(ret)
            } else if (style == "val") {
                element.val(ret)
            } else if (style == "html") {
                element.htmll(ret)
            }
        } else {
            element.removeClass().addClass("fail")
        }
    });
    pt = null
}
var points = [];
function addGeoName(lng, lat, element, style) {
    points.push({
        lng: lng,
        lat: lat,
        element: element,
        style: style
    })
}
function decodeAllGeoNames() {
    var itv = setInterval(function() {
        var pt = points.shift();
        getGeoNames(pt.lng, pt.lat, pt.element, pt.style);
        if (points.length < 1) {
            clearInterval(itv);
        //alert("Decode Over")
        }
    },
    1700)
}