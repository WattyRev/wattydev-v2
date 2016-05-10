import Ember from 'ember';
import PostModel from 'wattydev-admin/models/post';

export default Ember.Service.extend({
    /**
     * Instance of the API service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    /**
     * Get the list of posts.
     *
     * @method getPosts
     * @return {Promise}
     */
    getPosts() {
        if (this.get('posts.length')) {
            return Ember.RSVP.resolve(this.get('posts'));
        }
        return this.get('apiService').getPosts().then(data => {
            let posts = Ember.makeArray(data.posts).map(post => PostModel.create(post));
            this.set('posts', posts);
            return posts;
        });
    },

    /**
     * Refresh the posts.
     *
     * @method refresh
     * @return {Promise}
     */
    refresh() {
        this.set('posts', Ember.makeArray());
        return this.getPosts();
    },

    /**
     * The list of posts currently cached.
     *
     * @property posts
     * @type {Image[]}
     */
    posts: Ember.makeArray(),

    /**
     * Get a specific post by id.
     *
     * @method getPost
     * @param {Number} id The id of the post to get
     * @return {Promise}
     */
    getPost(id) {
        if (this.get('posts.length')) {
            return this.get('posts').findBy('id', id);
        }
        return this.get('apiService').getPost(id).then(post => post ? PostModel.create(post) : null);
    },

    /**
     * Create a new post.
     *
     * @method createNew
     * @return {Image}
     */
    createNew() {
        return PostModel.create();
    }
});
