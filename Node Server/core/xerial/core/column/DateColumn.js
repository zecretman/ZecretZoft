var ColumnMetaData = require('./ColumnMetaData.js');

class DateColumn extends ColumnMetaData {

	constructor(tableMeta, columnMeta) {
		super(tableMeta, ColumnMetaData);
		this.tableMeta = tableMeta;
	}

	getCreateColumn() {
		if (this.tableMeta.session.type == global.XerialDBType.Cassandra) {
			return this.name+" DATE "+this.getCreateOption();
		} else if (this.tableMeta.session.type == global.XerialDBType.SQLite) {
			return this.name+" DATE "+this.getCreateOption();
		}
	}

	getValueString(value) {
		if (typeof(value) == 'object' && 'toISOString' in value) {
			return "'"+value.toISOString().slice(0, 10)+"'";
		} else {
			return "'1970-01-01'";
		}
	}
}

module.exports = DateColumn;
