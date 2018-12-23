$(function () {
    chrome.storage.sync.get({
        enableSortByMyUpvotes: true,
        enableSortByMyAnswers: true,
        enableHighlightByMyAnswers: true,
    }, function (items) {
        $('#enable-sort-by-my-upvotes').prop('checked', items.enableSortByMyUpvotes);
        $('#enable-sort-by-my-answers').prop('checked', items.enableSortByMyAnswers);
        $('#enable-highlight-by-my-answers').prop('checked', items.enableHighlightByMyAnswers);
    });

    $('#enable-sort-by-my-upvotes').change(function () {
        chrome.storage.sync.set({
            enableSortByMyUpvotes: $('#enable-sort-by-my-upvotes').prop('checked')
        }, function () {
        });
    });

    $('#enable-sort-by-my-answers').change(function () {
        chrome.storage.sync.set({
            enableSortByMyAnswers: $('#enable-sort-by-my-answers').prop('checked')
        }, function () {
        });
    });

    $('#enable-highlight-by-my-answers').change(function () {
        chrome.storage.sync.set({
            enableHighlightByMyAnswers: $('#enable-highlight-by-my-answers').prop('checked')
        }, function () {
        });
    });

    $('.link').click(function () {
        var address = $(this).attr('data-href');
        window.open(address, '_blank').focus();
    });

    $('.brand').click(function () {
        window.open('https://github.com/lets-hack-stuff', '_blank').focus();
    });

    $('.contribute').click(function () {
        window.open('https://github.com/lets-hack-stuff/stackoverflow-upvote-first', '_blank').focus();
    });
});
