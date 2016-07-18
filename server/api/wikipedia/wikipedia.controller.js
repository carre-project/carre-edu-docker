'use strict';

var request = require('request');
var bot = require('nodemw');

// pass configuration object
var wiki = {
    "en": new bot({
        "server": "en.wikipedia.org", // host name of MediaWiki-powered site
        "path": "/w", // path to api.php script
        "debug": false, // is more verbose when set to true
        "username": "edu.carreproject", // account to be used when logIn is called (optional)
        "password": "c@rr3pr0j3ct", // password to be used when logIn is called (optional)
        "userAgent": "Api-User-Agent", // define custom bot's user agent
        "concurrency": 5 // how many API requests can be run in parallel (defaults to 3)
      }),
    "el": new bot({
        "server": "el.wikipedia.org", // host name of MediaWiki-powered site
        "path": "/w", // path to api.php script
        "debug": false, // is more verbose when set to true
        "username": "edu.carreproject", // account to be used when logIn is called (optional)
        "password": "c@rr3pr0j3ct", // password to be used when logIn is called (optional)
        "userAgent": "Api-User-Agent", // define custom bot's user agent
        "concurrency": 5 // how many API requests can be run in parallel (defaults to 3)
      }),
    "lt": new bot({
        "server": "lt.wikipedia.org", // host name of MediaWiki-powered site
        "path": "/w", // path to api.php script
        "debug": false, // is more verbose when set to true
        "username": "edu.carreproject", // account to be used when logIn is called (optional)
        "password": "c@rr3pr0j3ct", // password to be used when logIn is called (optional)
        "userAgent": "Api-User-Agent", // define custom bot's user agent
        "concurrency": 5 // how many API requests can be run in parallel (defaults to 3)
      })
}


//Autocomplete suggestions on search terms
exports.autocomplete = function(req, res) {
  
  var term=req.params.term;
  
  var params={
    url:'http://en.wikipedia.org/w/api.php?action=opensearch&search='+term+'&limit=10&[[category:Diseases]]',
    json:true
  };
  
  request(params, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return res.json(200, body[1]);
    } 
  });

};



// search with terms
exports.search = function(req, res) {
  
    var term=req.params.term;
    var offset=req.params.offset;
    var limit=req.params.limit;
    var lang=req.params.lang||"en";
    
    var queryParams={
      'action': 'query',
      // 'query':'srsearch='+term+'&list=search&srlimit=20&sroffset='+(offset||0)+'&[[category:Diseases]]'
      'srsearch': term+' ICD-10 -intitle:ICD-',
      'list':'search',
      'srlimit':limit,
      'sroffset':offset||0
    };
    
    wiki[lang].api.call( queryParams,function(data) {
      // console.log(queryParams);
      return res.status(200).send(data);
    });

};

// Get a single article
exports.article = function(req, res) {
  
    var title=req.params.title.split('%20').join('_');
    var lang=req.params.lang||"en";
    
    var queryParams={
      'action': 'parse',
      'page':title,
      'prop':'displayTitle|text'
    };
    
    wiki[lang].api.call( queryParams,function(data) {
      return res.status(200).send(data);
    });

};
