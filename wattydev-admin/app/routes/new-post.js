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
     * Instance of the tags service.
     *
     * @property tagsService
     * @type {Ember.Service}
     */
    tagsService: Ember.inject.service('tags'),

    /**
     * Instance of the types service.
     *
     * @property typesService
     * @type {Ember.Service}
     */
    typesService: Ember.inject.service('types'),

    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    beforeModel() {
        // Preload images tags and types
        let promises = [
            this.get('tagsService').getAll(),
            this.get('typesService').getAll(),
            this.get('imagesService').getAll()
        ];
        return Ember.RSVP.all(promises);
    },

    model() {
        return {
            post: this.get('postsService').createNew()
        };
    }
});
