console.log('markdown.js loaded');

$(document).ready(function () {
    $('.markdown').each(function () {
        var text = $(this).data('text');

        var result = parse(text);

        $(this).html(result);
    });
});

function parse(text) {
    text = text.replace(/\n/g, '<br>');

    var checkboxCount = 0;
    var checkboxRegex = /- \[([ x])\]/g;
    text = text.replace(checkboxRegex, function (match, checked) {
        checkboxCount++;
        return '<input type="checkbox" data-count="' + checkboxCount + '" ' + (checked == 'x' ? 'checked' : '') + ' onchange="updateCheckbox(this)">';
    });

    return text;
}

function updateCheckbox(checkbox) {
    var count = $(checkbox).data('count');
    var checked = $(checkbox).prop('checked');
    var text = $(checkbox).parent().data('text');

    var checkboxRegex = /- \[([ x])\]/g;
    var match;
    var i = 0;
    while ((match = checkboxRegex.exec(text)) != null) {
        if (i == count - 1) {
            text = text.substring(0, match.index) + '- [' + (checked ? 'x' : ' ') + ']' + text.substring(match.index + match[0].length);
            break;
        }
        i++;
    }
    // temp
    console.log(text);
    $('.preview').html(text);
    // end temp

    $(checkbox).parent().data('text', text);
}