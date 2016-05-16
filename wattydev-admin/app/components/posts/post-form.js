import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'form',

    classNames: ['row'],

    /**
     * The post being edited.
     *
     * @property post
     * @type {Post}
     * @required
     */
    post: null,

    /**
     * Instance of the posrs service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    /**
     * A list of possible post statuses.
     *
     * @property statusOptions
     * @type {Object[]}
     */
    statusOptions: Ember.makeArray([
        {
            value: 'draft',
            label: 'Draft',
        },
        {
            value: 'published',
            label: 'Published',
        },
        {
            value: 'unlisted',
            label: 'Unlisted',
        }
    ]),

    /**
     * Validate that the required properties were provided.
     *
     * @method _validateProperties
     * @return {Void}
     * @private
     */
    _validateProperties: Ember.on('didInsertElement', function () {
        Ember.assert('A post must be passed to the post form', this.get('post'));
    }),

    /**
     * Rollback changes when the component is destroyed.
     *
     * @method _revetChanges
     * @return {Promise}
     * @private
     */
    _revertChanges: Ember.on('willDestroyElement', function () {
        if (this.get('posts.id')) {
            return this.get('postsService').rollback(this.get('post'));
        }
    }),

    /**
     * Save the record.
     *
     * @method save
     * @return {Void}
     */
    save: Ember.on('submit', function (event) {
        event.preventDefault();
        this.get('postsService').save(this.get('post')).then(id => {
            this.sendAction('saved', id);
        });
    })
});
