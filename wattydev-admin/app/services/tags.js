import DataService from 'wattydev-admin/services/data';
import TagModel from 'wattydev-admin/models/tag';

export default DataService.extend({
    modelName: 'tag',

    dataModel: TagModel
});
