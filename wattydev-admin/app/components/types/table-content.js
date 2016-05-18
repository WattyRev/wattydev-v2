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
     * The list of types.
     *
     * @property types
     * @type {Type[]}
     */
    types: null,

    /**
     * The displayed types.
     *
     * @property displayedTypes
     * @type {Type[]}
     */
    displayedTypes: Ember.computed('types.@each', function () {
        let types = this.get('types');
        let posts = this.get('postsService.data');

        // Do basic mapping
        let parsed = types.map(type => {
            type = Ember.$.extend(Ember.Object.create(), type);
            type.set('numPosts', posts.filterBy('type', type.get('id')).length);

            if (type.get('parent') !== '0') {
                type.set('parentTitle', types.findBy('id', type.get('parent')).get('title'));
            }
            return type;
        });
        let working = parsed.slice();

        // Get accumulated post count from children
        return working.map(type => {
            let numChildPosts = this._getNumChildPosts(type, parsed);
            let numPosts = type.get('numPosts') + numChildPosts;
            type.set('numPosts', numPosts);
            return type;
        });
    }),

    /**
     * Get the number of posts that fall under the specified type's child tyes.
     *
     * @method _getNumChildPosts
     * @param {Type} type The type to get the children posts from
     * @param {Type[]} types The list of types to reference
     * @param {String[]} retrieved A list of type ids that have already been retrieved
     * @return {Number}
     */
    _getNumChildPosts(type, types, retrieved = []) {
        if (!type.get('children').length) {
            return 0;
        }
        let total = 0;

        // Prevent counting the subject
        if (!retrieved.length) {
            retrieved.push(type.get('id'));
        }

        // Get post count for type's children
        type.get('children').forEach(childId => {
            childId = '' + childId;
            // Prevent counting a type more than once or going into a stack overflow
            if (retrieved.indexOf(childId) > -1) {
                return;
            }
            retrieved.push(childId);

            let child = types.findBy('id', childId);

            // Get the number of posts
            if (child.get('numPosts')) {
                total += child.get('numPosts');
            }

            // If it has children, add them to the haveChildren array to loop through later
            if (child.get('children').length) {
                total += this._getNumChildPosts(child, types, retrieved);
            }
        });

        return total;
    },

    actions: {
        /**
         * When the user is done editing a type, relay the message to the route.
         *
         * @method doneEditing
         * @return {Void}
         */
        doneEditing() {
            this.sendAction('doneEditing');
        }
    }
});
