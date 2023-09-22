function MapClassImpl(container, opts){
    this.opts_poly = {
        strokeColor: opts.lineColor || "#f00",
        strokeOpacity: opts.lineOpacity || 0.8,
        strokeWeight: opts.lineWidth || 4
    }
    this.trackline = [];

    if (GBrowserIsCompatible()) {
        this.wndMap = new GMap2(container);

        this.wndMap.setCenter(new GLatLng(opts.centerLat, opts.centerLng), opts.zoom);
        this.wndMap.setUIToDefault();
    }
}

MapClassImpl.prototype = {
    getDirPoint: function(dir){
        var ret = {x:0,y:0};
        switch(Math.round(dir / 45)){
            case 1: ret.x=30; ret.y=0; break;
            case 2: ret.x=30; ret.y=15; break;
            case 3: ret.x=30; ret.y=30; break;
            case 4: ret.x=15; ret.y=30; break;
            case 5: ret.x=0; ret.y=30; break;
            case 6: ret.x=0; ret.y=15; break;
            case 7: ret.x=0; ret.y=0; break;
            default: ret.x=15; ret.y=0;
        }
        return ret;
    },
    GeoNames: function(x, y, element, style){
        var lng = x/1000000, lat = y/1000000;
        var pt = new GLatLng(lat, lng);
        var geocoder = new GClientGeocoder();
        geocoder.getLocations(pt, function(response) {
            if (!response || response.Status.code == 200) {
                var ret = response.Placemark[0].address;
                try{
                    if(style=="text"){ element.text(ret); }
                    else if(style=="val"){ element.val(ret); }
                    else if(style=="html"){ element.htmll(ret); }
                }catch(e){}
            }
            geocoder = null;
        });
    },
    GetIcoImage: function(dir, ico, sta){
        var icon = new GIcon();
        icon.image = "img/locate/"+ico+sta+".png";
        icon.shadow = "img/locate/d"+parseInt(dir/45)+".png";
        icon.iconSize = new GSize(28, 32);
        icon.shadowSize = new GSize(15, 15);
        icon.iconAnchor = new GPoint(13, 31);
        icon.infoWindowAnchor = new GPoint(7, 7);
        return icon;
    },
    NewMarker: function(flag, lng, lat, ico, sta, dir, tips, panto, speed){
        var pt = new GLatLng(lat/1000000, lng/1000000);
        //var a = this.getDirPoint(dir);
        var image = this.GetIcoImage(dir, ico-1, sta);
        var opts = {icon: image, title: flag }
        var marker = new GMarker(pt, opts);
        marker.title = flag;
        marker.content = tips;
        marker.x = lng;
        marker.y = lat;
        marker.ico = ico;
        marker.sta = sta;
        marker.dir = dir;
        GEvent.addListener(marker, "click", function() {
            marker.openInfoWindowHtml(marker.content);
        });
        this.wndMap.addOverlay(marker);
        if(panto){
            this.wndMap.panTo(pt);
        }
		
		if(speed > 0){
			alert('ddd');
			$(".infowindow ul li.infospeed").css("padding-left: 18px; background: url('../img/move.png") no-repeat 0px;');
		}else{
			$(".infowindow ul li.infospeed").css("padding-left: 18px; background: url('../img/park.png") no-repeat 0px;');
		}
		
        return marker;
    },
    UpdateMarker: function(marker, lng, lat, ico, sta, dir, tips, panto, speed){
        if(marker.x != lng || marker.y != lat){
            var pt = new GLatLng(lat/1000000, lng/1000000);
            marker.setLatLng(pt);
        }
        if(marker.ico != ico || marker.sta != sta || marker.dir != dir){
            var image = this.GetIcoImage(dir, ico-1, sta);
            marker.setImage(image);
        }
        if(marker.content != tips){
            marker.content = tips;
        }
        if(panto){
            this.wndMap.panTo(pt);
        }
    },
    AddLine: function(x1, y1, x2, y2, color, weight, opacity){
        var route = [];
        route[0] = new  GLatLng(y1/1000000, x1/1000000);
        route[1] = new GLatLng(y2/1000000, x2/1000000);
        var line = new GPolyline(route,
            color || this.opts_poly.strokeColor,
            weight || this.opts_poly.strokeWeigh,
            opacity || this.opts_poly.strokeOpacity);
        this.wndMap.addOverlay(line);
        return line;
    },
    AddTrackPoint: function(x, y, s, opts){
        var p = this.trackpoint;
        if(typeof p != "undefined" && (p.x != 0 && p.y != 0) && (p.x != x || p.y != y)){			
            var color = getSpeedColor(s);
            var line = this.AddLine(p.x, p.y, x, y, color, opts.weight, opts.opacity);
            this.trackline.push(line);
        }
        this.trackpoint = {x: x, y: y};
    },
    DrawTrackLine: function(track, opts){
        this.Clearline();
        var color;
        /**/
        for (var i = 1; i < track.length; i++){
            color = getSpeedColor(track[i].s);
            var line = this.AddLine(track[i-1].x, track[i-1].y, track[i].x, track[i].y, color, opts.weight, opts.opacity);
            this.trackline.push(line);
        }
    },
    LocateMarker: function(marker){
        var ret = {x: marker.x, y: marker.y};		
        marker.openInfoWindowHtml(marker.content);
        this.wndMap.panTo(marker.getLatLng());
        return ret;
    },
    Clearline: function(){
        for (var i = 0; i < this.trackline.length; i++){
            var line = this.trackline[i];
            this.wndMap.removeOverlay(line);
            line = null;
        }
        this.trackline = [];
    },
    ClearMarker: function(markers){
        for(var key in markers){
            this.wndMap.removeOverlay(markers[key]);
            delete markers[key];
        }
    }
}

function getGeoNames(lng, lat, element, style){
    var pt = new GLatLng(lat, lng);
    var geocoder = new GClientGeocoder();
    geocoder.getLocations(pt, function(response) {
        if (!response || response.Status.code == 200) {
            var ret = response.Placemark[0].address;
            try{
                element.removeClass().addClass("success");
                if(style=="text"){ element.text(ret); }
                else if(style=="val"){ element.val(ret); }
                else if(style=="html"){ element.htmll(ret); }
            }catch(e){}
        }
        geocoder = null;
    });		
}