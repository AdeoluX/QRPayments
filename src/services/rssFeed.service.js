const Parser = require('rss-parser');
const parser = new Parser();

// URL of the RSS feed you want to access
const feedUrl = 'http://rss.desiringgod.org/';
  
class RssService {
    static getFeeds = async () => {
        const feed = await parser.parseURL('http://rss.desiringgod.org/');
        console.log(feed, feedUrl)
        const titles = feed.items.map(item =>{return {
            title: item.title,
            creator: item.creator,
            link: item.link,
            image: item.enclosure?.url || 'https://dg.imgix.net/how-to-love-a-sister-in-christ-exkfxseb-en/landscape/how-to-love-a-sister-in-christ-exkfxseb-da0b13cce094b0f7f692378be2205c0d.jpg?ts=1692311005&ixlib=rails-4.3.1&auto=format%2Ccompress&fit=min&w=700&h=394&dpr=2&ch=Width%2CDPR',
            content: item.content,
            date_published: item.pubDate,
            snippet: item.contentSnippet
        }});
        console.log(feed)
        return titles
    };
    static getInterests = async() => {
        return [
            {

            }
        ]
    };
}


module.exports = RssService