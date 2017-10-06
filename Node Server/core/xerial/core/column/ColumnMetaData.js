class ColumnMetaData {

	constructor(tableMetaData, columnMeta) {
		this.tableMetaData = tableMetaData;
		this.session = tableMetaData.session;
		this.type = tableMetaData.session.type;
		this.mapColumn(columnMeta);
	}

	mapColumn(columnMeta) {
		for(var i in columnMeta){
			this[i] = columnMeta[i];
		}
	}

	getCreateOption() {
		var option = '';
		if(this.hasDefault) option += ' DEFAULT %s'%this.getValueString(this.default);
		if(this.isNotNull) option += ' NOT NULL ';
		if(this.isUnique) option += ' UNIQUE ';
		return option
	}
}

module.exports = ColumnMetaData;
