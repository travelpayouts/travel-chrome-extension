import {render} from "lit-html";
import {currency_label} from './index.template.js';

export default function DropDown(el) {
    this.dd = el;
    this.placeholder = this.dd.children('span');
    this.opts = this.dd.find('ul.dropdown > li');
    this.currentOpt = $(this.opts).filter('.checked');
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
            obj.index = opt.index();
            let currency_symbol = opt.find('.currency-sign').text();

            if (opt.closest('ul').attr('id') === 'currency_dropdown') {
                render(currency_label(opt.data('currency')), document.querySelector('#currency_label'));
            } else {
                obj.placeholder.html(opt.html());
            }

            chrome.storage.sync.get('settings', function (data) {
                let settings = data.settings ? data.settings : {};
                var destination = document.getElementById('destination').getAttribute('data-iata');
                var origin = document.getElementById('origin').getAttribute('data-iata');

                if (typeof opt.data('currency') !== 'undefined') {
                    settings.currency = [opt.data('currency'), currency_symbol];
                    chrome.storage.sync.set({settings});
                    var event = new CustomEvent('update_prices', {'detail': settings.currency});
                    window.dispatchEvent(event);

                    chrome.runtime.sendMessage({cmd: 'update_all', lang: settings.lang});
                } else {
                    let lang = opt.data('lang');
                    settings.lang = lang;
                    let event2 = new CustomEvent('lang_changed', {'detail': lang});
                    window.dispatchEvent(event2);

                    chrome.runtime.sendMessage({
                        cmd: 'get_translated_destination',
                        lang: settings.lang,
                        current_origin: origin,
                        current_destination: destination
                    }, (response) => {
                        console.log('show_translated_destination');
                        console.log(response.destination_name);
                        document.querySelector('#destination').innerText = response.destination_name;
                        document.querySelector('#origin>span').innerText = response.originFrom;
                        document.querySelector('#input_origin_city').value = response.originSettings;
                    });
                    chrome.runtime.sendMessage({cmd: 'update_all', lang: settings.lang});
                }
            });

            // send event to Google Analytics
            // _gaq.push(['_trackEvent', 'settings', 'currency_change', opt.data('currency')]); //dev
        });
    }
};