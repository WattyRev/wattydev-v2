import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The full list of posts.
     *
     * @property posts
     * @type {Ember.Object[]}
     */
    posts: null,

    /**
     * Instance of the permalink service.
     *
     * @property permalinkService
     * @type {Ember.Service}
     */
    permalinkService: Ember.inject.service('permalink'),

    /**
     * The base url for posts.
     *
     * @property publicRoot
     * @type {String}
     * @readOnly
     */
    baseUrl: Ember.computed('permalinkService.publicRoot', function () {
        return this.get('permalinkService.publicRoot') + 'posts/';
    }).readOnly(),

    /**
     * The five most recently created posts.
     *
     * @property recentImages
     * @type {Ember.Object[]}
     */
    recentPosts: Ember.computed('posts.@each', function () {
        let posts = Ember.makeArray(this.get('posts'));
        return posts.sortBy('created').slice(0, 5);
    })
});
