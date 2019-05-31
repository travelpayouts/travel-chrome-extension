import cities_data from './cities_data.js';
import booking_reviews from './booking_reviews.js';
import storage from './storage.js';
import client from './initKeen.js';
import iata_codes from './iata_codes.js';

var items_per_key = storage.items_per_key;
window.cities_data = cities_data;
var isProcessing = false;
var isAppStarted = false;
var isUpdating = false;


var currencies_dictionary = {
    Russia: ['RUB', '&#8381;'],
    Ukraine: ['UAH', '&#8372;'],
    China: ['CNY', '&yen;'],
    Belarus: ['BYN', 'Br'],
    Thailand: ['THB', '&#3647;'],
    Kazakhstan: ['KZT', '&#8376;'],
    Azerbaijan: ['AZN', '&#8380;'],
    'United States': ['USD', '&dollar;']
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.cmd == 'isProcessing') {
            sendResponse({message: '' + isProcessing});
        }

        if (request.cmd == 'update_deals') {
            isProcessing = true;
            isUpdating = true;
            isAppStarted = false;
            // chrome.storage.onChanged.removeListener(storageOnChangeListener);
            chrome.runtime.sendMessage({cmd: 'disable_settings_change'});
            // updateAllData();
            updateAllData(false, request.lang);
        }

        if (request.cmd == 'update_all') {
            isProcessing = true;
            isUpdating = true;
            isAppStarted = false;
            // chrome.storage.onChanged.removeListener(storageOnChangeListener);
            chrome.runtime.sendMessage({cmd: 'disable_settings_change'});
            chrome.storage.sync.get('settings', res => {
                updateAllData(true, res.settings.lang);
            });
        }

        if (request.cmd == 'get_translated_destination') {
            let destination_name = im_city_name(request.current_destination, cities_data, request.lang) + ', ' +
                im_country_name(request.current_destination, cities_data, request.lang);
            let originFrom = ro_city_name(request.current_origin, cities_data, request.lang);
            let originSettings = im_city_name(request.current_origin, cities_data, request.lang);
            sendResponse({destination_name: destination_name, originFrom: originFrom, originSettings: originSettings});
        }
    }
);

var get_origin_currency = function (origin_country) {
    return currencies_dictionary[origin_country] || currencies_dictionary['Russia'];
};

var ro_city_name = function (iata, city_data, lang) {
    console.log(city_data[iata]);
    var ro_city_names = city_data[iata].names;
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
}

var im_city_name = function (iata, city_data, lang) {
    var im_city_names = cities_data[iata].names,
        im_city_name;

    if (lang === 'ru' && im_city_names.ru && im_city_names.ru.name) {
        im_city_name = im_city_names.ru.name;
    } else {
        im_city_name = im_city_names.en.name;
    }
    return im_city_name;
}

var destinationPhotos = function (destination_iata, callback) {
    var photo;
    let w = Math.round(window.screen.width * devicePixelRatio);
    let h = Math.round(window.screen.height * devicePixelRatio);
    photo = {
        // image_url: "https://mphoto.hotellook.com/static/cities/3000x1500/" + destination_iata + ".auto",
        // image_url: "https://mphoto.hotellook.com/static/cities/480x320/" + destination_iata + ".auto",
        image_url: `https://mphoto.hotellook.com/static/cities/${w}x${h}/${destination_iata}.auto`,
    };

    callback(photo);
};

