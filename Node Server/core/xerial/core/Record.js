class Record {

	constructor() {
		this.isInserted = false;
		this.isRecord = true;
	}

	getPrimaryKey() {
		return this[this.meta.primaryKeyColumn];
	}

	getParentID() {
		if(this.meta.parentColumn != undefined){
			return this[this.meta.parentColumn];
		}
	}
	
	setParentID() {
		if(this.meta.parentColumn != undefined){
			this[this.meta.parentColumn] = parentID;
		}
	}

	getDefault() {
		for(var i in this.meta.columnMeta){
			var column = this.meta.columnMeta[i];
			this[column['name']] = column['default'];
		}
	}

	getMetaData() {
		var meta = this.getDefaultMetaData();
		for (var i in this) {
			if (i !== "tableName" && typeof this[i] !== "function" && i !== "isInserted" && i !== "isRecord") {
				var item = this[i];
				item.name = i;
				meta.column.push(item);
				if (item.isIndex == 1) meta.indexedColumn.push(i);
				if (item.isForeignKey == 1) {
					var parentColumn = {};
					var parentData = item.foreignKey.split(".");
					parentColumn.column = i;
					parentColumn.hasNode = false;
					parentColumn.parentColumn = parentData[1];
					parentColumn.parentTable = parentData[0];
					meta.parent.push(parentColumn);
				}
			}
		}
		return meta;
	}

	getDefaultMetaData() {
		var meta = {};
		meta.column = [];
		meta.indexedColumn = [];
		meta.isNodeTable = false;
		meta.isRecordDrop = false;
		meta.parent = [];
		meta.parentColumn = "";
		meta.primaryKeyColumn = "id";
		meta.relation = [];
		meta.tableName = this.tableName;
		meta.updateColumn = [];
		return meta;
	}
}

module.exports = Record;

