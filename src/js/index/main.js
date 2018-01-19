$(function(){

    // chrome.storage.sync.clear();
    var settings = {},
        currency_label = document.getElementById('currency_label'),
        currency_dropdown = document.getElementById('currency_dropdown'),
        currency_selector;
    get_settings(apply_settings);
    var sb = new SelectionBox($('#exclude_cities'));

    window.addEventListener('update_settings', function() {
        get_settings();
    }, false);
    
    $(document).click(function() {
        // all dropdowns
        $('.wrapper-select-dropdown').removeClass('active');
        $('.prices-calendar-container').addClass('prices-calendar-container--hidden');
    });

    $('.prices-calendar-container').on('click', '.prices-calendar-month', function(e){
        e.stopPropagation();
    });

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

    var $comments_container = $('#comments_container');
    var $toggle_comments = $('#toggle_comments');

    $toggle_comments.on('change', function(){
        showComments(!this.checked);
        settings.showComments = !$toggle_comments[0].checked;
        chrome.storage.sync.set({settings});
    });

    var $tags_container = $('#tags_container');
    var $toggle_tags = $('#toggle_tags');

    $toggle_tags.on('change', function(){
        showTags(!this.checked);
        settings.showTags = !$toggle_tags[0].checked;
        chrome.storage.sync.set({settings});
    });

    // var hide_cities_choices,
    //     autoCompleteCitiesToHide,
    //     input_hide_cities = document.getElementById("hide_cities");

    var input_hide_cities = document.getElementById("hide_cities");
    var autoCompleteCitiesToHide = new Awesomplete(input_hide_cities, {
        data: function(item, input) {
            if(settings.hideCities) {
                if(settings.hideCities[item[2]]) return;
            }
            return { label: item[0]+', '+'<span data-searches="'+item[3]+'">'+item[1]+', '+item[2]+'</span>', value: item[0] };
        },
        // maxItems: 7,
        sort: function(a,b) {
            var a = parseInt(a.label.substring(a.label.search(/="/i), a.label.search(/">/i)).slice(2));
            var b = parseInt(b.label.substring(b.label.search(/="/i), b.label.search(/">/i)).slice(2));
            if(a > b) return -1;
            if(a < b) return 1;
            return 0;
        }
    });

    input_hide_cities.addEventListener('input', function(e){
        var list = getCitiesListWithAjax(e.target.value, function(data){
            autoCompleteCitiesToHide.list = data;
            autoCompleteCitiesToHide.evaluate();    
        });
    });


    // chrome.storage.local.get(function(res){
    //     hide_cities_choices = get_choices(res);
    //     autoCompleteCitiesToHide = new Awesomplete(input_hide_cities, {
    //         list: hide_cities_choices,
    //         data: function(item, input) {
    //                 if(settings.hideCities) {
    //                     if(settings.hideCities[item[2]]) return;
    //                 }
    //                 return { label: item[0]+', '+'<span>'+item[1]+', '+item[2]+'</span>', value: item[0] };
    //         },
    //         maxItems: 7,
    //         sort: Awesomplete.SORT_BYORDER
    //     });
    // });

    input_hide_cities.addEventListener('awesomplete-selectcomplete', function(e){
        var cityToHide = e.target.value;
        e.target.value = '';
        var selectText = e.text.label;
        var iata = selectText.slice(-10, -7);
        if(!settings) {
            settings = {};
        }
        if(settings.hideCities) {
            settings.hideCities[iata] = cityToHide;
        } else {
            settings.hideCities = {};
            settings.hideCities[iata] = cityToHide;    
        }             

        chrome.storage.sync.set({settings});
        create_hidden_city(cityToHide, iata);
    });

    input_hide_cities.addEventListener('blur', function(e){
        if(e.target.value !== '') {
            e.target.value = '';
        }
    });

    var input_origin_city = document.getElementById('input_origin_city');
    var autoCompleteOrigin = new Awesomplete(input_origin_city, {
        data: function(item, input) {
            return { label: item[0]+', '+'<span data-searches="'+item[3]+'">'+item[1]+', '+item[2]+'</span>', value: item[0] };            
        },
        sort: function(a,b) {
            var a = parseInt(a.label.substring(a.label.search(/="/i), a.label.search(/">/i)).slice(2));
            var b = parseInt(b.label.substring(b.label.search(/="/i), b.label.search(/">/i)).slice(2));
            if(a > b) return -1;
            if(a < b) return 1;
            return 0;
        }
    });

    input_origin_city.addEventListener('awesomplete-selectcomplete', function(e){
        chrome.storage.sync.get('settings', function(res) {
            if(res.settings) {
                var settings = res.settings;
            } else {
                var settings = {};
            }
            settings.originCity = {}
            settings.originCity[e.text.slice(-10, -7)] = e.target.value;
            chrome.storage.sync.set({settings}, function(){
                input_origin_city.blur();
                var event = new Event('set_loaders');
                window.dispatchEvent(event);
            });
        });
    });

     input_origin_city.addEventListener('focus', function(){
        input_origin_city.value = '';
     });

    input_origin_city.addEventListener('input', function(e){
        var list = getCitiesListWithAjax(e.target.value, function(data){
            autoCompleteOrigin.list = data;
            autoCompleteOrigin.evaluate();    
        });
    });

    input_origin_city.addEventListener('blur', function(e){
        chrome.storage.sync.get('settings', function(res){
            if(res.settings && res.settings.originCity) {
                var city = res.settings.originCity;
                for(var key in city) {
                    if(input_origin_city.value !== city[key]) {
                        input_origin_city.value = city[key];
                    }
                }    
            } else if(res.settings && !res.settings.originCity || !res.settings) {
                get_auto_settings('origin_city', function(data){
                    if(input_origin_city.value !== data.origin_city)
                        set_origin_city_value(data.origin_city);
                });
            }
        });
    });

    function getCitiesListWithAjax(value, callback) {
        var req = new XMLHttpRequest(),
            url = 'http://places.aviasales.ru/match?term='+value+'&locale=ru';
        
        req.open('GET', url, true);
        req.onload = function() {
            if(req.status == 200) {
                var place_data = JSON.parse(req.responseText);
                if(place_data.length > 0) {
                    var choices = [];
                    // var returned_cities = {},
                    //     choices = [];

                    // place_data.forEach(function(item){
                    //     if(item.city_iata) returned_cities[item.city_iata] = item; //check if there are entries without city_iata
                    // });

                    // for(var key in returned_cities) {
                    //     var choice = [ returned_cities[key].name.substring(0, returned_cities[key].name.indexOf(',')), returned_cities[key].name.substring(returned_cities[key].name.indexOf(',')).substring(2), key, returned_cities[key].searches_count];
                    //     choices.push(choice);
                    // }
                    place_data.forEach(function(item){
                        if(!item.city_iata) return; //check if there are entries without city_iata
                        var choice = [ item.name.substring(0, item.name.indexOf(',')), item.name.substring(item.name.indexOf(',')).substring(2), item.city_iata, item.searches_count];
                        choices.push(choice);
                    });
                } 
            }
            callback(choices);
        };
        req.send();
    }

    function get_settings(callback) {
        chrome.storage.sync.get('settings', function(res){
            if(res.settings) {
                settings = res.settings;
                if(callback) {
                    callback(settings);
                }
            } else {
                get_auto_settings(['currency', 'origin_city'], apply_auto_settings);
            }
        });
    }

    function apply_auto_settings(auto_settings) {
        if($.isEmptyObject(auto_settings)) {
            set_currency_value('RUB');
            set_origin_city_value('Москва');
        } else {
            for(var setting in auto_settings) {
                switch(setting) {
                    case 'currency':
                        set_currency_value(auto_settings.currency[0]);
                        break;
                    case 'origin_city':
                        set_origin_city_value(auto_settings.origin_city);
                        break;
                }
            }    
        }
    }

    function set_currency_value(value) {
        var currencyListElem = currency_dropdown.querySelector('li[data-currency='+ value +']');
        currency_label.innerHTML = currencyListElem.innerHTML;
        currencyListElem.classList.add('checked');
        currency_selector = new DropDown($('#choose_currency'));      
    }

    function set_origin_city_value(value) {
        input_origin_city.value = value;
    }

    function get_auto_settings(settings_name, callback) {
        chrome.storage.local.get(settings_name, function(res){
            callback(res);
        });
    }

    function apply_settings(settings) {
        for(var key in settings) {
            switch(key) {
                case 'hideCities': 
                    for(var k in settings.hideCities) {
                        create_hidden_city(settings.hideCities[k], k);
                    }
                    break;
                case 'showComments':
                    showComments(settings.showComments);
                    $toggle_comments[0].checked = !settings.showComments;
                    break;
                case 'showTags':
                    showTags(settings.showTags);
                    $toggle_tags[0].checked = !settings.showTags;
                    break;
                case 'originCity':
                    for(var key in settings.originCity) {
                        set_origin_city_value(settings.originCity[key])
                    }
                    break;
                case 'currency':
                    set_currency_value(settings.currency[0]);
                    break;
            }
        }
        if(!settings.currency && !settings.originCity) {
            get_auto_settings(['currency', 'origin_city'], apply_auto_settings);
        } else if(!settings.currency) {
            get_auto_settings('currency', apply_auto_settings);
        } else if(!settings.originCity) {
            get_auto_settings('origin_city', apply_auto_settings);
        }
    }

    function showComments(state) {
        if(state) {
            $comments_container.removeClass('review-container--hidden');
        } else {
            $comments_container.addClass('review-container--hidden');
        }
    }

    function showTags(state) {
        if(state) {
            $tags_container.removeClass('tags-container--hidden');
        } else {
            $tags_container.addClass('tags-container--hidden');
        }
    }

    function get_choices(obj) {
        var choices = [];
        var filter = /deals_/;
        for(var k in obj) {
            if(filter.test(k) && Array.isArray(obj[k])) {
                obj[k].forEach(function(item){
                    var itemName = item.destination_name;
                    choices.push([itemName.substring(0, itemName.indexOf(',')), (itemName.substring(itemName.indexOf(' '))).substring(1), item.destination_iata]);
                });
            }
        } 
        return choices;   
    }

    function create_hidden_city(city, iata) {
        var hidden_cities_box = document.getElementById('exclude_cities');
        var span = '<span class="hidden-cities__item" data-iata="'+iata+'">' + city + ' ' +
                   '<img class="hidden-cities__item-icon" src="img/icons/close-8px-light.svg" alt="">'+
                   '<img class="hidden-cities__item-icon--hover" src="img/icons/close-8px-dark.svg" alt="">'+
                   '</span>';
        $(hidden_cities_box).append(span);

    }
});