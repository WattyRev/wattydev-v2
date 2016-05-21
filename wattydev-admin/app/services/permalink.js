import Ember from 'ember';

export default Ember.Service.extend({
    /**
     * The base url for the public website.
     *
     * @property publicRoot
     * @type {String}
     */
    publicRoot: 'http://wattydev.com/',

    /**
     * The path for the admin site.
     *
     * @property adminPath
     * @type {String}
     */
    adminPath: 'admin/',

    /**
     * The path for the images directory.
     *
     * @property imagesPath
     * @type {String}
     */
    imagesPath: 'site/images/',

    /**
     * The path for the tags directory.
     *
     * @property tagsPath
     * @type {String}
     */
    tagsPath: 'tags/',

    /**
     * The path for the types directory.
     *
     * @property typesPath
     * @type {String}
     */
    typesPath: 'types/',

    /**
     * The path for the api directory.
     *
     * @property apiPath
     * @type {String}
     */
    apiPath: 'site/api/',

    /**
     * The url for the images directory.
     *
     * @property baseImageUrl
     * @type {String}
     * @readOnly
     */
    baseImageUrl: Ember.computed('publicRoot', 'imagesPath', function () {
        return this.get('publicRoot') + this.get('imagesPath');
    }).readOnly(),

    /**
     * The url for the tags directory.
     *
     * @property baseTagsUrl
     * @type {String}
     * @readOnly
     */
    baseTagsUrl: Ember.computed('publicRoot', 'tagsPath', function () {
        return this.get('publicRoot') + this.get('tagsPath');
    }).readOnly(),

    /**
     * The url for the types directory.
     *
     * @property baseTypesUrl
     * @type {String}
     * @readOnly
     */
    baseTypesUrl: Ember.computed('publicRoot', 'typesPath', function () {
        return this.get('publicRoot') + this.get('typesPath');
    })
});
