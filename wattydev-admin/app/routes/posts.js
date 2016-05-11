import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the posts service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    model() {
        return Ember.RSVP.hash({
            posts: this.get('postsService').getAll().then(posts => {
                return posts.sortBy('createdDate');
            })
        });
    }
});
