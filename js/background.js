import cities_data from './cities_data.js';
import booking_reviews from './booking_reviews.js';
import storage from './storage.js';
import iata_codes from './iata_codes.js';
import getOriginCurrency from "./currencies.js";
import config from "./config.js";

var isProcessing = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        if (request.cmd === 'isProcessing') {
            sendResponse({isProcessing: isProcessing});
        }

        if (request.cmd === 'update_all') {
            console.log('cmd update_all');
            chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, () => handleNoTabs());
            let isLoaderActive = !request.hasOwnProperty('lang'); // true if request.lang undefined
            updateAllData(isLoaderActive, request.lang); // isLoaderActive = false - update deals only
        }

        if (request.cmd === 'get_translated_destination') {
            let destination_name = im_city_name(request.current_destination, request.lang) + ', ' +
                im_country_name(request.current_destination, request.lang);
            let originFrom = ro_city_name(request.current_origin, request.lang);
            let originSettings = im_city_name(request.current_origin, request.lang);
            sendResponse({destination_name, originFrom, originSettings});
        }
    }
);

function loadSettingsSynced() {
    return new Promise(resolve => chrome.storage.sync.get('settings', result => resolve(result.settings)));
}

var ro_city_name = function (iata, lang) {
    console.log(cities_data[iata]);
    var ro_city_names = cities_data[iata].names;
    console.log(ro_city_names);
    var ro_city_name;
    if (lang === 'ru' && ro_city_names.ru) {
        if (ro_city_names.ru.cases && ro_city_names.ru.cases.ro) {
            ro_city_name = ro_city_names.ru.cases.ro;
        } else {
            ro_city_name = ro_city_names.ru.name;
        }
    } else {
        ro_city_name = ro_city_names.en.name;
    }
    return ro_city_name;
};

var im_city_name = function (iata, lang) {
    var im_city_names = cities_data[iata].names,
        im_city_name;

    if (lang === 'ru' && im_city_names.ru && im_city_names.ru.name) {
        im_city_name = im_city_names.ru.name;
    } else {
        im_city_name = im_city_names.en.name;
    }
    return im_city_name;
};

var im_country_name = function (iata, lang) {
    var im_country_names = cities_data[iata].country.names,
        im_country_name;

    if (lang === 'ru' && im_country_names.ru && im_country_names.ru.name) {
        im_country_name = im_country_names.ru.name;
    } else {
        im_country_name = im_country_names.en.name;
    }
    return im_country_name;
};

var getDestinationPhotosUrl = function (destination_iata) {
    let w = Math.round(window.screen.width * devicePixelRatio);
    let h = Math.round(window.screen.height * devicePixelRatio);
    return `https://mphoto.hotellook.com/static/cities/${w}x${h}/${destination_iata}.auto`;
};

var where_am_i = function (lang, settings, callback) {
    fetch("http://www.travelpayouts.com/whereami?locale=" + lang).then(response => response.json()).then(
        result => {
            var origin_iata, origin_name, currency;

            if (settings) {

                if (settings.currency) currency = settings.currency;
                else currency = getOriginCurrency(result.country_name);

                if (settings.originCity) {
                    for (let key in settings.originCity) {
                        origin_iata = key;
                        origin_name = ro_city_name(key, lang);
                    }
                    if (settings.hasOwnProperty('lang') && settings.lang !== lang) {
                        let originCity = im_city_name(origin_iata, lang);
                        let origCityObj = new Object(null);
                        origCityObj[origin_iata] = originCity;
                        settings.originCity = origCityObj;
                        settings.lang = lang;
                        console.log(settings);
                        chrome.storage.sync.set({settings});
                    }
                } else {
                    origin_iata = result.iata;
                    origin_name = ro_city_name(result.iata, lang);
                }

            } else {
                currency = getOriginCurrency(result.country_name);
                origin_iata = result.iata;
                origin_name = ro_city_name(result.iata, lang);
                let originCity = im_city_name(result.iata, lang);


                let origCityObj = new Object(null);
                origCityObj[origin_iata] = originCity;
                settings = {
                    currency: currency,
                    originCity: origCityObj,
                    lang: lang,
                    showTags: true,
                    showComments: true
                };
                chrome.storage.sync.set({settings});
            }
            callback(result, origin_iata, origin_name, currency[0]);
        }
    ).catch(error => {
        console.log(error);
        isProcessing = false;
    });
};

var getDirectionsUrl = function (origin_iata, currency) {
    var url = "https://lyssa.aviasales.ru/map?min_trip_duration=2&max_trip_duration=30&affiliate=false&one_way=false&only_direct=false";
    url += '&origin_iata=' + origin_iata;
    url += '&currency_code=' + currency;

    var current_date = new Date();
    current_date.setDate(1);
    for (var i = 0; i < 12; i++) {
        let future_date = new Date(current_date);
        future_date.setMonth(future_date.getMonth() + i);
        var month = ('0' + (future_date.getMonth() + 1)).slice(-2);
        url += "&depart_months[]=" + future_date.getFullYear() + '-' + month + '-01';
    }
    return url
};

