import '../scss/style.scss';
import {default as $, default as jQuery} from 'jquery';

window.$ = jQuery;
window.jQuery = jQuery;

import default_deals from './default_deals.js';
import storage from './storage.js';
import * as awesomplete from 'awesomplete';
import DropDown from './select-dropdown.js';
import SelectionBox from './selectionBox.js';
import {html, render} from 'lit-html';
import {registerTranslateConfig, use, get, translateConfig} from '@appnest/lit-translate';
import index_template, {languages} from './index.template.js';
import chromep from 'chromep';
import config from './config.js';

const q = (selector, el = document) => el.querySelector(selector);
const qq = (selector, el = document) => el.querySelectorAll(selector);

(() => {

    let settings = {};
    let settingsPanel;
    init_tab();

    async function init_template(callback) {

        registerTranslateConfig({
            loader: lang => fetch(`/locales/${lang}.json`).then(res => res.json()).then(res => res)
        });
        settings = await chromep.storage.sync.get('settings').then(res => res.settings);
        console.log(settings);
        if (!settings) {
            let l = getLocalLang();
            l = languages.hasOwnProperty(l) ? l : 'en';
            await use(l);
            render(index_template({order: ["usd", "eur"]}, {
                lang: 'ru',
                currency: ['RUB', 'sign'],
                originCity: {'MOW': 'Москва'}
            }), document.body);
            return;
        }
        await use(settings.lang);
        let currencies = translateConfig.strings.auto_generated.currency;
        render(index_template(currencies, settings), document.body);
        new SelectionBox($('#exclude_cities'));
        if (callback) {
            settingsPanel = addEventListeners();
            callback(settings);
        }
    }

    async function init_tab() {
        // check_background
        chrome.runtime.sendMessage({cmd: 'isProcessing'}, function (response) {
            console.log('init_tab ' + response);
            console.log(response);

            if (response.isProcessing) {
                init_template().then(() => {
                    showLoading();
                    chrome.runtime.onMessage.addListener(background_process_listener);
                });
            } else {
                init_template(apply_settings).then(() => {
                    console.log('init_template then');
                    get_next_deal(update_tab);
                });
                console.log('init_tab init');
            }
        });
    }

    function getLocalLang() {
        return navigator.language.replace('-', '_').toLowerCase().split('_')[0];
    }

    function background_process_listener(request, sender, sendResponse) {
        if (request.message === 'processed') {
            console.log('processed');
            chrome.runtime.onMessage.removeListener(background_process_listener);
            init_template(apply_settings).then(() => {
                get_next_deal(update_tab, hideLoading);
            });
        }
    }

    function apply_settings(settings) {
        Object.keys(settings).forEach(key => {
            switch (key) {
                case 'hideCities':
                    for (let k in settings.hideCities) {
                        settingsPanel.create_hidden_city(settings.hideCities[k], k);
                    }
                    break;
                case 'showComments':
                    settingsPanel.showComments(settings.showComments);
                    $('#toggle_comments')[0].checked = !settings.showComments;
                    break;
                case 'showTags':
                    settingsPanel.showTags(settings.showTags);
                    $('#toggle_tags')[0].checked = !settings.showTags;
                    break;
                case 'originCity':
                    for (let key in settings.originCity) {
                        set_origin_city_value(settings.originCity[key])
                    }
                    break;
                case 'currency':
                    set_currency_value(settings.currency[0]);
                    break;
                case 'lang':
                    set_lang_value(settings.lang);
                    break;
            }
        });

        if (!settings.currency && !settings.originCity) {
            get_auto_settings(['currency', 'origin_city'], apply_auto_settings);
        } else if (!settings.currency) {
            get_auto_settings('currency', apply_auto_settings);
        } else if (!settings.originCity) {
            get_auto_settings('origin_city', apply_auto_settings);
        }
    }

    function get_auto_settings(settings_name, callback) {
        chrome.storage.local.get(settings_name, function (res) {
            callback(res);
        });
    }

    function apply_auto_settings(auto_settings) {
        if ($.isEmptyObject(auto_settings)) {
            set_currency_value('RUB');
            set_lang_value('en');
            set_origin_city_value('Москва');
        } else {
            for (var setting in auto_settings) {
                switch (setting) {
                    case 'currency':
                        set_currency_value(auto_settings.currency[0]);
                        break;
                    case 'lang':
                        console.log(auto_settings.lang);
                        set_lang_value(auto_settings.lang);
                        break;
                    case 'origin_city':
                        set_origin_city_value(auto_settings.origin_city, iata);
                        break;
                }
            }
        }
    }

    function set_currency_value(value) {
        let currencyListElem = q('li[data-currency=' + value + ']', q('#currency_dropdown'));
        currencyListElem.classList.add('checked');
        let currency_selector = new DropDown($('#choose_currency'));
    }

    function set_lang_value(value) {
        use(value);
        console.log('set_lang_value: use(' + value + ')');
        var langListElem = q('#lang_dropdown').querySelector('li[data-lang=' + value + ']');
        q('#lang_label').innerHTML = langListElem.innerHTML;
        langListElem.classList.add('checked');

        new DropDown($('#choose_lang'));
    }

    function set_origin_city_value(value) {
        input_origin_city.value = value;
    }

    //  'index.js';
    var isPrevDealLoaded = false;

    var get_next_deal_index = function (callback) {
        chrome.storage.local.get({"next_deal_index": 0}, function (r) {
            var next_deal_index = r.next_deal_index;
            callback(next_deal_index)
        })
    }

    var use_default_deals = function (deals_length) {
        // return false;
        return deals_length === 0 || !navigator.onLine;
    }

    var get_next_deal = function (callback, func) {
        console.log('get_next_deal');
        isPrevDealLoaded = false;
        chrome.storage.local.get(['next_deal_index', 'deals_length'], function (data) {
            var next_deal_index = data.next_deal_index;

            if (use_default_deals(data.deals_length)) {
                callback(default_deals[Math.floor(Math.random() * default_deals.length + 1) - 1]);
            } else {
                storage.get_deal_by_index(next_deal_index, function (deal) {
                    chrome.storage.local.set({"next_deal_index": (next_deal_index + 1) % data.deals_length});

                    if (deal.skip_deal) {
                        if (!func) get_next_deal(update_tab);
                        else get_next_deal(update_tab, func);
                        return;
                    }

                    if (deal.destination_iata === document.getElementById('destination').getAttribute('data-iata')
                        && deal.origin_iata === document.getElementById('origin').getAttribute('data-iata')) {
                        if (!func) get_next_deal(update_tab);
                        else get_next_deal(update_tab, func);
                        return;
                    }

                    chrome.storage.sync.get('settings', function (res) {
                        if (res.settings && res.settings.hideCities) {
                            if (res.settings.hideCities[deal.destination_iata]) {
                                if (!func) get_next_deal(update_tab);
                                else get_next_deal(update_tab, func);
                                return;
                            }
                        }
                        if (func) callback(deal, func);
                        else callback(deal);
                    });
                })
            }
        });
    };

    var show = function (el) {
        el.classList.remove("hidden");
    }

    var hide = function (el) {
        el.classList.add("hidden");
    }

    var update_bg = function (deal, callback) {
        let bg_holder = document.getElementById('bg_img'), img = new Image();
        img.src = deal.image_url;

        bg_holder.addEventListener('transitionend', fade_out_handler, false);
        bg_holder.classList.add('is-hidden');

        function fade_out_handler() {
            bg_holder.removeEventListener('transitionend', fade_out_handler, false);
            show_new_bg(img, function () {
                bg_holder.setAttribute("style", "background-image:url(" + img.src + ")");
                bg_holder.classList.remove('is-hidden');
                bg_holder.addEventListener('transitionend', fade_in_handler, false);
            });
        }

        function fade_in_handler() {
            bg_holder.removeEventListener('transitionend', fade_in_handler, false);
            callback();
        }
    }

    function show_new_bg(image, cb) {
        if (image.complete) { // isLoaded
            cb();
        } else {
            image.onload = function () {
                cb();
            }
        }
    }

    var update_price = function (deal) {
        var btn_container = qq('.btn-container')[0],
            calendar_container = btn_container.querySelector('.prices-calendar-container'),
            btn = btn_container.querySelectorAll('.btn-price')[0],
            btn_price = btn.querySelectorAll('.btn-price-value')[0],
            btn_currency = btn.querySelector('.currency-symbol');

        hide(btn_container);

        if (deal.price) {
            btn_price.innerText = deal.price.toLocaleString('ru-RU', {maximumFractionDigits: 0});
            get_currency(function (currency) {
                btn_currency.innerHTML = currency[1];
            });
            btn.onclick = function (e) {
                // _gaq.push(['_trackEvent', 'price', 'price_button']);
                e.stopPropagation();
                calendar_container.classList.toggle("prices-calendar-container--hidden");
            }
            show(btn_container);
        }
    }

    var update_origin = function (deal) {
        var origin_container = qq('.origin-container')[0],
            origin = origin_container.querySelector('#origin');
        hide(origin_container);
        if (deal.origin_name) {
            origin.querySelector('span').innerText = deal.origin_name;
            show(origin_container);
        }
        if (deal.origin_iata) {
            origin.setAttribute('data-iata', deal.origin_iata);
            origin.setAttribute('data-depart', deal.depart_date);
        } else {
            console.log('Deal has no origin_iata');
        }
    }

    var update_destination = function (deal) {
        var destination = qq('.destination')[0];

        if (typeof deal.destination_name == 'object') {
            let l = settings ? settings.lang : getLocalLang();
            l = deal.destination_name.hasOwnProperty(l) ? l : 'en';
            destination.innerText = deal.destination_name[l];
        } else {
            destination.innerText = deal.destination_name;
        }
        destination.setAttribute('data-iata', deal.destination_iata);
        destination.setAttribute('data-return', deal.return_date);
        show(destination);
    }

    var update_tags = function (deal) {
        var tags_container = qq('.tags-container')[0],
            tags = tags_container.querySelectorAll('.tags')[0];

        hide(tags_container);
        tags.innerHTML = '';
        if (deal.tags && deal.tags.length > 0) {
            for (var i = deal.tags.length - 1; i >= 0; i--) {
                (function (tag_text) {
                    var tag = document.createElement('span');
                    tag.classList.add('tag');
                    tag.innerText = tag_text;
                    tags.appendChild(tag);
                })(deal.tags[i])
            }
            show(tags_container);
        }
    }

    var update_review = function (deal) {
        var review_container = qq('.review-container')[0],
            review = review_container.querySelector('.review'),
            review_content = review.querySelector('.review-content'),
            title = review_content.querySelector('.review-title'),
            text = review_content.querySelector('.review-text'),
            author = review_content.querySelector('.review-author')
        // date = review_content.querySelector('.review-date');

        hide(review);
        if (deal.review) {
            title.innerText = deal.review.title;
            text.innerText = deal.review.text;
            author.innerText = deal.review.author;
            // date.innerText = deal.review.date;
            show(review);
        }
    }

    var get_year_objs = function () {
        var result = [];
        var current_date = new Date();
        current_date.setDate(1);
        for (var i = 0; i < 12; i++) {
            let future_date = new Date(current_date);
            future_date.setMonth(future_date.getMonth() + i);
            var month = ('0' + (future_date.getMonth() + 1)).slice(-2);

            result.push({
                id: future_date.getFullYear() + '-' + month + '-01',
                month_name: get('dayjs.months').split(',')[future_date.getMonth()].trim()
            })
        }
        return result;
    }

    var generate_preloader = function () {
        var preloader = document.createElement("div");
        preloader.classList.add("preloader");
        for (var i = 0; i < 3; i++) {
            (function (index) {
                var item = document.createElement('div');
                item.classList.add("item");
                item.classList.add("item-" + (i + 1));
                preloader.appendChild(item);
            })(i)
        }
        return preloader;
    }

    var create_element = function (type, classes) {
        var el = document.createElement(type);
        for (var i = classes.length - 1; i >= 0; i--) {
            el.classList.add(classes[i]);
        }
        return el;
    }

    var build_prices_calendar = function () {
        var year_objs = get_year_objs(),
            prices_calendar_container = qq('.prices-calendar-container')[0],
            prices_calendar = document.createElement('div');
        prices_calendar.classList.add("prices-calendar");
        for (var i = 0; i < year_objs.length; i++) {
            (function (yo) {
                var month_element = create_element('a', ['prices-calendar-month']),
                    preloader = create_element('div', ['prices-calendar-preloader', 'price']),
                    date_container = create_element('div', ['date_container']),
                    month_name = create_element('div', ['prices-calendar-month_name', 'slider-elem']),
                    month_dates = create_element('div', ['prices-calendar-month_dates', 'slider-elem']);
                month_element.setAttribute("id", "month-" + yo.id);
                //monthes
                month_name.innerText = yo.month_name;
                date_container.appendChild(month_name);
                date_container.appendChild(month_dates);
                // preloader
                preloader.appendChild(generate_preloader());


                month_element.appendChild(preloader);
                month_element.appendChild(date_container);
                month_element.onclick = function () {
                    // _gaq.push(['_trackEvent', 'click', 'price', 'calendar']);
                    return true;
                };
                prices_calendar.appendChild(month_element);
            })(year_objs[i])
        }
        prices_calendar_container.appendChild(prices_calendar);
    }

    var fill_calendar = function (prices, currency_symbol) {
        var btn_price = document.getElementById('btn_price');
        btn_price.addEventListener('click', function (e) {
            e.preventDefault();
        });
        btn_price.removeAttribute('href');

        q('#price_tooltip').classList.add('price-tooltip--hidden');
        q('.prices-calendar').classList.remove('prices-calendar--off');

        for (var i = prices.length - 1; i >= 0; i--) {
            (function (p) {
                var month_element = q("#month-" + p.id),
                    price_container = month_element.querySelector('.prices-calendar-preloader'),
                    month_dates = month_element.querySelector('.prices-calendar-month_dates'),
                    price_value = create_element('span', ['price_value']),
                    price_currency = create_element('span', ['prices-calendar-currency']);

                price_container.innerHTML = '';

                if (p.price) {
                    price_container.appendChild(document.createTextNode(get('titles.from') + ' '));
                    price_value.innerText = p.price.toLocaleString('ru-RU', {maximumFractionDigits: 0});
                    price_container.appendChild(price_value);
                    price_currency.innerHTML = ' ' + currency_symbol;
                    price_container.appendChild(price_currency);
                    month_element.classList.add("has-price");
                    month_element.setAttribute("href", p.search_url);
                    month_element.setAttribute("target", "_blank");
                } else {
                    price_container.innerText = "—"
                }

                month_dates.innerText = p.dates;
            })(prices[i]);
        }
    }

    var format_date = function (str_date) {
        var date_parts = str_date.split('-');
        return date_parts[2] + ' ' + get('dayjs.monthsShort').split(',')[Number(date_parts[1]) - 1].trim();
    }

    var aviasalesUrl = function (origin_iata, destination_iata, depart_date, return_date) {
        let dp = depart_date.split("-"),
            rt = return_date.split("-"),
            passengers_count = 1,
            utm = 'utm_source=travelpayouts',
            utm_medium = 'utm_medium=inspiration_tab',
            utm_campaign = 'utm_campaign=' + config.marker,
            currency = 'currency=' + settings.currency[0];
        let h = config.host.endsWith('/') ? config.host : config.host + '/';
        return 'https://' + h + origin_iata + dp[2] + dp[1] + destination_iata + rt[2] + rt[1] + passengers_count + '?' +
            currency + '&' + utm + '&' + utm_medium + '&' + utm_campaign + '&marker=' + config.marker;
    }

    var fill_price_tooltip_text = function (depart_date, return_date) {
        let text = '', text_variants = ['ночь', 'ночи', 'ночей'];
        let d = new Date(depart_date),
            r = new Date(return_date),
            depart_date_formatted = d.toLocaleString(settings.lang, {day: 'numeric', month: 'long'}),
            return_date_formatted = r.toLocaleString(settings.lang, {day: 'numeric', month: 'long'}),
            nights;

        if (d.getFullYear() === r.getFullYear()) {
            nights = calc_day_of_year(r) - calc_day_of_year(d);
        } else {
            nights = calc_day_of_year(r) + (calc_day_of_year(new Date(d.getFullYear(), 11, 31)) - calc_day_of_year(d));
        }

        var remainder = nights % 10;
        var base_remainder = (Math.floor(nights / 10)) % 10;

        if (base_remainder === 1 || remainder > 4 || remainder === 0) text = text_variants[2];
        else if (remainder === 1) text = text_variants[0];
        else if (remainder < 5 && remainder > 1) text = text_variants[1];
        if (settings.lang !== 'ru') {
            text = get('titles.nights');
        }

        q('#price_tooltip').innerHTML = depart_date_formatted + ' &ndash; ' + return_date_formatted + ' (' + nights + ' ' + text + ')';
    };

    var fill_price_tooltip = function (deal) {
        var price_tooltip = q('#price_tooltip'),
            calendar = q('.prices-calendar'),
            btn_price = document.getElementById('btn_price');


        price_tooltip.classList.remove('price-tooltip--hidden');
        calendar.classList.add('prices-calendar--off');

        fill_price_tooltip_text(deal.depart_date, deal.return_date);

        btn_price.setAttribute('href', aviasalesUrl(deal.origin_iata, deal.destination_iata, deal.depart_date, deal.return_date));
        btn_price.addEventListener('click', function (e) {
            return true;
        });
    }

    function calc_day_of_year(date) {
        var start = new Date(date.getFullYear(), 0, 0);
        var diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
    }

    var get_year_prices = function (currency, origin_iata, destination_iata, deal, callback) {
        var req = new XMLHttpRequest(),
            url = "https://lyssa.aviasales.ru/v2/widget/year?origin_iata=" + origin_iata + "&destination_iata=" + destination_iata + "&one_way=false&min_trip_duration=1&max_trip_duration=10",
            // url = "http://api.travelpayouts.com/v1/prices/monthly?currency="+ currency[0] +"&origin=" + origin_iata + "&destination=" + destination_iata + "&token=2db8244a0b9521ca2b0e0fbb24c4d1015b7e7a6b",
            year_obj = get_year_objs();

        req.open("GET", url, true);
        req.onload = function () {
            if (req.status == 200) {
                var year_data = JSON.parse(req.responseText);
                if (Object.keys(year_data.year).length == 0) {
                    fill_price_tooltip(deal);
                } else {
                    for (var i = 0; i < year_obj.length; i++) {
                        if (year_data.year[year_obj[i].id]) {
                            var month_data = year_data.year[year_obj[i].id];
                            var depart_date = month_data.depart_date;
                            var return_date = month_data.return_date;
                            year_obj[i].price = parseInt(month_data.value) * parseFloat(year_data.currency[currency[0]].rate);
                            year_obj[i].dates = format_date(depart_date) + ' - ' + format_date(return_date);
                            year_obj[i].search_url = aviasalesUrl(origin_iata, destination_iata, depart_date, return_date);
                        }
                    }
                    callback(year_obj, currency[1]);
                }
            }
        };
        req.send();
    }

    var get_currency = function (callback) {
        chrome.storage.sync.get('settings', function (res) {
            var currency;
            if (res.settings && res.settings.currency) {
                callback(res.settings.currency);
            } else {
                chrome.storage.local.get('currency', function (r) {
                    callback(r.currency);
                });
            }
        });
    }

    var update_tab = function (deal, callback) {
        var blackout = qq('.blackout')[0];
        hide(blackout);
        var prices_calendar_child = document.getElementById('prices_calendar').children;
        if (!prices_calendar_child.length) {
            build_prices_calendar();
        } else {
            clear_calendar_attributes(prices_calendar_child[0]);
        }
        get_currency(function (currency) {
            get_year_prices(currency, deal.origin_iata, deal.destination_iata, deal, fill_calendar);
        });
        update_bg(deal, function () {
            show(blackout);
            update_price(deal);
            update_destination(deal);
            update_origin(deal);
            update_tags(deal);
            update_review(deal);
            isPrevDealLoaded = true;
            if (callback) callback();
        });
    }

    var clear_btn_price = function () {
        $('.btn-price').addClass('isLoading').append(generate_preloader());
    };

    var clear_prices_calendar = function () {
        $('.prices-calendar-preloader').each(function () {
            $(this).html(generate_preloader());
        });
        clear_calendar_attributes(q('.prices-calendar'));
    };

    var clear_calendar_attributes = function (monthes_container) {
        for (var i = 0; i < monthes_container.children.length; i++) {
            (function (month) {
                month.classList.remove('has-price');
                month.removeAttribute('href');
                month.removeAttribute('target');
            })(monthes_container.children[i]);
        }
    };

    var get_current_deal = function (callback) {
        var origin = document.getElementById('origin');
        var destination = document.getElementById('destination');
        var deal_obj = {
            origin_iata: origin.getAttribute('data-iata'),
            destination_iata: destination.getAttribute('data-iata'),
            depart_date: origin.getAttribute('data-depart'),
            return_date: destination.getAttribute('data-return')
        }
        callback(deal_obj);
    };

    var get_new_lyssa_deal = function (currency_code, current_deal, callback) {
        var req = new XMLHttpRequest(),
            url = 'https://lyssa.aviasales.ru/day_price?origin=' + current_deal.origin_iata + '&destination=' + current_deal.destination_iata + '&depart_date=' + current_deal.depart_date + '&return_date=' + current_deal.return_date + '&currency_code=' + currency_code;
        req.open('GET', url, true);
        req.onload = function (request) {
            request = request.target;
            if (request.status == 200) {
                var direction = JSON.parse(request.response);
                var result = {
                    price: direction.value,
                    return_date: direction.return_date,
                    origin: direction.origin,
                    destination: direction.destination,
                    depart_date: direction.depart_date
                }
                callback(result);
            }
        };
        req.send(null);
    };

    var get_new_prices = function (currency) {
        get_current_deal(function (deal) {
            get_new_lyssa_deal(currency[0], deal, function (updated_deal) {

                fill_btn_price(updated_deal.price, currency[1], function () {
                    var btn_price = q('.btn-price');
                    btn_price.querySelector('.preloader').remove();
                    btn_price.classList.remove('isLoading');
                });
            });
            get_year_prices(currency, deal.origin_iata, deal.destination_iata, deal, fill_calendar);
        });
    };

    var fill_btn_price = function (value, currency_symbol, callback) {
        q('.btn-price-value').innerText = value.toLocaleString('ru-RU', {maximumFractionDigits: 0});
        q('.currency-symbol').innerText = currency_symbol;
        callback();
    };

//==============================================================================
// EVENTS LISTENERS
//==============================================================================

    function addEventListeners() {
        let input_origin_city = q('#input_origin_city');

        window.addEventListener('update_settings', function () {
            init_tab();
        }, false);

        $(document).click(function (e) {
            $('.wrapper-select-dropdown').removeClass('active');
            $('.prices-calendar-container').addClass('prices-calendar-container--hidden');
        });
        $('#logo').attr('href', 'https://' + config.host_logo +
            '?utm_source=travelpayouts&utm_medium=inspiration_tab&utm_campaign=' + config.marker);

        $('.prices-calendar-container').on('click', '.prices-calendar-month', function (e) {
            e.stopPropagation();
        });

        var $btn_settings = $('#btn_settings').click(function () {
            var $obj = $(this);
            $obj.addClass('menu-opened');
            $obj.next().addClass('isOpened');
            // _gaq.push(['_trackEvent', 'click', 'settings']); //dev
            return $obj;
        });

        $('#btn_close_settings').click(function () {
            $btn_settings.removeClass('menu-opened');
            $btn_settings.next().removeClass('isOpened');
        });

        var $place_container = $('#place_container');
        $('#btn-bottombar').click(function () {
            $place_container.toggleClass('slideUp');
            // send event to Google Analytics
            // _gaq.push(['_trackEvent', 'more_destinations', 'click']); //dev
            if ($place_container.is('.slideUp')) {
                // _gaq.push(['_trackEvent', 'more_destinations', 'open']); //dev
            }
        });

        var $comments_container = $('#comments_container');
        var $toggle_comments = $('#toggle_comments');

        $toggle_comments.on('change', function () {
            showComments(!this.checked);
            settings.showComments = !$toggle_comments[0].checked;
            chrome.storage.sync.set({settings});
            // send event to Google Analytics
            // _gaq.push(['_trackEvent', 'settings', 'comments', get_toggle_state(this)]);
        });

        function get_toggle_state(checkbox) {
            if (checkbox.checked) return 'hide';
            else return 'show';
        }

        var $tags_container = $('#tags_container');
        var $toggle_tags = $('#toggle_tags');

        $toggle_tags.on('change', function () {
            showTags(!this.checked);
            settings.showTags = !$toggle_tags[0].checked;
            chrome.storage.sync.set({settings});
            // send event to Google Analytics
            // _gaq.push(['_trackEvent', 'settings', 'tags', get_toggle_state(this)]); //dev
        });

        var input_hide_cities = document.getElementById("hide_cities");
        var autoCompleteCitiesToHide = new Awesomplete(input_hide_cities, {
            data: function (item, input) {
                if (settings.hideCities) {
                    if (settings.hideCities[item[2]]) return;
                }
                return {
                    label: item[0] + ', ' + '<span data-searches="' + item[3] + '">' + item[1] + ', ' + item[2] + '</span>',
                    value: item[0]
                };
            },
            sort: function (a, b) {
                var a = parseInt(a.label.substring(a.label.search(/="/i), a.label.search(/">/i)).slice(2));
                var b = parseInt(b.label.substring(b.label.search(/="/i), b.label.search(/">/i)).slice(2));
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            }
        });

        input_hide_cities.addEventListener('input', function (e) {
            var list = getCitiesListWithAjax(e.target.value, function (data) {
                autoCompleteCitiesToHide.list = data;
                autoCompleteCitiesToHide.evaluate();
            });
        });

        input_hide_cities.addEventListener('awesomplete-selectcomplete', function (e) {
            var cityToHide = e.target.value;
            e.target.value = '';
            var selectText = e.text.label;
            var iata = selectText.slice(-10, -7);
            if (!settings) {
                settings = {};
            }
            if (settings.hideCities) {
                settings.hideCities[iata] = cityToHide;
            } else {
                settings.hideCities = {};
                settings.hideCities[iata] = cityToHide;
            }

            chrome.storage.sync.set({settings});
            create_hidden_city(cityToHide, iata);
        });

        var autoCompleteOrigin = new Awesomplete(input_origin_city, {
            data: function (item, input) {
                return {
                    label: item[0] + ', ' + '<span data-searches="' + item[3] + '">' + item[1] + ', ' + item[2] + '</span>',
                    value: item[0]
                };
            },
            sort: function (a, b) {
                var a = parseInt(a.label.substring(a.label.search(/="/i), a.label.search(/">/i)).slice(2));
                var b = parseInt(b.label.substring(b.label.search(/="/i), b.label.search(/">/i)).slice(2));
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            }
        });

        input_origin_city.addEventListener('awesomplete-selectcomplete', function (e) {
            chrome.storage.sync.get('settings', function (res) {
                let settings = res.settings ? res.settings : {};
                settings.originCity = {};
                settings.originCity[e.text.slice(-10, -7)] = e.target.value;
                // console.log(settings);
                chrome.storage.sync.set({settings}, function () {
                    input_origin_city.blur();
                    chrome.runtime.sendMessage({cmd: 'update_all'});
                });
            });
        });

        input_origin_city.addEventListener('input', function (e) {
            var list = getCitiesListWithAjax(e.target.value, function (data) {
                autoCompleteOrigin.list = data;
                autoCompleteOrigin.evaluate();
            });
        });

        input_origin_city.addEventListener('blur', function (e) {
            chrome.storage.sync.get('settings', function (res) {
                if (res.settings && res.settings.originCity) {
                    var city = res.settings.originCity;
                    for (var key in city) {
                        if (input_origin_city.value !== city[key]) {
                            input_origin_city.value = city[key];
                        }
                    }
                }
            });
        });

        async function getCitiesListWithAjax(value, callback) {
            let lang = await chromep.storage.sync.get('settings').then(res => res.settings.lang);
            var req = new XMLHttpRequest(),
                url = `https://places.aviasales.ru/v2/places.json?term=${value}&locale=${lang}&types%5B%5D=city`;

            req.open('GET', url, true);
            req.onload = function () {
                if (req.status == 200) {
                    var place_data = JSON.parse(req.responseText);
                    if (place_data.length > 0) {
                        var choices = [];
                        place_data.forEach(function (item) {
                            var choice = [item.name, item.country_name, item.code, item.weight];
                            choices.push(choice);
                        });
                    }
                }
                callback(choices);
            };
            req.send();
        }

        function showComments(state) {
            console.log(settings.lang);
            let c = $('#toggle_comments').closest('div');
            if (settings.lang === 'ru' && !config.hide_comments) {
                c.show();
                if (state) {
                    $comments_container.removeClass('review-container--hidden');
                } else {
                    $comments_container.addClass('review-container--hidden');
                }
            } else {
                c.hide();
                $comments_container.addClass('review-container--hidden');
            }
        }

        function showTags(state) {
            console.log('showTags');
            let c = $('#toggle_tags').closest('div');
            if (settings.lang === 'ru' && !config.hide_tags) {
                c.show();
                if (state) {
                    $tags_container.removeClass('tags-container--hidden');
                } else {
                    $tags_container.addClass('tags-container--hidden');
                }
            } else {
                c.hide();
                $tags_container.addClass('tags-container--hidden');
            }
        }

        function get_choices(obj) {
            var choices = [];
            var filter = /deals_/;
            for (var k in obj) {
                if (filter.test(k) && Array.isArray(obj[k])) {
                    obj[k].forEach(function (item) {
                        var itemName = item.destination_name;
                        choices.push([itemName.substring(0, itemName.indexOf(',')), (itemName.substring(itemName.indexOf(' '))).substring(1), item.destination_iata]);
                    });
                }
            }
            return choices;
        }

        function create_hidden_city(city, iata) {
            var hidden_cities_box = document.getElementById('exclude_cities');
            var span = '<span class="hidden-cities__item" data-iata="' + iata + '">' + city + ' ' +
                '<img class="hidden-cities__item-icon" src="img/close-8px-light.svg" alt="">' +
                '<img class="hidden-cities__item-icon--hover" src="img/close-8px-dark.svg" alt="">' +
                '</span>';
            $(hidden_cities_box).append(span);
        }

        window.addEventListener('update_prices', function (e) {
            settings.currency = e.detail;
            clear_btn_price();
            clear_prices_calendar();
            get_new_prices(settings.currency);
        }, false);

        document.getElementById('btn_change_destination').addEventListener('click', function (e) {
            if (isPrevDealLoaded) {
                get_next_deal(update_tab);
                // _gaq.push(['_trackEvent', 'click', 'other_destination']); // dev
            }
        }, false);

        window.addEventListener('lang_changed', async function (e) {
            console.log('lang_changed');
            settings.lang = e.detail;
            await use(settings.lang);
            showComments(settings.showComments);
            showTags(settings.showTags);

            let months = qq('.prices-calendar-month_name');
            let mnames = get('dayjs.months').split(',');
            let cm = qq('.prices-calendar-month');
            for (let m of cm) {
                let mn = q('.prices-calendar-month_name', m);

                let mindex = Number(m.id.split('-')[2].trim());
                mn.innerText = mnames[mindex - 1];
                if (m.classList.contains('has-price')) {
                    let tn = q('div', m).firstChild;
                    tn.nodeValue = get('titles.from') + ' ';
                }
                // var depart_date = month_data.depart_date;
                // var return_date = month_data.return_date;
                year_obj[i].dates = format_date(depart_date) + ' - ' + format_date(return_date);
            }
            fill_price_tooltip_text(q('#origin').getAttribute('data-depart'), q('#destination').getAttribute('data-return'));

        }, false);

        return {showComments: showComments, showTags: showTags, create_hidden_city: create_hidden_city};
    }

    function showLoading() {
        document.getElementById('overlay').classList.remove('is-hidden');
    }

    function hideLoading() {
        document.getElementById('overlay').classList.add('is-hidden');
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.cmd) {
            case 'finish_origin_change':
                console.log('finish_origin_change');
                get_next_deal(update_tab);
                break;

            case 'disable_settings_change':
                document.getElementById('choose_lang').classList.add('disabled');
                document.getElementById('btn_change_destination').classList.add('isDisabled');
                document.getElementById('choose_currency').classList.add('disabled');
                document.getElementById('input_origin_city').classList.add('disabled');
                document.getElementById('hide_cities').classList.add('disabled');
                break;

            case 'enable_settings_change':
                document.getElementById('choose_lang').classList.remove('disabled');
                document.getElementById('btn_change_destination').classList.remove('isDisabled');
                document.getElementById('choose_currency').classList.remove('disabled');
                document.getElementById('input_origin_city').classList.remove('disabled');
                document.getElementById('hide_cities').classList.remove('disabled');
                break;
        }
    });
})();