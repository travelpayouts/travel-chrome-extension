$(function(){

    // chrome.storage.sync.clear();
    var settings = {};
    get_settings(apply_settings);
    var dd = new DropDown($('#choose_currency'));
    var sb = new SelectionBox($('#exclude_cities'));

    window.addEventListener('update_settings', function() {
        get_settings();
    }, false);
    
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

    function get_settings(callback) {
        chrome.storage.sync.get('settings', function(res){
            if(res.settings) {
                settings = res.settings;
                if(callback) {
                    callback(settings);
                }
            }
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
            }
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

    var hide_cities_choices,
        autoCompleteCitiesToHide;

    chrome.storage.local.get(function(res){
        hide_cities_choices = get_choices(res);
        var input = document.getElementById("hide_cities");
        autoCompleteCitiesToHide = new Awesomplete(input, {
            list: hide_cities_choices,
            data: function(item, input) {
                    if(settings.hideCities) {
                        if(settings.hideCities[item[2]]) return;
                    }
                    return { label: item[0]+', '+'<span data-index="'+hide_cities_choices.indexOf(item)+'">'+item[1]+', '+item[2]+'</span>', value: item[0] };
            }
        });
    });

    document.getElementById('hide_cities').addEventListener('awesomplete-selectcomplete', function(e){
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
        // var arrayIndex = selectText.match(/\d+/)[0];
        // sb.boxItemsArray[arrayIndex] = hide_cities_choices[arrayIndex];
        // delete hide_cities_choices[arrayIndex];
        // console.log(e)
        // console.log(sb.boxItemsArray)
        // console.log(hide_cities_choices)
        create_hidden_city(cityToHide, iata);
    });

    function create_hidden_city(city, iata) {
        var hidden_cities_box = document.getElementById('exclude_cities');
        var span = '<span class="hidden-cities__item" data-iata="'+iata+'">' + city + ' ' +
                   '<img class="hidden-cities__item-icon" src="img/icons/close-8px-light.svg" alt="">'+
                   '<img class="hidden-cities__item-icon--hover" src="img/icons/close-8px-dark.svg" alt="">'+
                   '</span>';
        $(hidden_cities_box).append(span);

    }
});