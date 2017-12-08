// $(function(){
//     var inputDd = $('.wrapper-input-dropdown');
//     inputDd.each(function(){
//         var $item = $(this);
//         if($item.data('select-type') === 'external') {
//             var dd = new InputDropdown($item, $('#exclude_cities'));
//         } else {
//             var dd = new InputDropdown($item);            
//         }
//     })

//     $(document).click(function(){
//         $('.wrapper-input-dropdown').removeClass('active');
//     });
// });


function InputDropdown(el, selectionBox) {
    this.dd = el;
    this.input = this.dd.children('input');
    this.list = this.dd.children('.dropdown');
    this.listItems = this.list.children();
    this.selectType = this.dd.data('select-type');
    this.selectionBox = selectionBox || '';
    this.initEvents();
}

InputDropdown.prototype = {
    initEvents : function() {
        var obj = this;

        // obj.input.on('focus', function(){
        //     obj.dd.addClass('active');
        // });

        obj.dd.click(function(e){
            e.stopPropagation();

        });

        obj.listItems.click(function(){
            var value = $(this).text();
            var parsedValue = value.substring(0, value.indexOf(',')).trim();
            if(obj.selectType === 'internal') {
                obj.input.val(parsedValue);
            } else if(obj.selectType === 'external') {
                var span = '<span class="hidden-cities__item">' + parsedValue + ' ' +
                           '<img class="hidden-cities__item-icon" src="img/icons/close_8px_b0bec6.png" alt="">'+
                           '<img class="hidden-cities__item-icon--hover" src="img/icons/close_8px_263239.png" alt="">'+
                           '</span>';
                obj.selectionBox.box.append(span);
            }
            obj.dd.removeClass('active');            
        });
    }
}