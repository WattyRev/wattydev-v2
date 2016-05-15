import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'form',

    classNames: ['row'],

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
     * Save the record.
     *
     * @method save
     * @return {Void}
     */
    save: Ember.on('submit', function () {

    }),

    /**
     * Cancel editing and discard changes.
     *
     * @method cancel
     * @return {Void}
     */
    cancel() {

    }
});
