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
        doneEditng(response) {
            if (response.message === 'saved') {
                this.reload();
            } else if (response.message === 'deleted') {
                this.reload();
            }
        }
    }
});
