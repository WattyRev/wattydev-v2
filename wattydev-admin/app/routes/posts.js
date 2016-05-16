import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the posts service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    /**
     * Instance of the types service.
     *
     * @property typesService
     * @type {Ember.Service}
     */
    typesService: Ember.inject.service('types'),

    beforeModel() {
        // Preload types
        return this.get('typesService').getAll();
    },

    model() {
        return Ember.RSVP.hash({
            posts: this.get('postsService').getAll().then(posts => {
                return posts.sortBy('-createdDate');
            })
        });
    }
});
