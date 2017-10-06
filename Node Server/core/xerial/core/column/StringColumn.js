var ColumnMetaData = require('./ColumnMetaData.js');

class StringColumn extends ColumnMetaData {

	constructor(tableMeta, columnMeta) {
		super(tableMeta, columnMeta);
		this.tableMeta = tableMeta;
	}

	getCreateColumn() {
		if (this.tableMeta.session.type == global.XerialDBType.Cassandra) {
			return this.name+" VARCHAR(255) "+this.getCreateOption();
		} else if (this.tableMeta.session.type == global.XerialDBType.SQLite) {
			return this.name+" VARCHAR(255) "+this.getCreateOption();
		}
	}

	getValueString(value) {
		if( typeof(value) == 'object' && 'isRecord' in value && value.isRecord) {
			return value.getPrimaryKey();
		} else {
			return "'"+value+"'";
		}
	}
}

module.exports = StringColumn;
