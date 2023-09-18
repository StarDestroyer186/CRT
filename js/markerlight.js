function MarkerLight(latlng, opts) {
	this.latlng = latlng;

	if (!opts) opts = {};

	this.height_ = opts.height || 32;
	this.width_ = opts.width || 32;
	this.title_ = opts.title || "";
	this.image_ = opts.image;
	this.imageOver_ = opts.imageOver;
	this.clicked_ = 0;
}

MarkerLight.prototype = new GOverlay();

MarkerLight.prototype.initialize = function(map) {
	var me = this;

	var div = document.createElement("div");
	div.style.border = "none";
	div.style.position = "absolute";
	div.style.paddingLeft = "0px";
	div.style.cursor = 'pointer';
	div.title = this.title_;

	var img = document.createElement("img");
	img.src = me.image_;
	img.style.width = me.width_ + "px";
	img.style.height = me.height_ + "px";
	div.appendChild(img);  

	this.map_ = map;
	this.div_ = div;

	GEvent.addDomListener(this.div_, "click", function(event) {
		me.clicked_ = 1;
		GEvent.trigger(me, "click");
	});

	map.getPane(G_MAP_MARKER_PANE).appendChild(div);
};

MarkerLight.prototype.remove = function() {
	this.div_.parentNode.removeChild(this.div_);
};

MarkerLight.prototype.copy = function() {
	var opts = {};
	opts.color = this.color_;
	opts.height = this.height_;
	opts.width = this.width_;
	opts.image = this.image_;
	opts.imageOver = this.image_;
	return new MarkerLight(this.latlng, opts);
};

MarkerLight.prototype.redraw = function(force) {
	if (!force) return;
	var divPixel = this.map_.fromLatLngToDivPixel(this.latlng);

	this.div_.style.width = this.width_ + "px";
	this.div_.style.left = (divPixel.x) + "px";
	this.div_.style.height = (this.height_) + "px";
	this.div_.style.top = (divPixel.y) - this.height_ + "px";
};

MarkerLight.prototype.getZIndex = function(m) {
	return GOverlay.getZIndex(marker.getPoint().lat())-m.clicked*10000;
};

MarkerLight.prototype.getPoint = function() {
	return this.latlng;
};

MarkerLight.prototype.setStyle = function(style) {
	for (s in style) {this.div_.style[s] = style[s];}
};

MarkerLight.prototype.setImage = function(image) {
	this.div_.style.background = 'url("' + image + '")';
};

