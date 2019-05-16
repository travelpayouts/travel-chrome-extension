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
    chrome.storage.local.get(chunk_name, function(s_data) {
        var deals = s_data[chunk_name];
        callback(deals[chunk_data.index]);
    });
};

export default {
    get_chunk_info: get_chunk_info,
    get_deal_by_index: get_deal_by_index,
    items_per_key: items_per_key
}