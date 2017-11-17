$(function() {
    
    var dd = new DropDown( $('#choose_currency') );

    $(document).click(function() {
        // all dropdowns
        $('.wrapper-select-dropdown').removeClass('active');
    });
    
});

function DropDown(el) {
    this.dd = el;
    this.placeholder = this.dd.children('span');
    this.opts = this.dd.find('ul.dropdown > li');
    this.currentOpt = $(this.opts).filter('.checked');
    this.val = '';
    this.index = -1;
    this.initEvents();
}

DropDown.prototype = {
    initEvents : function() {
        var obj = this;

        obj.dd.on('click', function(event){
            $(this).toggleClass('active');
            return false;
        });

        obj.opts.on('click',function(){
            var opt = $(this);
            opt.addClass('checked');
            obj.currentOpt.removeClass('checked');
            obj.currentOpt = opt;
            obj.val = opt.html();
            obj.index = opt.index();
            obj.placeholder.html(obj.val);
        });
    },
    getValue : function() {
        return this.val;
    },
    getIndex : function() {
        return this.index;
    }
}