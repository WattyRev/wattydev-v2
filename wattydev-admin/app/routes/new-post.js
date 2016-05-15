import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the posts service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    tagsService: Ember.inject.service('tags'),

    typesService: Ember.inject.service('types'),

    beforeModel() {
        let promises = [
            this.get('tagsService').getAll(),
            this.get('typesService').getAll()
        ];
        return Ember.RSVP.all(promises);
    },

    model() {
        return {
            post: this.get('postsService').createNew()
        };
    }
});
