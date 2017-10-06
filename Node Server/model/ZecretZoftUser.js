var Record = require('../core/xerial/core/Record.js');
var Column = require('../core/xerial/core/Column.js');
var TableMetaData = require('../core/xerial/core/TableMetaData.js');

class ZecretZoftUser extends Record {

    constructor() {
        super();
        this.tableName = 'ZecretZoftUser';
        this.name = new Column('String', {'default': ''});
        this.surname = new Column('String', {'default': ''});
        this.email = new Column('String', {'default': ''});
        this.loginName = new Column('String', {'default': ''});
        this.password = new Column('String', {'default': ''});
        this.isActive = new Column('Integer', {'default': 0});
        this.telephone = new Column('String', {'default': ''});
        this.avatar = new Column('String', {'default': ''});
        this.meta = this.getMetaData();
        this.meta = new TableMetaData(this, this.meta).setModelClass(ZecretZoftUser);
    }

    toSampleDict() {
        return {
            'name': this.name,
            'surname': this.surname,
            'email': this.email,
        }
    }
}

module.exports = ZecretZoftUser;