var fetchDirections = function (origin_iata, currency) {
    return fetch(getDirectionsUrl(origin_iata, currency)).then(response => response.json()).then(directions => {
        return directions.map(function (dir) {
            return {
                price: dir.value,
                return_date: dir.return_date,
                origin: dir.origin,
                destination: dir.destination,
                depart_date: dir.depart_date
            }
        });
    }).catch(error => {
        console.log(error);
        isProcessing = false;
    });
};


// input arr ex.:
// var input = [{price: 33593, return_date: "2019-11-20", origin: "IEV", destination: "WAS", depart_date: "2019-11-04"}]
// var output = [{depart_date: "2019-11-04", destination_iata: "WAS", destination_name: "Вашингтон, США",
// image_url: "https://mphoto.hotellook.com/static/cities/1680x1050/WAS.auto", origin_iata:
// "IEV", origin_name: "Киева", price: 33593, return_date: "2019-11-20", review: undefined, tags: undefined}]

function processDirection(direction, origin_name, origin_iata, lang) {

    if (!cities_data[direction.destination] || !iata_codes.includes(direction.destination)) {
        console.log('Направление ' + direction.destination + ' отсутствует в словаре');
        return null;
    }

    let image_url = getDestinationPhotosUrl(direction.destination);
    return {
        image_url: image_url,
        price: direction.price,
        destination_name: im_city_name(direction.destination, lang) + ', ' + im_country_name(direction.destination, lang),
        tags: (booking_reviews[direction.destination] || {}).tags,
        review: (booking_reviews[direction.destination] || {}).review,
        origin_name: origin_name,
        origin_iata: origin_iata,
        destination_iata: direction.destination,
        depart_date: direction.depart_date,
        return_date: direction.return_date
    };
}

function processDirections(directions, origin_name, origin_iata, lang) {
    let doneCounter = 0, results = [];
    // let len = 30;
    let len = directions.length;
    for (let i = 0; i < len; i++) {
        let item = directions[i];
        let d = processDirection(item, origin_name, origin_iata, lang);

        doneCounter += 1;
        if (!d && doneCounter !== len) continue;
        else if (!d && doneCounter === len) {
            return results;
        }
        results.push(d);
        if (doneCounter === len) {
            return results;
        }
    }
}

async function updateAllData(isLoaderActive, lang) {
    isProcessing = true;
    let settings = await loadSettingsSynced();

    where_am_i(lang || settings.lang, settings, async function (l, origin_iata, origin_name, currency) {

        let directions = await fetchDirections(origin_iata, currency);
        let deals = processDirections(directions, origin_name, origin_iata, lang || settings.lang);

        let dealsObj = {
            last_update: Date.now(),
            deals_length: deals.length
        };

        for (let i = 0; i < Math.ceil(deals.length / storage.ITEMS_PER_KEY); i++) {
            var key_name = "deals_" + i.toString();
            dealsObj[key_name] = deals.slice(i * storage.ITEMS_PER_KEY, (i + 1) * storage.ITEMS_PER_KEY);
        }

        let keys_to_delete = [];

        for (let i = 0; i < 200; i++) {
            keys_to_delete.push("deals_" + i.toString());
        }

        dealsObj.next_deal_index = 0;
        chrome.storage.local.remove(keys_to_delete, () => {
            chrome.storage.local.set(dealsObj, () => {
                let p = new Preloader(dealsObj, isLoaderActive);
                p.preload();
            });
        });
    });
}

chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'local' && changes.next_deal_index) {
        console.log('onChange: ', changes.next_deal_index.oldValue, changes.next_deal_index.newValue);
        if (changes.next_deal_index.newValue !== undefined) {
            Preloader.preload_next(changes.next_deal_index.newValue);
        }
    }
});

class Preloader {
    constructor(data, isLoaderActive) {
        this.data = data;
        this.deals = [];
        this.deals_length = data.deals_length;
        // var count_limiter = this.deals_length > 100 ? 100 : this.deals_length;
        this.count_limiter = 1;
        // this.deals_limit = this.deals.length;
        this.deals_limit = 1;
        this.storage_obj = {};
        this.count_success = 0;
        this.i = 0;
        this.isLoaderActive = isLoaderActive;
    }

    preload() {
        //filter only deals chunks:
        for (let key in this.data) {
            if (this.data.hasOwnProperty(key) && key.indexOf('deals_') !== -1 && /\d+$/.test(key)) {
                let num = Number(key.split('_')[1]);
                this.deals[num] = {
                    chunk_name: key,
                    chunk_value: this.data[key]
                };
            }
        }

        this.preload_chunk(this.i);
    }

