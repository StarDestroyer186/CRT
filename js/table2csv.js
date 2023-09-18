jQuery.fn.table2csv = function(options) {
    var options = jQuery.extend({
        separator: '	',
        crlf: '\n'
    },
    options);

    var csvData = [];
    var el = this;

    //header
    var tmpRow = [];
    // construct header avalible array

$(el).filter(':visible').find('th').each(function() {
        if ($(this).css('display') != 'none') {
            tmpRow[tmpRow.length] = formatData($(this).html());
        }
    });
    row2csv(tmpRow);
    // actual data
    $(el).find('tr').each(function() {
        var tmpRow = [];
        $(this).filter(':visible').find('td').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2csv(tmpRow);
    });

    var mydata = csvData.join(options.crlf);
    return mydata;

    function row2csv(tmpRow) {
        var tmp = tmpRow.join('')
        // to remove any blank rows
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    function formatData(input) {
        // replace " with ""
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, '""');
        //HTML
        regexp = new RegExp(/\<[^\<]+\>/g);
        output = output.replace(regexp, "");
        if (output == "") return '""';
        return '"' + output + '"';
    }
};