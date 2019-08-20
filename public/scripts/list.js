import $ from 'jquery';
import mustache from "mustache";
import generateUUID from './plugins/generateID';

// TODO: Make _getDays() asynchronous
// TODO: Implement DB and remove testing code in ajax calls

const list = (() => {
    let days = _getDays();

    // cache dom
    const $el = $('#listModule')
    const template = $el.children('#list-template').html();

    // render
    function _render() {
        $el.html(mustache.render(template, { days }))
        
        // add contenteditable prop to items with text in them already
        $.each($('.item'), function() {
            const $this = $(this);

            if ($this.text() !== '' || $this.prev().prev().text() !== '' || $this.prev().length === 0)
                $this.prop('contenteditable', 'true'); 
        });

        $('hr').height($('.content').height());
    }

    _render();

    function _getDays() {
        var request = new XMLHttpRequest();
        request.open('GET', '/items.json?startdate=7-17-2019&enddate=7-21-2019', false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            let days = JSON.parse(request.responseText);

            // pad days with few items
            days.forEach(({ items }) => {
                while (items.length < 15) 
                    items.push({ item: "", complete: "" })
            })

            return days;
        }
    }

    // 'this' refers to item
    function addItem() {
        const $this = $(this);
        const data = {
            item: $this.text(),
            date: $this.parent('.content').siblings('.header').children('.date').text()
        };

        // if id is empty add item to db
        if ($this.attr('data-item-id') === "") {
            $.ajax({
                type: 'POST',
                url: '/items',
                data,
                success: function(data) {
                    console.log(data)
                    // add id to item 
                    $this.attr('data-item-id', generateUUID()); 
                    $this.css({cursor: 'pointer'});
                },
                error: function(error) {
                    console.log(error)

                    $this.attr('data-item-id', generateUUID()); 
                    $this.css({cursor: 'pointer'});
                }
            });
        
        // else update item in db
        } else _updateItem.call(this, data);
    }

    function _updateItem(data) {
        const $this = $(this);

        const id = $this.attr('data-item-id');

        $.ajax({
            type: 'POST',
            url: `/items/${id}?_method=PUT`,
            data,
            success: function(data) {
                console.log(data)
            },
            error: function(error) {
                console.log(error)
            }
        });
    }

    function completeItem() {
        const $this = $(this);
        
        if ($this.hasClass('completed')) {
            $this.removeClass('completed');
            _updateItem.call(this, { completed: 'false' });

        } else {
            $this.addClass('completed');
            _updateItem.call(this, { completed: 'true' });
        }
    }

    // 'this' refers to item
    function deleteItem() {
        const $this = $(this);

        $.ajax({
            type: "POST",
            url: '/items?_method=DELETE',
            data: {id: $this.attr('data-item-id')},
            success: (data) => {
                $this.parent('.content').append('<div class="item"></div><div class="item-divider"></div>');
                $this.next().remove();
                $this.remove();
            },
            error: (error) => {
                console.log(error)

                $this.parent('.content').append('<div class="item"></div><div class="item-divider"></div>');
                $this.next().remove();
                $this.remove();
            }
        })
    }



    return { addItem, deleteItem, completeItem }
})();

export default list;