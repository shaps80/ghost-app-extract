var App = require('ghost-app'),
    Showdown  = require('showdown-ghost');

var postExtract = function(post) {
    console.log(post);
    var extract = post.markdown.split('<extract />', 2);
    post.extract = extract[extract.length - 1];
};

var MyApp = App.extend({
    install: function () {},
    uninstall: function () {},

    activate: function () {
        this.ghost.filters.register('prePostsExtract', function (posts) {
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
