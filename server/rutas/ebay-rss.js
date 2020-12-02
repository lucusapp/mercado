const EbayRss = require('ebay-rss');
 
let ebayRss = new EbayRss();
ebayRss.search('253932593275').then(results => {
  /* Iterate results.items */
  console.log(results)
});