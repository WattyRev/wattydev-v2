import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    /**
     * Instance of the posts service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    model() {
        return Ember.RSVP.hash({
            images: this.get('imagesService').getAll(),
            posts: this.get('postsService').getAll()
        });
    }
});
