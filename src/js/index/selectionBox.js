// $(function(){
//     var sb = new SelectionBox($('#exclude_cities'));
// });

function SelectionBox($el) {
    this.box = $el;
    this.boxItems = $el.children();
    this.initEvents();
}

SelectionBox.prototype = {
    initEvents : function() {
        var obj = this;

        obj.box.on('click', '.'+obj.boxItems.eq(0).attr('class'), function(){
            $(this).remove();
        });
    },
}