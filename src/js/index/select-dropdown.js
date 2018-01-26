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
            var currency_symbol = opt.find('.currency-sign').html();

            chrome.storage.sync.get('settings', function(data){
                if(data.settings) {
                    var settings = data.settings;
                } else {
                    var settings = {};
                }
                settings.currency = [opt.data('currency'), currency_symbol];
                chrome.storage.sync.set({settings});
                var event = new CustomEvent('update_price', {'detail': settings.currency});
                window.dispatchEvent(event);
                chrome.runtime.sendMessage({cmd: 'update_deals'});              
            });

            // send event to Google Analytics
            _gaq.push(['_trackEvent', 'settings', 'currency_change', opt.data('currency')]);
        });
    },
    getValue : function() {
        return this.val;
    },
    getIndex : function() {
        return this.index;
    }
}