    preload_chunk(i) {
        this.counter = 0;
        this.deals[i].chunk_value.forEach(elem => {
            let img = new Image();

            img.onload = () => {
                this.counter++;
                this.count_success++;
                this.onImgLoad();
            };

            img.onerror = () => {
                this.counter++;
                this.onImgError();
            };

            img.src = elem.image_url;
        });
    }

    static preload_next(deal_index) {

        chrome.storage.local.get('deals_length', res => {
            let _deal_index = (deal_index + 10) % res.deals_length;
            storage.get_deal_by_index(_deal_index, deal => {
                if (deal.skip_deal) {
                    let next_index = (deal_index + 11) % res.deals_length;
                    if (next_index === res.deals_length - 1) return;
                    this.preload_next(next_index);
                } else {
                    let img = new Image();
                    img.onerror = () => {
                        this.setImgSkip(deal_index, res)
                    };
                    img.src = deal.image_url;
                }
            });
        });
    }

    static setImgSkip(deal_index, res) {
        let {chunk_number, index} = storage.get_chunk_info(deal_index);
        let dealname = 'deals_' + chunk_number;
        chrome.storage.local.get(dealname, ch => {
            ch[dealname][index].skip_deal = true;
            chrome.storage.local.set(ch, () => {
                let next_index = (deal_index + 11) % res.deals_length;
                this.preload_next(next_index);
            });
        });
    }

    onImgLoad() {
        if (this.count_success === this.count_limiter) {
            chrome.storage.local.set(this.storage_obj, () => {
                isProcessing = false;
                chrome.runtime.sendMessage({message: 'processed'}, () => {
                    handleNoTabs();
                    if (this.isLoaderActive) {
                        chrome.runtime.sendMessage({cmd: 'finish_origin_change'}, () => handleNoTabs());
                    }
                });
                console.log('start tab!');
            });
        }
        this.onDealsLoaded();
    }

    onImgError(elem, index) {

        elem.skip_deal = true;
        elem.last_check_timestamp = Date.now();

        this.deals[this.i].chunk_value[index] = elem;

        this.storage_obj[this.deals[this.i].chunk_name] = this.deals[this.i].chunk_value;
        console.log(this.storage_obj);

        this.onDealsLoaded();
        // sendKeenEvent(elem.destination_iata, img.src); // TODO: uncomment for production
    }

    onDealsLoaded() {
        if (this.counter === this.deals[this.i].chunk_value.length) { // is all chunk items processed
            this.i++;
            if (this.i < this.deals_limit) {
                this.preload_chunk(this.i);
            } else {
                console.log('Preload is finished!');
                chrome.storage.local.set(this.storage_obj, () => {
                    isProcessing = false;
                    chrome.runtime.sendMessage({cmd: 'enable_settings_change'}, () => handleNoTabs());
                });
            }
        }
    }
}

class RSS {
    constructor() {
        this.url = config.hasOwnProperty('rss') ? config.rss : '';
    }

    async get() {
        if (!this.url) return;

        let parser = new RSSParser();

        let feed = await parser.parseURL(config.rss);

        let news = [];

        let len = feed.items.length >= 3 ? 3 : feed.items.length;

        for (let i = 0; i < len; i++) {
            let item = feed.items[i];
            news.push({title: item.title, link: item.link, pubDate: item.pubDate});
        }

        chrome.storage.local.set({rss: news});
    }
}

function handleNoTabs() {
    let lastError = chrome.runtime.lastError;
    if (lastError) {
        console.log(lastError.message);
    }
}

function updateDeals() {
    chrome.runtime.sendMessage({message: 'processed'}, function () {
        handleNoTabs();
        chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, function () {
            handleNoTabs();
            updateAllData(false);
        });
    });
}

chrome.alarms.create("updateData", {periodInMinutes: 120});
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "updateData") {
        console.log('alarm!!!');
        updateDeals();
    }
});

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install' || details.reason === 'update') {
        console.log('onInstalled');

        let rss = new RSS();
        rss.get();

        isProcessing = true;
        chrome.storage.local.clear(function () {
            chrome.storage.sync.clear(function () {
                let lang = navigator.language.replace('-', '_').toLowerCase().split('_')[0];
                updateAllData(false, lang);
            });
        });
    }
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get('last_update', res => {
        if (Date.now() - res.last_update >= 7200000) {
            // if (Date.now() - res.last_update >= 60000) {
            console.log('We need update data!');
            updateDeals();
        } else {
            chrome.runtime.sendMessage({message: 'processed'}, () => handleNoTabs());
        }
    });
});
