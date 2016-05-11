import DataService from 'wattydev-admin/services/data';
import PostModel from 'wattydev-admin/models/post';

export default DataService.extend({
    modelName: 'post',

    dataModel: PostModel
});
