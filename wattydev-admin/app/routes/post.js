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

    /**
     * Instance of the tags service.
     *
     * @property tagsService
     * @type {Ember.Service}
     */
    tagsService: Ember.inject.service('tags'),

    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    /**
     * Instance of the alerts service.
     *
     * @property alertsService
     * @type {Ember.Service}
     */
    alertsService: Ember.inject.service('alerts'),

    beforeModel() {
        // Preload stuff
        return Ember.RSVP.all([
            this.get('typesService').getAll(),
            this.get('tagsService').getAll(),
            this.get('imagesService').getAll()
        ]);
    },

    model(params) {
        return Ember.RSVP.hash({
            post: this.get('postsService').getOne(params.postId)
        });
    },

    actions: {
        /**
         * The post has been saved.
         *
         * @method savedPost
         * @return {Void}
         */
        savedPost() {
            this.get('alertsService').success('Your changes have been saved.');
        }
    }
});
