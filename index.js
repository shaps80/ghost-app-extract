var App = require('ghost-app'),
    hbs = require('express-hbs'),
    Showdown  = require('showdown-ghost'),
    converter = new Showdown.converter({extensions: ['ghostgfm', 'footnotes', 'highlight']}),
    downsize = require('downsize');

const openCloseTagsRegex = /<extract>((.|\n)*?)<\/extract>/i;
const singleTagRegex = /^((.|\n)*?)<(extract) *\/>/i;
const truncateOptions = {
    "words": 50
};

function stripHTML(html) {
    var excerpt = html.replace(/<(\/?extract) *(\/?)>/ig, '').replace(/<a href="#fn.*?rel="footnote">.*?<\/a>/gi, '');
    excerpt = excerpt.replace(/<div class="footnotes"><ol>.*?<\/ol><\/div>/, '');
    excerpt = excerpt.replace(/<\/?[^>]+>/gi, '');
    excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, ' ');
    return excerpt;
}

var postExtract = function(post) {
    var openCloseTagsMatches = openCloseTagsRegex.exec(post.html);

    if (openCloseTagsMatches !== null) {
        var html = stripHTML(openCloseTagsMatches[1]);
        html = downsize(html, {});
        post.extract = new hbs.handlebars.SafeString(String(html));
    } else {
        var singleTagMatches = singleTagRegex.exec(post.html);

        if (singleTagMatches !== null) {
            var html = stripHTML(singleTagMatches[1]);
            html = downsize(html, {});
            post.extract = new hbs.handlebars.SafeString(String(html));
        } else {
            var html = stripHTML(post.html);
            html = downsize(html, truncateOptions);
            post.extract = new hbs.handlebars.SafeString(String(html));
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
