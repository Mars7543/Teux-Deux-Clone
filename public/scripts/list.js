import $ from 'jquery';
import mustache from "mustache";
import generateUUID from './generateID';

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
            if ($(this).text() !== '' || $(this).prev().prev().text() !== '' || $(this).prev().length === 0)
                $(this).prop('contenteditable', 'true'); 
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
        const data = {
            item: $(this).text(),
            date: $(this).parent('.content').siblings('.header').children('.date').text()
        };

        // if id is empty add item to db
        if ($(this).attr('data-item-id') === "") {
            $.ajax({
                type: 'POST',
                url: '/items',
                data,
                success: function(data) {
                    console.log(data)
                    // add id to item 
                    $(this).attr('data-item-id', generateUUID()); // delete when db is implemented
                },
                error: function(error) {
                    console.log(error)

                    $(this).attr('data-item-id', generateUUID()); // delete when db is implemented
                }
            });
        
        // else update item in db
        } else {
            const id = $(this).attr('data-item-id');

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
    }

    // 'this' refers to item
    function deleteItem() {
        // do some delete stuff in db with id
        console.log($(this).attr('data-item-id'));
        $.ajax({
            type: "POST",
            url: '/items?_method=DELETE',
            data: {id: $(this).attr('data-item-id')},
            success: function() {
                $(this).parent('.content').append('<div class="item"></div><div class="item-divider"></div>');
                $(this).next().remove();
                $(this).remove();
            },
            error: function(error) {
                console.log(error)

                // delete in the future
                $(this).parent('.content').append('<div class="item"></div><div class="item-divider"></div>');
                $(this).next().remove();
                $(this).remove();
            }
        })
    }

    return { addItem, deleteItem }
})();

export default list;