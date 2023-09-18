var WND = window.parent;
var closeText = WND.JS_DATEPICKER_CLOSETEXT;
var prevText = WND.JS_DATEPICKER_PREVTEXT;
var nextText = WND.JS_DATEPICKER_NEXTTEXT;
var currentText = WND.JS_DATEPICKER_CURRENTTEXT;
var monthNames1 = WND.JS_DATEPICKER_MONTHNAMES1;
var monthNames2 = WND.JS_DATEPICKER_MONTHNAMES2;
var monthNames3 = WND.JS_DATEPICKER_MONTHNAMES3;
var monthNames4 = WND.JS_DATEPICKER_MONTHNAMES4;
var monthNames5 = WND.JS_DATEPICKER_MONTHNAMES5;
var monthNames6 = WND.JS_DATEPICKER_MONTHNAMES6;
var monthNames7 = WND.JS_DATEPICKER_MONTHNAMES7;
var monthNames8 = WND.JS_DATEPICKER_MONTHNAMES8;
var monthNames9 = WND.JS_DATEPICKER_MONTHNAMES9;
var monthNames10 = WND.JS_DATEPICKER_MONTHNAMES10;
var monthNames11 = WND.JS_DATEPICKER_MONTHNAMES11;
var monthNames12 = WND.JS_DATEPICKER_MONTHNAMES12;
var monthNamesShort1 = WND.JS_DATEPICKER_MONTHNAMESSHORT1;
var monthNamesShort2 = WND.JS_DATEPICKER_MONTHNAMESSHORT2;
var monthNamesShort3 = WND.JS_DATEPICKER_MONTHNAMESSHORT3;
var monthNamesShort4 = WND.JS_DATEPICKER_MONTHNAMESSHORT4;
var monthNamesShort5 = WND.JS_DATEPICKER_MONTHNAMESSHORT5;
var monthNamesShort6 = WND.JS_DATEPICKER_MONTHNAMESSHORT6;
var monthNamesShort7 = WND.JS_DATEPICKER_MONTHNAMESSHORT7;
var monthNamesShort8 = WND.JS_DATEPICKER_MONTHNAMESSHORT8;
var monthNamesShort9 = WND.JS_DATEPICKER_MONTHNAMESSHORT9;
var monthNamesShort10 = WND.JS_DATEPICKER_MONTHNAMESSHORT10;
var monthNamesShort11 = WND.JS_DATEPICKER_MONTHNAMESSHORT11;
var monthNamesShort12 = WND.JS_DATEPICKER_MONTHNAMESSHORT12;
var dayNames1 = WND.JS_DATEPICKER_DAYNAMES1;
var dayNames2 = WND.JS_DATEPICKER_DAYNAMES2;
var dayNames3 = WND.JS_DATEPICKER_DAYNAMES3;
var dayNames4 = WND.JS_DATEPICKER_DAYNAMES4;
var dayNames5 = WND.JS_DATEPICKER_DAYNAMES5;
var dayNames6 = WND.JS_DATEPICKER_DAYNAMES6;
var dayNames7 = WND.JS_DATEPICKER_DAYNAMES7;
var dayNamesShort1 = WND.JS_DATEPICKER_DAYNAMESSHORT1;
var dayNamesShort2 = WND.JS_DATEPICKER_DAYNAMESSHORT2;
var dayNamesShort3 = WND.JS_DATEPICKER_DAYNAMESSHORT3;
var dayNamesShort4 = WND.JS_DATEPICKER_DAYNAMESSHORT4;
var dayNamesShort5 = WND.JS_DATEPICKER_DAYNAMESSHORT5;
var dayNamesShort6 = WND.JS_DATEPICKER_DAYNAMESSHORT6;
var dayNamesShort7 = WND.JS_DATEPICKER_DAYNAMESSHORT7;
var dayNamesMin1 = WND.JS_DATEPICKER_DAYNAMESMIN1;
var dayNamesMin2 = WND.JS_DATEPICKER_DAYNAMESMIN2;
var dayNamesMin3 = WND.JS_DATEPICKER_DAYNAMESMIN3;
var dayNamesMin4 = WND.JS_DATEPICKER_DAYNAMESMIN4;
var dayNamesMin5 = WND.JS_DATEPICKER_DAYNAMESMIN5;
var dayNamesMin6 = WND.JS_DATEPICKER_DAYNAMESMIN6;
var dayNamesMin7 = WND.JS_DATEPICKER_DAYNAMESMIN7;
var weekHeader = WND.JS_DATEPICKER_WEEKHEADER;
var weekHeader = WND.JS_DATEPICKER_WEEKHEADER;

jQuery(function ($) {
    $.datepicker.regional[''] = {
        closeText: closeText,
        prevText: '&#x3c;' + prevText,
        nextText: nextText + '&#x3e;',
        currentText: currentText,
        monthNames: [monthNames1, monthNames2, monthNames3, monthNames4, monthNames5, monthNames6,
                monthNames7, monthNames8, monthNames9, monthNames10, monthNames11, monthNames12],
        monthNamesShort: [monthNamesShort1, monthNamesShort2, monthNamesShort3, monthNamesShort4, monthNamesShort5, monthNamesShort6,
                monthNamesShort7, monthNamesShort8, monthNamesShort9, monthNamesShort10, monthNamesShort11, monthNamesShort12],
        dayNames: [dayNames1, dayNames2, dayNames3, dayNames4, dayNames5, dayNames6, dayNames7],
        dayNamesShort: [dayNamesShort1, dayNamesShort2, dayNamesShort3, dayNamesShort4, dayNamesShort5, dayNamesShort6, dayNamesShort7],
        dayNamesMin: [dayNamesMin1, dayNamesMin2, dayNamesMin3, dayNamesMin4, dayNamesMin5, dayNamesMin6, dayNamesMin7],
        weekHeader: weekHeader,
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['']);
});