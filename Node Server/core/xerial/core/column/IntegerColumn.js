var ColumnMetaData = require('./ColumnMetaData.js');

class IntegerColumn extends ColumnMetaData {
	
	constructor(tableMeta, columnMeta) {
		super(tableMeta, columnMeta);
		this.tableMeta = tableMeta;
	}

	getCreateColumn() {
		if (this.tableMeta.session.type == global.XerialDBType.Cassandra) {
			return this.name+" INTEGER "+this.getCreateOption();
		} else if (this.tableMeta.session.type == global.XerialDBType.SQLite) {
			return this.name+" INTEGER "+this.getCreateOption();
		}
	}

	getValueString(value) {
		if (typeof(value) == 'object' && 'isRecord' in value && value.isRecord) {
			return value.getPrimaryKey()
		} else {
			return value;
		}
	}
}

module.exports = IntegerColumn;
