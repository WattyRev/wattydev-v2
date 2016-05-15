import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * A list of ids for the currently selected tags.
     *
     * @property value
     * @type {String[]}
     */
    value: Ember.makeArray(),

    /**
     * Instance of the tags service.
     *
     * @property tagsService
     * @type {Ember.Service}
     */
    tagsService: Ember.inject.service('tags'),

    /**
     * Is the select currently loading something?
     *
     * @property loading
     * @type {Boolean}
     * @default false
     */
    loading: false,

    /**
     * The currently selected tags.
     *
     * @property selectedTags
     * @type {Tag[]}
     */
    selectedTags: Ember.computed({
        get() {
            let value = this.get('value');
            return value.map(id => {
                return this.get('tagsService.data').findBy('id', id);
            });
        },
        set(key, value) {
            this.set('value', value.mapBy('id'));
            return value;
        }
    }),

    /**
     * The currently available tags that the user can choose from.
     *
     * @property availableTags
     * @type {Tag[]}
     */
    availableTags: Ember.computed('tags', 'selectedTags', function () {
        return this.get('tags').reject(tag => {
            return this.get('selectedTags').contains(tag);
        });
    }),

    /**
     * The full list of tags.
     *
     * @property tags
     * @type {Tag[]}
     */
    tags: Ember.computed.alias('tagsService.data'),

    /**
     * The tag that the user is adding.
     *
     * @property addingTag
     * @type {String}
     */
    addingTag: '',

    /**
     * Add a new tag.
     *
     * @method addTag
     * @return {Void}
     */
    addTag() {
        this.set('loading', true);
        let service = this.get('tagsService');
        let tag = service.createNew();
        tag.set('title', this.get('addingTag'));
        service.save(tag).then(id => {
            Ember.run.next(() => {
                if (this.isDestroyed) {
                    return;
                }
                let value = this.get('value');
                value.push(id);
                this.set('value', value.slice());
                this.set('addingTag', '');
                this.set('loading', false);
            });
        });
    },

    actions: {
        /**
         * Remove specified tag from selection.
         *
         * @method removeTag
         * @param {Tag} tag The tag to remove
         * @return {Void}
         */
        removeTag(tag) {
            let selected = this.get('selectedTags');
            selected = selected.reject(item => item.get('id') === tag.get('id'));
            this.set('selectedTags', selected.slice());
        },

        /**
         * Select the specified tag.
         *
         * @method selectTag
         * @param {Tag} tag The tag to select
         * @return {Void}
         */
        selectTag(tag) {
            let selected = this.get('selectedTags');
            selected.push(tag);
            this.set('selectedTags', selected.slice());
        },

        /**
         * When the input changes, if the user pressed comma or enter, create a new tag.
         *
         * @method inputChange
         * @return {Void}
         */
        inputChange(value, event) {
            if (this.get('loading')) {
                event.preventDefault();
                return;
            }
            let submitKeys = Ember.makeArray([188, 13]);
            if (submitKeys.contains(event.keyCode)) {
                event.preventDefault();
                this.addTag();
            }
        }
    }
});
