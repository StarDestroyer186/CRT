(function($){
	
	$.extend($.fn, {
		Trackbar: function(setting){
			var ps = $.extend({
				renderTo: $("body"),
				minValue: 0,
				maxValue: 100,
				position: 0,
				valueTip: false,
				enable: true,
				isPercent: false,
				sliderCss: "slider",
				barCss: "bar",
				holderCss: "holder",
				tipCss: "tip",
				onChanged: function(pos){},
				onClick: function(){}
			}, setting);

			ps.renderTo = (typeof ps.renderTo == 'string' ? $(ps.renderTo) : ps.renderTo);
			var _this = ps.renderTo;
			_this.addClass("trackbar");
			var $slider = $("<div></div>").appendTo(_this).addClass(ps.sliderCss);
		
			if(!ps.enable){
				$slider.width(_this.width());
			}else{
				var iLeft = parseInt($slider.css("margin-left"));
				var iRight = parseInt($slider.css("margin-right"));
				
				if(ps.valueTip){
					var $holder = $("<div></div>").appendTo($(_this)).addClass(ps.holderCss);
					var $tip = $("<input type='text' />").appendTo($holder).addClass(ps.tipCss).val(ps.minValue);
					iRight += $holder.width();
				}
				$slider.width($(_this).width()- iLeft - iRight);
				var $bar = $("<div></div>").appendTo($(_this)).addClass(ps.barCss);		
				
				_this.form = Math.round($bar.width() / 3);
				$bar.css("left", _this.form+"px").bind("mousedown", onDown);
				_this.to = $slider.width() - _this.form;
				_this.limited = ps.maxValue - ps.minValue;
				_this.percent = _this.to - _this.form;
				_this.startX = -ps.renderTo.offset().left - _this.form;
				_this.endX = _this.startX + _this.to;
			}
			var trackbar = $slider;
			trackbar.data = {bar: $bar, tip: $tip, setting: ps}
			return trackbar;
			
			function onDown(e){
				_this.isdown = true;
				document.onmousemove = onMove;
				document.onmouseup = onUp;
				return false;
			}
			function onMove(e){
				if(_this.isdown){
					if(!e){e = window.event;}
					if (e.preventDefault) e.preventDefault();
					e.returnValue = false;
					_this.startX = -ps.renderTo.offset().left - _this.form;
					_this.endX = _this.startX + _this.to;
					var pos = _this.startX + e.clientX;
					if(pos <= _this.form){
						pos = _this.form;
					}else if(pos >= _this.to){
						pos = _this.to;
					}
					$bar.css("left", pos + "px");

					pos = _this.limited * (pos - _this.form) / _this.percent;
					ps.position = Math.round(pos);
					if(ps.valueTip){
						$tip.val(ps.position);
					}
					ps.onChanged(ps.position);
				}
				return false;
			}
			function onUp(e){
				_this.isdown = false;
				if (document.removeEventListener) { //W3C
					document.removeEventListener('mousemove', onMove, false);
					document.removeEventListener('mouseup', onUp, false);
				}
				else if (document.detachEvent) { //IE
					document.detachEvent('onmousemove', onMove);
					document.detachEvent('onmouseup', onUp);
				}
				return false;
			}
		},
		setRange: function(min, max){
			var s = this;
			var ps = s.data.setting;
			ps.minValue = min;
			ps.maxValue = max;
			var _this = ps.renderTo;
			_this.limited = ps.maxValue - ps.minValue;
		},
		setPosition: function(v, callback){
			var s = this;
			var ps = s.data.setting;
			var _this = ps.renderTo;
			var pos = _this.form + parseInt(parseFloat(v) / _this.limited * _this.percent);
			if(pos <= _this.form){
				pos = _this.form;
			}else if(pos >= _this.to){
				pos = _this.to;
			}
			s.data.bar.css("left", pos + "px");

			pos = _this.limited * (pos - _this.form) / _this.percent;
			ps.position = v;
			if(ps.valueTip){
				s.data.tip.val(ps.position);
			}
			if(callback){
				callback(ps.position);
			}
		}
	});
})(jQuery);