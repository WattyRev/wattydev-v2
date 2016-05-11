import DataService from 'wattydev-admin/services/data';
import TypeModel from 'wattydev-admin/models/type';

export default DataService.extend({
    modelName: 'type',

    dataModel: TypeModel
});
