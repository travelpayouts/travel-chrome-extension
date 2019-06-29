import cities_data from './cities_data.js';
import booking_reviews from './booking_reviews.js';
import storage from './storage.js';
import iata_codes from './iata_codes.js';
import getOriginCurrency from "./currencies.js";

var isProcessing = false;
var isAppStarted = false;
var isUpdating = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        if (request.cmd === 'isProcessing') {
            sendResponse({message: '' + isProcessing});
        }

        if (request.cmd === 'update_all') {
            isAppStarted = false;
            chrome.runtime.sendMessage({cmd: 'disable_settings_change'});
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
    // image_url: "https://mphoto.hotellook.com/static/cities/3000x1500/" + destination_iata + ".auto",
    // image_url: "https://mphoto.hotellook.com/static/cities/480x320/" + destination_iata + ".auto",
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
                        // console.log(settings);
                        origin_iata = key;
                        origin_name = ro_city_name(key, lang);
                    }
                    if (settings.hasOwnProperty('lang') && settings.lang !== lang) {
                        // currency = getOriginCurrency(result.country_name);
                        // origin_iata = result.iata;
                        // origin_name = ro_city_name(result.iata, cities_data, lang);
                        console.log("settings.hasOwnProperty('lang')");
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
    );
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
    return new Promise(resolve => {
        fetch(getDirectionsUrl(origin_iata, currency)).then(response => response.json()).then(directions => {
            let result = directions.map(function (dir) {
                return {
                    price: dir.value,
                    return_date: dir.return_date,
                    origin: dir.origin,
                    destination: dir.destination,
                    depart_date: dir.depart_date
                }
            });
            resolve(result);
        });
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
        // cb(null);
        // return;
        return null;
    }

    let image_url = getDestinationPhotosUrl(direction.destination);
    // var random_photo = photo_urls[Math.floor(Math.random() * photo_urls.length)];
    return {
        image_url: image_url,
        price: direction.price,
        destination_name: im_city_name(direction.destination, lang) + ', ' +
            im_country_name(direction.destination, lang),
        tags: (booking_reviews[direction.destination] || {}).tags,
        review: (booking_reviews[direction.destination] || {}).review,
        origin_name: origin_name,
        origin_iata: origin_iata,
        destination_iata: direction.destination,
        depart_date: direction.depart_date,
        return_date: direction.return_date
    };

    // cb(deal);
}

function processDirections(directions, origin_name, origin_iata, lang) {
    let doneCounter = 0, results = [];
    // let len = 30;
    let len = directions.length;
    for (let i = 0; i < len; i++) { // arr.forEach(function (item) {
        let item = directions[i];
        let d = processDirection(item, origin_name, origin_iata, lang);

        doneCounter += 1;
        if (!d && doneCounter !== len) continue; //return;
        else if (!d && doneCounter === len) {
            // console.log(results);
            return results;
        }
        results.push(d);
        if (doneCounter === len) {
            // console.log(results);
            // cb(results);
            return results;
        }
    }
}


async function updateAllData(isLoaderActive, lang, replaceData) {
    isProcessing = true;
    isUpdating = true;
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

        if (replaceData) {
            // callback(dealsObj, keys_to_delete);
            let p = new Preloader(dealsObj, isLoaderActive);
            p.replaceData(keys_to_delete);
        } else {
            console.log('replaceData else');

            dealsObj.next_deal_index = 0;
            chrome.storage.local.remove(keys_to_delete, function () {
                chrome.storage.local.set(dealsObj, function () {
                    let p = new Preloader(dealsObj, isLoaderActive);
                    p.preload();
                });
            })
        }
    });
}

// var replaceData = function (newData, keysToDelete) {
//     console.log('Got new data!', Date.now());
//
//     preload(newData, function (preloadedDeals) {
//         preloadedDeals['last_update'] = newData.last_update;
//         preloadedDeals['deals_length'] = newData.deals_length;
//         console.log('sendMessage');
//         chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, function () {
//             chrome.storage.local.remove(keysToDelete, function () {
//                 chrome.storage.local.set(preloadedDeals, function () {
//                     chrome.runtime.sendMessage({cmd: 'enable_settings_change'});
//                     isUpdating = false;
//                 });
//             });
//         });
//     });
// };


// Secondary preloader of next destination's image
chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'local' && changes.next_deal_index) {
        console.log('onChange: ', changes.next_deal_index.oldValue, changes.next_deal_index.newValue);

        Preloader.preload_next(changes.next_deal_index.newValue);
    }
    if (areaName === 'sync') {
        console.log("areaName === 'sync'");
        if (changes.lang) {
            chrome.runtime.sendMessage({message: 'processed'})
        }
    }
});


