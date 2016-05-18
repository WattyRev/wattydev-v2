import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * Instance of the posts service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    /**
     * Instance of the permalink service.
     *
     * @property permalinkService
     * @type {Ember.Service}
     */
    permalinkService: Ember.inject.service('permalink'),

    /**
     * The list of tags.
     *
     * @property tags
     * @type {Tag[]}
     */
    tags: null,

    /**
     * The displayed tags.
     *
     * @property displayedTags
     * @type {Type[]}
     */
    displayedTags: Ember.computed('tags.@each', function () {
        let tags = this.get('tags');
        let posts = this.get('postsService.data');

        // Get the number of posts for each tag
        let parsed = Ember.makeArray(tags.map(tag => {
            tag = Ember.$.extend(Ember.Object.create(), tag);
            tag.set('numPosts', posts.filter(post => post.get('tags').indexOf(tag.get('id')) > -1).length);

            return tag;
        }));
        parsed = parsed.sort((a,b) => {
            return b.get('numPosts') - a.get('numPosts');
        });
        return parsed.slice();
    }),

    actions: {
        /**
         * When the user is done editing a type, relay the message to the route.
         *
         * @method doneEditing
         * @return {Void}
         */
        doneEditing(data) {
            this.sendAction('doneEditing', data);
        }
    }
});
