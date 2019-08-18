import $ from 'jquery';
import list from './list';

// TODO: complete item
// TODO: hover and show full text if truncated
// TODO: (low priority) Move items to different days or positions on the same day
// TODO: (low priority) make left/right navigation buttons functional (make calls to get new days)

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
        if ($(this).text().trim() === '') {
            focusInput.call(this);
        } else $(this).prop('contenteditable', true).focus();
    }

    function focus() {
        $(this).css({'text-overflow' : 'clip'});  
    }


    function blur() {
        // remove item if all text is deleted
        if ($(this).text().trim() === "") {
            list.deleteItem.call(this);

        // add / update item 
        } else { 
            list.addItem.call(this);

            // moves cursor to the beginning of line so ellipsis works properly
            const text = $(this).text();
            $(this).text('').focus().text(text).css({'text-overflow' : 'ellipsis'}).blur();

        }
    }

    function keydown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            focusInput.call(this);
        }
    }

    // focus proper input
    function focusInput() {
        $.each($(this).parent('.content').children('.item'), function() {
            if ($(this).text().trim() === '') {
                $(this).attr('contenteditable', 'true').focus();
                return false;
            }
        });
    }
})();

