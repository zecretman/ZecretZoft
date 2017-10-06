var IntegerColumn = require('./IntegerColumn.js');

class FloatColumn extends IntegerColumn	{
	
	constructor(tableMeta, columnMeta) {
		super(tableMeta, columnMeta);
		this.tableMeta = tableMeta;
	}

	getCreateColumn() {
		if (this.tableMeta.session.type == global.XerialDBType.Cassandra) {
			return this.name+" REAL "+this.getCreateOption();
		} else if (this.tableMeta.session.type == global.XerialDBType.SQLite) {
			return this.name+" REAL "+this.getCreateOption();
		}
	}
}

module.exports = FloatColumn;