var where_am_i = function (lang, callback) {
    var req = new XMLHttpRequest(),
        url = "http://www.travelpayouts.com/whereami?locale=" + lang;

    req.open("GET", url, true);
    req.onload = function () {
        if (req.status == 200) {
            let result = JSON.parse(req.responseText);
            // DELETE ME!
            var origin_iata, origin_name, currency;

            chrome.storage.sync.get('settings', function (res) {
                let settings;
                if (res.settings) {
                    settings = res.settings;

                    if (settings.currency) currency = settings.currency;
                    else currency = get_origin_currency(result.country_name);

                    if (settings.originCity) {
                        for (let key in settings.originCity) {
                            // console.log(settings);
                            origin_iata = key;
                            origin_name = ro_city_name(key, cities_data, lang);
                        }
                        if (settings.hasOwnProperty('lang') && settings.lang !== lang) {
                            // currency = get_origin_currency(result.country_name);
                            // origin_iata = result.iata;
                            // origin_name = ro_city_name(result.iata, cities_data, lang);
                            console.log("settings.hasOwnProperty('lang')");
                            let originCity = im_city_name(origin_iata, cities_data, lang);
                            let origCityObj = new Object(null);
                            origCityObj[origin_iata] = originCity;
                            settings.originCity = origCityObj;
                            settings.lang = lang;
                            console.log(settings);
                            chrome.storage.sync.set({settings});
                        }
                    } else {
                        origin_iata = result.iata;
                        origin_name = ro_city_name(result.iata, cities_data, lang);
                    }

                } else {
                    currency = get_origin_currency(result.country_name);
                    origin_iata = result.iata;
                    origin_name = ro_city_name(result.iata, cities_data, lang);
                    let originCity = im_city_name(result.iata, cities_data, lang);

                    settings = {};
                    let origCityObj = new Object(null);
                    origCityObj[origin_iata] = originCity;

                    settings.currency = currency;

                    settings.originCity = origCityObj;
                    settings.lang = lang;
                    settings.showTags = true;
                    settings.showComments = true;
                    console.log(settings);
                    chrome.storage.sync.set({settings});
                }

                // chrome.storage.local.set({
                //     currency: currency, origin_city: originCity, lang: settings.lang || 'ru'
                // });
                callback(result, origin_iata, origin_name, currency[0]);
            });
        }
    };
    req.send();
};

var directionsUrl = function (origin_iata, currency) {
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
}

var fetchDirections = function (origin_iata, currency, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", directionsUrl(origin_iata, currency), true);

    req.onload = function (request) {
        request = request.target;
        if (request.status == 200) {
            var cities = [];
            var directions = JSON.parse(request.response);
            var result = directions.map(function (dir) {
                return {
                    price: dir.value,
                    return_date: dir.return_date,
                    origin: dir.origin,
                    destination: dir.destination,
                    depart_date: dir.depart_date
                }
            });

            callback(result);
        }
    };
    req.send(null);
}

// console.log(cities_data["MOW"])
// fetchDirections('VVO', console.log);

var eachAsync = function (arr, func, cb) {
    var doneCounter = 0,
        results = [];
    arr.forEach(function (item) {
        func(item, function (res) {
            doneCounter += 1;
            if (!res && doneCounter !== arr.length) return;
            else if (!res && doneCounter === arr.length) {
                cb(results);
            }
            results.push(res);
            if (doneCounter === arr.length) {
                cb(results);
            }
        });
    });
}

// var im_city_names = cities_data[iata].names,
//     im_city_name;
//
// if (lang === 'ru' && im_city_names.ru && im_city_names.ru.name) {
//     im_city_name = im_city_names.ru.name;
// } else {
//     im_city_name = im_city_names.en.name;
// }
// return im_city_name;
var im_country_name = function (iata, city_data, lang) {
    var im_country_names = cities_data[iata].country.names,
        im_country_name;

    if (lang === 'ru' && im_country_names.ru && im_country_names.ru.name) {
        im_country_name = im_country_names.ru.name;
    } else {
        im_country_name = im_country_names.en.name;
    }
    return im_country_name;
}

var updateAllData = function (param, lang) {
    isProcessing = true;
    isUpdating = true;
    where_am_i(lang, function (l, origin_iata, origin_name, currency) {

        fetchDirections(origin_iata, currency, function (directions) {
            // Show only flickr photos for Moscow
            // directions = directions.filter(function(dir) {
            // 	return l.iata !== 'MOW' || flickr_photos[dir.destination]
            // });
            let cnt = 0;
            eachAsync(directions, function (direction, cb) {
                if (!cities_data[direction.destination] || !iata_codes.includes(direction.destination)) {
                    console.log('Направление ' + direction.destination + ' отсутствует в словаре');
                    cb(null);
                    return;
                }

                console.log('->destinationPhotos: ' + cnt);
                cnt += 1;
                destinationPhotos(direction.destination, function (photo) {
                    // var random_photo = photo_urls[Math.floor(Math.random() * photo_urls.length)];
                    var deal = {
                        image_url: photo.image_url,
                        price: direction.price,
                        destination_name: im_city_name(direction.destination, cities_data, lang) + ', ' + im_country_name(direction.destination, cities_data, lang),
                        tags: (booking_reviews[direction.destination] || {}).tags,
                        review: (booking_reviews[direction.destination] || {}).review,
                        origin_name: origin_name,
                        origin_iata: origin_iata,
                        destination_iata: direction.destination,
                        depart_date: direction.depart_date,
                        return_date: direction.return_date
                    };

                    cb(deal);
                });
            }, function (deals) {

                var deals_obj = {
                    last_update: Date.now(),
                    deals_length: deals.length,
                    next_deal_index: 0,
                };

                for (var i = 0; i < Math.ceil(deals.length / items_per_key); i++) {
                    var key_name = "deals_" + i.toString();
                    deals_obj[key_name] = deals.slice(i * items_per_key, (i + 1) * items_per_key);
                }

                var keys_to_delete = [];

                for (var i = 0; i < 200; i++) {
                    keys_to_delete.push("deals_" + i.toString());
                }

                chrome.storage.local.remove(keys_to_delete, function () {
                    // console.log(deals_obj);

                    chrome.storage.local.set(deals_obj, function () {
                        preload(deals_obj, param);
                    });
                });
            });
        });
    });
};

