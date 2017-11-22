$(function(){
    var dd = new DropDown($('#choose_currency'));
    var sb = new SelectionBox($('#exclude_cities'));
    
    $(document).click(function() {
        // all dropdowns
        $('.wrapper-select-dropdown, .wrapper-input-dropdown').removeClass('active');
    });

    var inputDd = $('.wrapper-input-dropdown');
    inputDd.each(function(){
        var $item = $(this);
        if($item.data('select-type') === 'external') {
            var dd = new InputDropdown($item, sb);
        } else {
            var dd = new InputDropdown($item);            
        }
    }) 
    
    var $btn_settings = $('#btn_settings').click(function(){
        var $obj = $(this);
        $obj.addClass('menu-opened');
        $obj.next().addClass('isOpened');
        return $obj;
    });

    $('#btn_close_settings').click(function(){
        $btn_settings.removeClass('menu-opened');
        $btn_settings.next().removeClass('isOpened');
    });
});