import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',

    /**
     * The text to display for the button.
     *
     * @property buttonLabel
     * @type {String}
     * @default 'Select File'
     */
    buttonLabel: 'Select File',

    /**
     * The text to use for the file name placeholder.
     *
     * @property placeholder
     * @type {String}
     */
    placeholder: null,

    /**
     * How to encode the uploaded file.
     * Accepts 'none', 'base64', 'dataURI'
     *
     * @property encode
     * @type {String}
     * @default 'base64'
     */
    encode: 'base64',

    /**
     * The processed selected file.
     *
     * @property value
     * @type {Object}
     */
    value: null,

    /**
     * The file that was selected.
     *
     * @property file
     * @type {Object}
     */
    file: null,

    /**
     * The name of the file that is currently selected.
     *
     * @property fileName
     * @type {String}
     */
    fileName: Ember.computed('file', 'file.name', function () {
        return this.get('file') ? this.get('file').name : '';
    }),

    /**
     * When the input fires the change event, set the file.
     *
     * @method change
     * @param {Object} e The change event
     * @return {Void}
     */
    change: function (e) {
        let files = e.target.files;
        let file = files.length ? files[0] : null;
        this.set('file', file);
    },

    /**
     * When the file changes, process the file.
     *
     * @method fileDidChange
     * @return {Void}
     */
    fileDidChange: Ember.observer('file', 'file.lastModified', function () {
        let file = this.get('file');
        let encode = this.get('encode');
        let self = this;

        // Do nothing if there is no file
        if (!file) {
            this.set('value', null);
            return;
        }

        // Handle when the file loads
        let reader = new FileReader();
        reader.onload = function (e) {
            let contents = e.target.result;

            // Replace data uri prefix if base64
            if (typeof(contents) === 'string' && encode === 'base64') {
                contents = contents.replace(/^.*base64,/i, "");
            }

            // Set the value
            Ember.run(function () {
                self.set('value', contents);
            });
        };

        // Load the file with the given encoding
        switch (encode) {
            case 'base64':
                reader.readAsDataURL(file);
                break;
            case 'dataURI':
                reader.readAsDataURL(file);
                break;
            default:
                this.set('value', file);
        }
    })
});