var updateDataSoftly = function (callback) {
    chrome.storage.sync.get('settings', (r) => {
        let lang = r.settings.lang;
        console.log(lang);
        where_am_i(lang, function (l, origin_iata, origin_name, currency) {
            fetchDirections(origin_iata, currency, function (directions) {
                eachAsync(directions, function (direction, cb) {
                    if (!cities_data[direction.destination] || !iata_codes.includes(direction.destination)) {
                        console.log('Направление ' + direction.destination + ' отсутствует в словаре');
                        cb(null);
                        return;
                    }

                    destinationPhotos(direction.destination, function (photo) {
                        var deal = {
                            image_url: photo.image_url,
                            price: direction.price,
                            destination_name: im_city_name(direction.destination, cities_data, lang) + ', ' + im_country_name(direction.destination, cities_data, lang),
                            tags: (booking_reviews[direction.destination] || {}).tags,
                            review: (booking_reviews[direction.destination] || {}).review,
                            origin_name: origin_name,
                            origin_iata: origin_iata,
                            destination_iata: direction.destination,
                            depart_date: direction.depart_date,
                            return_date: direction.return_date
                        };

                        cb(deal);
                    });
                }, function (deals) {

                    var deals_obj = {
                        last_update: Date.now(),
                        deals_length: deals.length,
                    };

                    for (var i = 0; i < Math.ceil(deals.length / items_per_key); i++) {
                        var key_name = "deals_" + i.toString();
                        deals_obj[key_name] = deals.slice(i * items_per_key, (i + 1) * items_per_key);
                    }

                    var keys_to_delete = [];

                    for (var i = 0; i < 200; i++) {
                        keys_to_delete.push("deals_" + i.toString());
                    }

                    callback(deals_obj, keys_to_delete);
                });
            });
        })
    });
}

var replaceData = function (newData, keysToDelete) {
    console.log('Got new data!', Date.now());

    preload(newData, function (preloadedDeals) {
        preloadedDeals['last_update'] = newData.last_update;
        preloadedDeals['deals_length'] = newData.deals_length;
        chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, function () {
            chrome.storage.local.remove(keysToDelete, function () {
                chrome.storage.local.set(preloadedDeals, function () {
                    chrome.runtime.sendMessage({cmd: 'enable_settings_change'});
                    isUpdating = false;
                });
            });
        });
    });
}

// Update data every 60 minutes
chrome.alarms.create("updateData", {periodInMinutes: 60});
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "updateData") {
        console.log('alarm!!!')
        isUpdating = true;
        // isProcessing = true;
        // chrome.storage.onChanged.removeListener(storageOnChangeListener);
        chrome.runtime.sendMessage({cmd: 'disable_main_options'}, function () {
            updateDataSoftly(replaceData);
        });
    }
    ;
});

// Secondary preloader of next destination's image
chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'local' && changes.next_deal_index) {
        preload_next(changes.next_deal_index.newValue);
    }
    if (areaName === 'sync') {
        console.log("areaName === 'sync'");
        if (changes.lang) {
            chrome.runtime.sendMessage({message: 'processed'})
        }
    }

    function preload_next(deal_index) {
        storage.get_deal_by_index(deal_index, function (deal) {
            if (deal.skip_deal) {
                chrome.storage.local.get('deals_length', function (res) {
                    var next_index = (deal_index + 1) % res.deals_length;
                    preload_next(next_index);
                });
            } else {
                var img = new Image();
                img.src = deal.image_url;
            }
        });
    }
});

function sendKeenEvent(dest_iata, img_url) {
    var dummy = {
        destination: dest_iata,
        image_url: img_url
    };
    client.recordEvent('dummies', dummy, function (err, res) {
        if (err) console.log('Keen error')
        else console.log('Keen ok')
    });
}

