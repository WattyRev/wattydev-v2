import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the posts service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    typesService: Ember.inject.service('types'),

    model() {
        let typesService = this.get('typesService');
        return Ember.RSVP.hash({
            posts: this.get('postsService').getAll().then(posts => {
                return posts.sortBy('createdDate').map(post => {
                    let typeId = post.get('type');
                    let type = typesService.getOne(typeId);
                    post.set('typeData', type);
                    return post;
                });
            })
        });
    }
});
