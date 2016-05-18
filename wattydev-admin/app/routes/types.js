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
     * Instance of the alerts service.
     *
     * @property alertsService
     * @type {Ember.Service}
     */
    alertsService: Ember.inject.service('alerts'),

    beforeModel() {
        // Preload posts
        return this.get('postsService').getAll();
    },

    model() {
        return Ember.RSVP.hash({
            types: this.get('typesService').getAll().then(posts => {
                return posts.sortBy('title');
            })
        });
    },

    actions: {
        /**
         * When the user is done creating a new type.
         *
         * @method actions.doneEditing
         * @return {}
         */
        doneEditing(response) {
            if (response.message === 'saved') {
                this.get('alertsService').success('Your type has been saved.');
                this.refresh();
            } else if (response.message === 'deleted') {
                this.get('alertsService').success('Your type has been deleted.');
                this.refresh();
            }
        }
    }
});
