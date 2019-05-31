import {html, render} from "lit-html";

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
                var destination = document.getElementById('destination').getAttribute('data-iata');
                var origin = document.getElementById('origin').getAttribute('data-iata');

                if (typeof opt.data('currency') !== 'undefined') {
                    settings.currency = [opt.data('currency'), currency_symbol];
                    chrome.storage.sync.set({settings});
                    var event = new CustomEvent('update_prices', {'detail': settings.currency});
                    window.dispatchEvent(event);

                    chrome.runtime.sendMessage({
                        cmd: 'update_deals',
                        lang: settings.lang,
                        current_origin: origin,
                        current_destination: destination
                    });
                } else {
                    let lang = opt.data('lang');
                    settings.lang = lang;
                    let event2 = new CustomEvent('lang_changed', {'detail': lang});
                    window.dispatchEvent(event2);
                    // chrome.storage.sync.set({settings});
                    // console.log(settings);

                    chrome.runtime.sendMessage({
                        cmd: 'get_translated_destination',
                        lang: settings.lang,
                        current_origin: origin,
                        current_destination: destination
                    }, (response) => {
                        console.log('show_translated_destination');
                        console.log(response.destination_name);
                        // render(html`${response.destination_name}`, document.querySelector('#destination'));
                        document.querySelector('#destination').innerText = response.destination_name;
                        document.querySelector('#origin>span').innerText = response.originFrom;
                        // console.log(get('titles.from_city'));
                        // render(html`${response.originFrom}`, document.querySelector('#origin>span'));
                        document.querySelector('#input_origin_city').value = response.originSettings;
                    });
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