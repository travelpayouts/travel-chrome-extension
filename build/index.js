/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var items_per_key = 10;

var get_chunk_info = function(global_index) {
	var chunk_number = Math.floor(global_index / items_per_key);
	return {
		number: chunk_number,
		index: global_index - chunk_number * items_per_key
	}
}

var get_deal_by_index = function(global_index, callback){
	var chunk_data = get_chunk_info(global_index);
    var chunk_name = 'deals_' + chunk_data.number.toString();
    chrome.storage.sync.get(chunk_name, function(s_data) {
        var deals = s_data[chunk_name];
        callback(deals[chunk_data.index]);
    });
};

module.exports = {
	get_chunk_info: get_chunk_info,
	get_deal_by_index: get_deal_by_index,
	items_per_key: items_per_key
}



/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

var default_deals = [
    {
        price: null,
        destination_name: "Сан-Марино, Италия",
        search_url: null,
        image_url: "img/san-marino.jpg"
    },
    {
        price: null,
        destination_name: "Шефшауэн, Марокко",
        search_url: null,
        image_url: "img/chefchaouen.jpg"
    },
    {
        price: null,
        destination_name: "Гонконг, Гонконг",
        search_url: null,
        image_url: "img/hong-kong.jpg"
    },
    {
        price: null,
        destination_name: "Амстердам, Нидерланды",
        search_url: null,
        image_url: "img/amsterdam.jpg"
    },
    {
        price: null,
        destination_name: "Мале, Мальдивская Республика",
        search_url: null,
        image_url: "img/male.jpg"
    },
    {
        price: null,
        destination_name: "Гальштат, Австрия",
        search_url: null,
        image_url: "img/hallstatt.jpg"
    }
];

module.exports = default_deals;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var default_deals = __webpack_require__(3);
var storage = __webpack_require__(0)

var get_next_deal_index = function(callback) {
    chrome.storage.sync.get({"next_deal_index": 0}, function(r) {
        var next_deal_index = r.next_deal_index;
        callback(next_deal_index)
    })
}

var use_default_deals = function(deals_length) {
    return deals_length == 0 || !navigator.onLine;
}

