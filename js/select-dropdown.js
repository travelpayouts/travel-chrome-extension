import {use} from '@appnest/lit-translate';

export default function DropDown(el) {
    this.dd = el;
    this.placeholder = this.dd.children('span');
    this.opts = this.dd.find('ul.dropdown > li');
    this.currentOpt = $(this.opts).filter('.checked');
    this.val = '';
    this.index = -1;
    this.initEvents();
}

DropDown.prototype = {
    initEvents: function () {
        var obj = this;

        obj.dd.on('click', function (event) {
            $(this).toggleClass('active');
            return false;
        });

        obj.opts.on('click', function () {
            var opt = $(this);
            opt.addClass('checked');
            obj.currentOpt.removeClass('checked');
            obj.currentOpt = opt;
            obj.val = opt.html();
            obj.index = opt.index();
            obj.placeholder.html(obj.val);
            var currency_symbol = opt.find('.currency-sign').text();


            chrome.storage.sync.get('settings', function (data) {
                let settings;
                if (data.settings) {
                    settings = data.settings;
                } else {
                    settings = {};
                }
                if (typeof opt.data('currency') !== 'undefined') {
                    settings.currency = [opt.data('currency'), currency_symbol];
                    chrome.storage.sync.set({settings});
                    var event = new CustomEvent('update_prices', {'detail': settings.currency});
                    window.dispatchEvent(event);

                    var origin = document.getElementById('origin').getAttribute('data-iata');
                    var destination = document.getElementById('destination').getAttribute('data-iata');
                    chrome.runtime.sendMessage({
                        cmd: 'update_deals',
                        current_origin: origin,
                        current_destination: destination
                    });
                } else {
                    use(opt.data('lang'));
                    settings.lang = opt.data('lang');
                    chrome.storage.sync.set({settings});
                    chrome.runtime.sendMessage({
                        cmd: 'update_deals',
                        lang: settings.lang
                    });
                }
            });

            // send event to Google Analytics
            // _gaq.push(['_trackEvent', 'settings', 'currency_change', opt.data('currency')]); //dev
        });
    },
    getValue: function () {
        return this.val;
    },
    getIndex: function () {
        return this.index;
    }
}