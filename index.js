var App = require('ghost-app'),
    hbs = require('express-hbs'),
    Showdown  = require('showdown-ghost'),
    converter = new Showdown.converter({extensions: ['ghostgfm', 'footnotes', 'highlight']}),
    downsize = require('downsize');

const truncateBy = "words";
const truncateLength = "26";
const openCloseTagsRegex = /<extract>((.|\n)*?)<\/extract>/i;
const singleTagRegex = /^((.|\n)*?)<(extract) *\/>/i;

function stripHTML(html) {
    var excerpt = html.replace(/<a href="#fn.*?rel="footnote">.*?<\/a>/gi, '');
    excerpt = excerpt.replace(/<div class="footnotes"><ol>.*?<\/ol><\/div>/, '');
    excerpt = excerpt.replace(/<\/?[^>]+>/gi, '');
    excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, ' ');
    return downsize(excerpt, { truncateBy: truncateLength })
}

var postExtract = function(post) {
    var openCloseTagsMatches = openCloseTagsRegex.exec(post.html);

    if (openCloseTagsMatches !== null) {
        var html = new hbs.handlebars.SafeString(openCloseTagsMatches[1]);
        post.extract = stripHTML(String(html));
    } else {
        var singleTagMatches = singleTagRegex.exec(post.html);

        if (singleTagMatches !== null) {
            var html = new hbs.handlebars.SafeString(singleTagMatches[1]);
            post.extract = stripHTML(String(html));
        } else {
            var html = post.html.replace(/<(\/?extract) *(\/?)>/ig, '');
            post.extract = stripHTML(String(post.html));
        }
    }
};

var MyApp = App.extend({
    install: function () {},
    uninstall: function () {},

    activate: function () {
        this.ghost.filters.register('prePostsRender', 9, function (posts) {
            if (posts instanceof Array) {
                posts.forEach(function(post) {
                    postExtract(post);
                });
            } else {
                postExtract(posts);
            }

            return posts;
        });
    },

    deactivate: function () {}
});

module.exports = MyApp;
