import $ from 'jquery';
import list from './list';
import './plugins/plugins';

// TODO: delete item
// TODO: (low priority) make left/right navigation buttons functional (make calls to get new days)
// TODO: (low priority) hover and show full text if truncated
// TODO: (low priority) Move items to different days or positions on the same day

const listItem = (() => {
    // cache dom
    const $el = $('.list');

    // bind events
    // $('.item').bind('mouseheld', mouseheld);
    $el.delegate('.item', 'click', click);
    $el.delegate('.item', 'mousedown', mousedown);
    $el.delegate('.item', 'keydown', keydown);
    $el.delegate('.item', 'focus', focus);
    $el.delegate('.item', 'blur', blur);

    // handlers
    // function mouseheld() {
    //     if ($(this).text().trim() !== '') 
    //         $(this).css({cursor: 'move'});
    // }

    function mousedown(e) {
        if (!$(this).is(':focus')) 
            e.preventDefault();
    }

    function click(e) { // focus cursor on first empty list item (prevents items from being created in the middle of the page)
        var $this = $(this);
        // double click code
        if ($this.hasClass('item-clicked')){
            $this.removeClass('item-clicked'); 

            if ($this.text().trim() !== '' && !$this.hasClass('completed')) 
                $this.focus();

        // single click code
        } else {
            $this.addClass('item-clicked');
            setTimeout(() => { 
                if ($this.hasClass('item-clicked')){
                    $this.removeClass('item-clicked'); 

                    if ($this.text().trim() === '') 
                        focusInput.call(this);

                    else if (!$this.is(':focus')) {
                        list.completeItem.call(this);
                    }
                }
            }, 300);          
        }
    }

    function focus() {
        $(this).css({'text-overflow' : 'clip'});  
    }


    function blur() {
        const $this = $(this);

        // if it had no id then it was a misclick
        if ($this.attr('data-item-id') === '') return;

        // remove item if all text is deleted
        if ($this.text().trim() === "") {
            list.deleteItem.call(this);

        // add / update item 
        } else { 
            list.addItem.call(this);

            // moves cursor to the beginning of line so ellipsis works properly
            const text = $this.text();
            $this.text('').focus().text(text).css({'text-overflow' : 'ellipsis'}).blur();
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
        const $this = $(this);
        $.each($this.parent('.content').children('.item'), function() {
            if ($this.text().trim() === '') {
                $this.attr('contenteditable', 'true').focus();
                return false;
            }
        });
    }
})();

