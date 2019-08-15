import $ from 'jquery';

$(function() {
    (() => {
        const $content = $('.content');
        const $item = $('.item');

        const numItems = ($content.outerHeight() / $item.outerHeight(true)) - 1;
        
        $.each($content, function() {
            for (let i = 0; i < numItems - 1; i++) {
                console.log(i+1)
                $(this).append('<div class="item"></div><div class="item-divider"></div>');
            }
        });
    })();
});