function preload(data, isLoaderActive, callback) {

    var deals = [];
    var deals_length = data.deals_length;
    var count_limiter = deals_length > 100 ? 100 : deals_length;
    var storage_obj = {};

    //filter only deals chunks:
    for (var key in data) {
        if (key.indexOf('deals_') !== -1 && /\d+$/.test(key)) {
            var num = Number(key.split('_')[1]);
            deals[num] = {
                chunk_name: key,
                chunk_value: data[key]
            };
        }
    }

    var count_success = 0;

    var i = 0;

    preload_chunk(i);

    function preload_chunk(i) {
        var counter = 0;
        deals[i].chunk_value.forEach(function (elem, index) {
            var img = new Image();

            img.onload = function () {
                counter++;
                count_success++;

                // Keep 'isAppStarted' = false when 'cold' start is initiated
                if (!isAppStarted) {
                    if (count_success == count_limiter) {
                        isAppStarted = true;
                        chrome.storage.local.set(storage_obj, function () {
                            chrome.runtime.sendMessage({message: 'processed'}, function () {
                                isProcessing = false;
                                chrome.runtime.sendMessage({cmd: 'disable_main_options'});

                                if (isLoaderActive) {
                                    chrome.runtime.sendMessage({cmd: 'finish_origin_change'});
                                }
                            });

                            console.log('start tab!');
                        });
                    }
                }

                if (counter == deals[i].chunk_value.length) {
                    i++;
                    if (i < deals.length) preload_chunk(i);
                    else {
                        console.log('Preload is finished!');
                        if (callback) {
                            callback(storage_obj);
                        } else {
                            if (!isAppStarted) {
                                isAppStarted = true;
                                chrome.storage.local.set(storage_obj, function () {
                                    chrome.runtime.sendMessage({message: 'processed'}, function () {
                                        isProcessing = false;
                                        isUpdating = false;
                                    });
                                    console.log('start tab!');

                                    if (isLoaderActive) {
                                        chrome.runtime.sendMessage({cmd: 'finish_origin_change'});
                                    }
                                });
                            } else {
                                chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, function () {
                                    chrome.storage.local.set(storage_obj, function () {
                                        chrome.runtime.sendMessage({cmd: 'enable_settings_change'}, function () {
                                            isUpdating = false;
                                        });
                                    });
                                });
                            }
                        }
                    }
                }
            };

            img.onerror = function () {
                counter++;

                elem.skip_deal = true;
                elem.last_check_timestamp = Date.now();

                deals[i].chunk_value[index] = elem;

                storage_obj[deals[i].chunk_name] = deals[i].chunk_value;

                if (counter == deals[i].chunk_value.length) {
                    i++;
                    if (i < deals.length) preload_chunk(i);
                    else {
                        console.log('Preload is finished!');

                        if (callback) {
                            callback(storage_obj);
                        } else {
                            // When preloading is finished, while 'count_success' did't reached limit
                            if (!isAppStarted) {
                                isAppStarted = true;
                                chrome.storage.local.set(storage_obj, function () {
                                    chrome.runtime.sendMessage({message: 'processed'}, function () {
                                        isProcessing = false;
                                        isUpdating = false;
                                    });
                                    console.log('start tab!');
                                });
                            } else {
                                chrome.runtime.sendMessage({cmd: 'disable_settings_change'}, function () {
                                    chrome.storage.local.set(storage_obj, function () {
                                        chrome.runtime.sendMessage({cmd: 'enable_settings_change'}, function () {
                                            isUpdating = false;
                                        });
                                    });
                                });
                            }
                        }
                    }
                }

                // sendKeenEvent(elem.destination_iata, img.src); // TODO: uncomment for production
            };

            img.src = elem.image_url;
        });
    }
}

function init_storage() {
    chrome.storage.local.get('last_update', function (res) {
        if (typeof (res.last_update) == 'undefined') {
            chrome.storage.sync.get('settings', res => {
                let lang;
                if (!res.settings) {
                    lang = navigator.language.replace('-', '_').toLowerCase().split('_')[0];
                } else {
                    lang = res.settings.lang;
                }
                updateAllData(false, lang);
            });

        } else {
            console.log(Date.now() - res.last_update);
            if (Date.now() - res.last_update >= 3600000) {
                console.log('We need update data!');

                chrome.runtime.sendMessage({message: 'processed'}, function () {
                    isAppStarted = true;
                    chrome.runtime.sendMessage({cmd: 'disable_main_options'}, function () {
                        isUpdating = true;
                        updateDataSoftly(replaceData);
                    });
                });

            } else {
                chrome.runtime.sendMessage({message: 'processed'});
            }
        }
    });
}

init_storage();