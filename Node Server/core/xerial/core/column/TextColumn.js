var StringColumn = require('./StringColumn.js');

class TextColumn extends StringColumn {
	
	constructor(tableMeta, columnMeta) {
		super(tableMeta, columnMeta);
		this.tableMeta = tableMeta;
	}

	getCreateColumn() {
		if (this.tableMeta.session.type == global.XerialDBType.Cassandra) {
			return this.name+" TEXT "+this.getCreateOption();
		} else if (this.tableMeta.session.type == global.XerialDBType.SQLite) {
			return this.name+" TEXT "+this.getCreateOption();
		}
	}
}

module.exports = TextColumn;