var get_next_deal = function(callback) {
    chrome.storage.sync.get(['next_deal_index', 'deals_length'], function(data) {
        var next_deal_index = data.next_deal_index;
        if (use_default_deals(data.deals_length)) {
            console.log('use_default_deals', default_deals[Math.floor(Math.random() * default_deals.length + 1) - 1]);
            callback(default_deals[Math.floor(Math.random() * default_deals.length + 1) - 1]);
        } else {
            storage.get_deal_by_index(next_deal_index, function(deal){
                console.log('choose deal', deal);
                callback(deal);
                chrome.storage.sync.set({"next_deal_index": (next_deal_index + 1) % data.deals_length});
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

var update_bg = function(deal, callback) {
    var place_container = document.getElementById('place_container'),
        img = new Image();
        img.onload = function() {
            console.log("IMG loaded");
            callback();
        }
        place_container.setAttribute("style", "background-image:url(" + deal.image_url + ")");
        img.src = deal.image_url;
}

var update_price = function(deal) {
    var btn_container = document.querySelectorAll('.btn-container')[0],
        calendar_container = btn_container.querySelector('.prices-calendar-container'),
        btn = btn_container.querySelectorAll('.btn-price')[0],
        btn_price = btn.querySelectorAll('.btn-price-value')[0];
        // calendar_visible = false;

    hide(btn_container);

    if (deal.price) {
        btn_price.innerText = deal.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
        btn.onclick = function(e) {
            e.stopPropagation();
            calendar_container.classList.toggle("prices-calendar-container--hidden");
            // if (calendar_visible) {
            //     calendar_visible = false;
            //     calendar_container.classList.add("prices-calendar-container--hidden");
            // } else {
            //     calendar_visible = true;
            //     calendar_container.classList.remove("prices-calendar-container--hidden");
            // }
        }
        show(btn_container);
    }
}

var update_origin = function(deal) {
    var origin_container = document.querySelectorAll('.origin-container')[0],
        origin = origin_container.querySelectorAll('.origin')[0];
    hide(origin_container);
    if (deal.origin_name) {
        origin.innerText = "из " + deal.origin_name;
        show(origin_container);
    }
}

var update_destination = function (deal) {
    var destination = document.querySelectorAll('.destination')[0];
    destination.innerText = deal.destination_name;
    show(destination);
}

var update_tags = function(deal) {
    var tags_container = document.querySelectorAll('.tags-container')[0],
        tags = tags_container.querySelectorAll('.tags')[0];

    hide(tags_container);
    tags.innerHtml = '';
    if (deal.tags && deal.tags.length > 0) {
        for (var i = deal.tags.length - 1; i >= 0; i--) {
            (function(tag_text) {
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
    var review_container = document.querySelectorAll('.review-container')[0],
        review = review_container.querySelector('.review'),
        review_content = review.querySelector('.review-content'),
        title = review_content.querySelector('.review-title'),
        text = review_content.querySelector('.review-text'),
        author = review_content.querySelector('.review-author'),
        date = review_content.querySelector('.review-date');

    hide(review);
    if (deal.review) {
        title.innerText = deal.review.title;
        text.innerText = deal.review.text;
        author.innerText = deal.review.author;
        date.innerText = deal.review.date;
        show(review);
    }
}

var get_year_objs = function(){
    var month_f_names = ['Январь', "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    var result = [];
    var current_date = new Date();
    current_date.setDate(1);
    for (var i = 0; i < 12; i++) {
       future_date = new Date(current_date);
       future_date.setMonth(future_date.getMonth() + i);
       var month = ('0' + (future_date.getMonth() + 1)).slice(-2);

       result.push({
         id: future_date.getFullYear() + '-' + month,
         month_name: month_f_names[future_date.getMonth()]
       })
    }
    return result;
}

var generate_preloader = function() {
    var preloader = document.createElement("div");
    preloader.classList.add("preloader");
    for (var i = 0; i < 3; i++) {
        (function(index) {
            var item = document.createElement('div');
            item.classList.add("item");
            item.classList.add("item-" + (i + 1));
            preloader.appendChild(item);
        })(i)
    }
    return preloader;
}

var create_element = function(type, classes) {
    var el = document.createElement(type);
    for (var i = classes.length - 1; i >= 0; i--) {
        el.classList.add(classes[i]);
    }
    return el;
}

var build_prices_calendar = function() {
    var year_objs = get_year_objs(),
        prices_calendar_container = document.querySelectorAll('.prices-calendar-container')[0],
        prices_calendar = document.createElement('div');
    prices_calendar.classList.add("prices-calendar");
    for (var i = 0; i < year_objs.length; i++) {
        (function(yo) {
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
            prices_calendar.appendChild(month_element);
        })(year_objs[i])
    }
    prices_calendar_container.appendChild(prices_calendar);
}

var fill_calendar = function(prices) {
    var calendar = document.querySelector('.prices-calendar');
    for (var i = prices.length - 1; i >= 0; i--) {
        (function(p) {
            var month_element = calendar.querySelector("#month-" + p.id),
                price_container = month_element.querySelector('.prices-calendar-preloader'),
                month_dates = month_element.querySelector('.prices-calendar-month_dates'),
                price_value = create_element('span', ['price_value']),
                price_currency = create_element('span', ['prices-calendar-currency']);

            price_container.innerHTML = '';
            if (p.price) {
                price_container.appendChild(document.createTextNode('от '));
                price_value.innerText = p.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
                price_container.appendChild(price_value);
                price_currency.appendChild(document.createTextNode(' ₽'));
                price_container.appendChild(price_currency);
                month_element.classList.add("has-price");
                month_element.setAttribute("href", p.search_url);
                month_element.setAttribute("target", "_blank");
            } else {
                var loader = create_element('img', ['loader']);
                loader.setAttribute('src', 'img/icons/loader.svg');
                price_container.appendChild(loader);

                // price_container.innerText = "—"
            }
            
            month_dates.innerText = p.dates;
        })(prices[i])
    }
    console.log(prices)
}

var format_date = function(str_date){
    var month_s_names = ['янв', "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
    var date_parts = str_date.split('-');
    return date_parts[2] + ' ' + month_s_names[Number(date_parts[1]) - 1];
}

var aviasalesUrl = function(origin_iata, destination_iata, depart_date, return_date) {
    var base = "https://search.aviasales.ru/",
        dp = depart_date.split("-"),
        rt = return_date.split("-"),
        passengers_count = 1;
    return base + origin_iata + dp[2] + dp[1] + destination_iata + rt[2] + rt[1] + passengers_count;
}

var get_year_prices = function(origin_iata, destination_iata, callback){
    var req = new XMLHttpRequest(),
        url = "http://api.travelpayouts.com/v1/prices/monthly?currency=RUB&origin=" + origin_iata + "&destination=" + destination_iata + "&token=2db8244a0b9521ca2b0e0fbb24c4d1015b7e7a6b",
        year_obj = get_year_objs();

    req.open("GET", url, true);
    req.onload = function () {
      if (req.status == 200) {
        year_data = JSON.parse(req.responseText).data;
        for (var i=0; i<year_obj.length; i++) {
             if (year_data[year_obj[i].id]) {
                var month_data = year_data[year_obj[i].id];
                var depart_date = month_data.departure_at.slice(0, 10);
                var return_date = month_data.return_at.slice(0, 10);
                year_obj[i].price = month_data.price;
            } else {
                var depart_date = year_obj[i].id + '-01';
                var return_date = year_obj[i].id + '-08';
            }
            year_obj[i].dates = format_date(depart_date) + ' - ' + format_date(return_date);
            year_obj[i].search_url = aviasalesUrl(origin_iata, destination_iata, depart_date, return_date);
        }
        callback(year_obj);
      }
    };
    req.send();
}

var update_tab = function(deal) {
    var blackout = document.querySelectorAll('.blackout')[0];
    hide(blackout);
    build_prices_calendar();
    get_year_prices(deal.origin_iata, deal.destination_iata, fill_calendar);
    update_bg(deal, function() {
        show(blackout);
        update_price(deal);
        update_destination(deal);
        update_origin(deal);
        update_tags(deal);
        update_review(deal);
    });
}

var init = function() {
    get_next_deal(update_tab);
}


init();













$('#btn_change_destination').click(function(){
    init();
});

/***/ })
/******/ ]);
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

        obj.input.on('focus', function(){
            obj.dd.addClass('active');
        });

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
$(function(){
    var dd = new DropDown($('#choose_currency'));
    var sb = new SelectionBox($('#exclude_cities'));
    
    $(document).click(function() {
        // all dropdowns
        $('.wrapper-select-dropdown, .wrapper-input-dropdown').removeClass('active');
        $('.prices-calendar-container').addClass('prices-calendar-container--hidden');
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

    var $place_container = $('#place_container');
    $('#btn-bottombar').click(function(){
        $place_container.toggleClass('slideUp');
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