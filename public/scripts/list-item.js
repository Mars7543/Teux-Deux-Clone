import $ from 'jquery';

// list item 
// has text
// edit text()
// hover and show full text
const listItem = (() => {
    // cache dom
    const $el = $('.list');

    // bind events
    $el.delegate('.item', 'click', click);
    $el.delegate('.item', 'keydown', keydown);
    $el.delegate('.item', 'focus', focus);
    $el.delegate('.item', 'blur', blur);

    // handlers
    function click() { // focus cursor on first empty list item (prevents items from being created in the middle of the page)
        if ($(this).text().trim() === '') 
            focusInput.call(this);
    }

    function focus() {
        $(this).css({'text-overflow' : 'clip'});  
    }

    function blur() {
        // moves cursor to the beginning of line so ellipsis works properly
        const text = $(this).text();
        $(this).text('').focus().text(text).css({'text-overflow' : 'ellipsis'}).blur();
    }

    function keydown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            focusInput.call(this);
        } else if ((e.key === "Delete" || e.key === "Backspace") && $(this).text() === "") {
            // $(this).removeAttr('contenteditable');
            // TODO: add delete functionality
        }
    }

    function focusInput() {
        $.each($(this).parent('.content').children('.item'), function() {
            if ($(this).text().trim() === '') {
                $(this).attr('contenteditable', 'true').focus();
                return false;
            }
        });
    }
})();

