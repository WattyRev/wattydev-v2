import Ember from 'ember';

export default Ember.Component.extend({
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

    actions: {
        /**
         * Save the record.
         *
         * @method save
         * @return {Void}
         */
        save() {

        }
    }
});
