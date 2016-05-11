import DataService from 'wattydev-admin/services/data';
import ImageModel from 'wattydev-admin/models/image';

export default DataService.extend({
    modelName: 'image',

    dataModel: ImageModel
});
