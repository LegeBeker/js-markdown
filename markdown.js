console.log('markdown.js loaded');

$(document).ready(function () {
    $('.markdown').each(function () {
        var text = $(this).data('text');

        var result = parse(text);

        $(this).html(result);
    });
});

function parse(text) {
    text = text.replace(/^# (.*)$/gm, '<h1>$1</h1>');
    text = text.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    text = text.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
    text = text.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
    text = text.replace(/^###### (.*)$/gm, '<h6>$1</h6>');

    text = text.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*)\*/g, '<em>$1</em>');

    text = text.replace(/!\[(.*)\]\((.*)\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\[(.*)\]\((.*)\)/g, '<a href="$2">$1</a>');

    text = text.replace(/`(.*)`/g, '<code>$1</code>');

    text = parseCheckbox(text);

    text = text.replace(/^- (.*)$/gm, '<li>$1</li>');

    text = text.replace(/(<li>.*<\/li>\n?)+/g, function (match) {
        const items = match.split('\n').filter(Boolean).join('');
        return '<ul>' + items + '</ul>';
    });

    text = text.replace(/([^<])\n/g, '$1<br>');
    text = text.replace(/<li>(.*)<\/li><br>/g, '<li>$1</li>');

    return text;
}

function parseCheckbox(text) {
    var checkboxCount = 0;
    var checkboxRegex = /- \[([ x])\]/g;
    return text.replace(checkboxRegex, function (match, checked) {
        checkboxCount++;
        return '<input type="checkbox" data-count="' + checkboxCount + '" ' + (checked == 'x' ? 'checked' : '') + ' onchange="updateCheckbox(this)">';
    });
}

function updateCheckbox(checkbox) {
    var count = $(checkbox).data('count');
    var checked = $(checkbox).prop('checked');
    var text = $(checkbox).parent().data('text');
    var url = $(checkbox).parent().data('url');
    var name = $(checkbox).parent().data('name');

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

    $(checkbox).parent().data('text', text);
    $(checkbox).parent().html(parse(text));

    var data = {};
    data[name] = text;

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function (data) {
            if (data.success) {
                console.log(data);
            }
        }, error: function (data) {
            console.log(data);
        }
    });
}