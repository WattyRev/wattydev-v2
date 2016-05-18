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
            tags: this.get('tagsService').getAll().then(tags => {
                return tags.sortBy('title');
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
                this.get('alertsService').success('Your tag has been saved.');
                this.refresh();
            } else if (response.message === 'deleted') {
                this.get('alertsService').success('Your tag has been deleted.');
                this.refresh();
            }
        }
    }
});
