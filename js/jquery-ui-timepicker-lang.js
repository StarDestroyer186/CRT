var WND = window.parent;
var timeOnlyTitle = WND.JS_TIMEPICKER_TIMEONLYTITLE;
var timeText = WND.JS_TIMEPICKER_TIMETEXT;
var hourText = WND.JS_TIMEPICKER_HOURTEXT;
var minuteText = WND.JS_TIMEPICKER_MINUTETEXT;
var secondText = WND.JS_TIMEPICKER_SECONDTEXT;
var millisecText = WND.JS_TIMEPICKER_MILLISECTEXT;
var timezoneText = WND.JS_TIMEPICKER_TIMEZONETEXT;
var currentText = WND.JS_TIMEPICKER_CURRENTTEXT;
var closeText = WND.JS_TIMEPICKER_CLOSETEXT;

(function($) {
	$.timepicker.regional[''] = {
		timeOnlyTitle: timeOnlyTitle,
		timeText: timeText,
		hourText: hourText,
		minuteText: minuteText,
		secondText: secondText,
		millisecText: millisecText,
		timezoneText: timezoneText,
		currentText: currentText,
		closeText: closeText,
		timeFormat: 'HH:mm',
		amNames: ['AM', 'A'],
		pmNames: ['PM', 'P'],
		isRTL: false
	};
	$.timepicker.setDefaults($.timepicker.regional['']);
})(jQuery);
