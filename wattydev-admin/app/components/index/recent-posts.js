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
     * The five most recently created posts.
     *
     * @property recentImages
     * @type {Ember.Object[]}
     */
    recentPosts: Ember.computed('posts.@each', function () {
        let posts = Ember.makeArray(this.get('posts'));
        console.log('posts', posts.get('firstObject.content'));
        return posts.sortBy('created').slice(0, 5);
    })
});
