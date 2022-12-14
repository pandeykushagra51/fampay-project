const axios = require('axios');
const {getApiKeys} = require('./api-key.js');
const {insertData} = require('../database/create_database');
const host = 'www.googleapis.com';
const path = '/youtube/v3/search';
const query = 'nature|blog|sports';
const otherQuery = '&part=snippet&type=video&order=date&publishedAfter=2020-01-01T00:00:00Z&maxresult=20'
let nextPageToken= null;


async function callYoutubeApi(){
    let keys = await getApiKeys();
    for(let key of keys){
        let url = 'https://' + host + path + '?' + 'key=' + key  + '&' + otherQuery + '&q=' + query;
        if(nextPageToken != null)
        url +=  '&' + 'pageToken=' + nextPageToken;
        try {
            const object = await axios.get(url);
            if('code' in object && object['code'] != "200"){
                console.log('some error occured\n error message : ',object['message']);
            } else{
                nextPageToken = object.data.nextPageToken;
                let items = await object.data.items;
                let dataList = [];
                for(index in items){
                    dataList.push(items[index].snippet);
                }
                insertData(dataList);
                break;
            }

        } catch (error) {
            console.log('some error occured\n error message: ',error);
        }
    }

}



module.exports = {callYoutubeApi}

