var ColumnMetaData = require('./ColumnMetaData.js');

class DateTimeColumn extends ColumnMetaData {

	constructor(tableMeta, columnMeta) {
		super(tableMeta, columnMeta);
		this.tableMeta = tableMeta;
	}

	getCreateColumn() {
		if (this.tableMeta.session.type == global.XerialDBType.Cassandra) {
			return this.name+" DATETIME "+this.getCreateOption();
		} else if (this.tableMeta.session.type == global.XerialDBType.SQlite) {
			return this.name+" DATETIME "+this.getCreateOption();
		}
	}

	getValueString(value) {
		if (typeof(value) == 'object' && 'toISOString' in value) {
			return "'"+value.toISOString().slice(0, 19).replace('T', ' ')+"'";
		} else {
			return "'1970-01-01 00:00:00'";
		}
	}
}

module.exports = DateTimeColumn;
