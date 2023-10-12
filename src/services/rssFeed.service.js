const Parser = require('rss-parser');
const parser = new Parser();

// URL of the RSS feed you want to access
const feedUrl = 'https://www.youralliance.org/blog-feed.xml';
  
class RssService {
    static getFeeds = async () => {
        const feed = await parser.parseURL(feedUrl);
        const titles = feed.items.map(item =>{return {
            title: item.title,
            creator: item.creator,
            link: item.link,
            image: item.enclosure.url,
            content: item.content,
            date_published: item.pubDate,
            snippet: item.contentSnippet
        }});
        console.log(titles)
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