var ZecretZoftUser = require('./ZecretZoftUser.js');

class Models {
    constructor() {
        this.models = {}
        this.models.ZecretZoftUser = new ZecretZoftUser();
        global.models['ZecretZoftUser'] = [ZecretZoftUser, this.models.ZecretZoftUser.getMetaData()];
    }
}

module.exports = Models;