// data:
// {
//
//     "deals_0": [{
//     "image_url": "https://mphoto.hotellook.com/static/cities/1680x1050/SYZ.auto",
//     "price": 51800,
//     "destination_name": "Шираз, Иран",
//     "origin_name": "Киева",
//     "origin_iata": "IEV",
//     "destination_iata": "SYZ",
//     "depart_date": "2019-06-28",
//     "return_date": "2019-07-28"
// }, {
//     "image_url": "https://mphoto.hotellook.com/static/cities/1680x1050/WAS.auto",
//     "price": 34007,
//     "destination_name": "Вашингтон, США",
//     "origin_name": "Киева",
//     "origin_iata": "IEV",
//     "destination_iata": "WAS",
//     "depart_date": "2019-10-07",
//     "return_date": "2019-10-21"
// },
// ],
//     "last_update": 1561382933364,
//     "deals_length": 646,
//     "next_deal_index": 0
// }
class Preloader {
    constructor(data, isLoaderActive) {
        this.isReplaceMode = false;
        this.keysToDelete = null;
        this.data = data;
        this.deals = [];
        this.deals_length = data.deals_length;
        // var count_limiter = this.deals_length > 100 ? 100 : this.deals_length;
        this.count_limiter = this.deals_length > 1 ? 1 : this.deals_length;
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
        this.deals[i].chunk_value.forEach((elem, index) => {
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
        storage.get_deal_by_index(deal_index, deal => {
            if (deal.skip_deal) {
                chrome.storage.local.get('deals_length', res => {
                    let next_index = (deal_index + 1) % res.deals_length;
                    this.preload_next(next_index);
                });
            } else {
                let img = new Image();
                img.src = deal.image_url;
            }
        });
    }

    replaceData(keysToDelete) {
        this.isReplaceMode = true;
        this.keysToDelete = keysToDelete;
        this.preload();
    }

    replace(preloadedDeals) {
        preloadedDeals['last_update'] = this.data.last_update;
        preloadedDeals['deals_length'] = this.deals_length;
        isProcessing = false;

        chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, () => {
            chrome.storage.local.set(preloadedDeals, () => {
                chrome.runtime.sendMessage({message: 'processed'});
                chrome.runtime.sendMessage({cmd: 'enable_settings_change'});
                isUpdating = false;
            });
        });
    }

    onImgLoad() {
        // Keep 'isAppStarted' = false when 'cold' start is initiated
        if (!isAppStarted && this.count_success === this.count_limiter) {
            isAppStarted = true;
            chrome.storage.local.set(this.storage_obj, () => {
                chrome.runtime.sendMessage({message: 'processed'}, () => {

                    let lastError = chrome.runtime.lastError;
                    if (lastError) {
                        console.log(lastError.message);
                    }

                    isProcessing = false;
                    chrome.runtime.sendMessage({cmd: 'disable_main_options'});

                    if (this.isLoaderActive) {
                        chrome.runtime.sendMessage({cmd: 'finish_origin_change'});
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
                if (this.isReplaceMode) { //callback
                    this.replace(this.storage_obj);
                } else {
                    if (!isAppStarted) {
                        isAppStarted = true;
                        chrome.storage.local.set(this.storage_obj, () => {
                            chrome.runtime.sendMessage({message: 'processed'}, () => {
                                isProcessing = false;
                                isUpdating = false;
                            }, r => {
                                var lastError = chrome.runtime.lastError;
                                if (lastError) {
                                    console.log(lastError.message);
                                }
                            });
                            console.log('start tab!');

                            // load
                            if (this.isLoaderActive) {
                                chrome.runtime.sendMessage({cmd: 'finish_origin_change'});
                            }
                        });
                    } else {
                        this.onImgProcessed();
                    }
                }
            }
        }
    }

    onImgProcessed() {
        chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, () => {
            let lastError = chrome.runtime.lastError;
            if (lastError) {
                console.log(lastError.message);
            }
            chrome.storage.local.set(this.storage_obj, () => {
                chrome.runtime.sendMessage({cmd: 'enable_settings_change'}, () => {
                    let lastError = chrome.runtime.lastError;
                    if (lastError) {
                        console.log(lastError.message);
                    }
                    isUpdating = false;
                });
            });
        });
    }
}

// function preload(data, isLoaderActive, callback) {

function init_storage() {
    chrome.storage.local.get('last_update', async function (res) {
        if (typeof res.last_update === 'undefined') {
            let settings = await loadSettingsSynced();
            let lang = settings ? settings.lang : navigator.language.replace('-', '_')
                .toLowerCase().split('_')[0];
            updateAllData(false, lang);

        } else {
            // console.log(Date.now() - res.last_update);
            if (Date.now() - res.last_update >= 3600000) {
                console.log('We need update data!');

                chrome.runtime.sendMessage({message: 'processed'}, function () {
                    isAppStarted = true;
                    let lastError = chrome.runtime.lastError;
                    if (lastError) {
                        console.log(lastError.message);
                    }
                    chrome.runtime.sendMessage({cmd: 'disable_main_options'}, function () {
                        let lastError = chrome.runtime.lastError;
                        if (lastError) {
                            console.log(lastError.message);
                        }
                        // updateDataSoftly(replaceData);
                        updateAllData(false, null, true);
                    });
                });

            } else {
                console.log('sendMessage');
                chrome.runtime.sendMessage({message: 'processed'});
            }
        }
    });
}

// Update data every 60 minutes
chrome.alarms.create("updateData", {periodInMinutes: 60});
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "updateData") {
        console.log('alarm!!!');
        // isUpdating = true;
        // isProcessing = true;
        // chrome.storage.onChanged.removeListener(storageOnChangeListener);
        chrome.runtime.sendMessage({cmd: 'disable_main_options'}, function () {
            // updateDataSoftly(replaceData);
            updateAllData(false, null, true);
        });
    }
});

init_storage();