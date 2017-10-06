class SQLiteGenerator {
	
	constructor() {

	}

	getTableName(){
		return "SELECT name FROM sqlite_master WHERE type='table'";
	}

	select(meta, clause, column) {
		var table = meta.tableName;
		var primaryKey = meta.primaryKeyColumn;
		var sql = "";
		if (clause == undefined) clause = '';
		if(column == undefined){
			sql = 'SELECT '+primaryKey+','+(meta.columnName.join(','))+' FROM '+table+' '+clause;
		} else {
			sql = 'SELECT '+primaryKey+','+(column.join(','))+' FROM '+table+' '+clause;
		}
		return sql;
	}

	insert(record, hasID) {
		var columnName = [];
		var value = [];
		var tableName = record.meta.tableName;
		if(hasID){
			columnName.push(record.meta.primaryKeyColumn);
			value.push(record.id);
		}

		for(var i in record.meta.column){
			var name = record.meta.columnName[i];
			var meta = record.meta.columnMap[name];
			columnName.push(name);
			if (typeof(record[name]) == 'object') {
				value.push(meta.getValueString(meta.default));
			} else {
				value.push(meta.getValueString(record[name]));
			}
		}
		return "INSERT OR IGNORE INTO "+tableName+" ("+(columnName.join(","))+") VALUES ("+(value.join(","))+")";
	}

	update(record) {
		var value = [];
		var tableName = record.meta.tableName;
		var primaryKey = record.meta.primaryKeyColumn;
		for(var i in record.meta.columnName){
			var name = record.meta.columnName[i];
			var meta = record.meta.columnMap[name];
			value.push(name+'='+meta.getValueString(record[name]));
		}
		return "UPDATE "+tableName+" SET "+(value.join(","))+" WHERE "+primaryKey+'='+record.getPrimaryKey();
	}

	drop(record) {
		var tableName = record.meta.tableName;
		var primaryKey = record.meta.primaryKeyColumn;
		return "DELETE FROM "+tableName+" WHERE "+primaryKey+"="+record.getPrimaryKey();
	}

	createTable(meta) {
		var sql = [];
		var tableName = meta.tableName;
		var pk = meta.primaryKeyColumn;
        var createColumn = [];
		for(var i in meta.columnMeta){
            createColumn.push(meta.columnMeta[i].getCreateColumn());
		}
		var columnString = createColumn.join(",");
		if(meta.nodeKeyColumn != undefined && meta.nodeKeyColumn.length){
			var nodeString = meta.nodeKeyColumn.join(",");
			sql.push("CREATE TABLE "+tableName+" ("+pk+" INTEGER, "+columnString+", PRIMARY KEY("+pk+" ASC, "+nodeString+"));");
		}else{
			sql.push("CREATE TABLE "+tableName+" ("+pk+" INTEGER, "+columnString+", PRIMARY KEY("+pk+" ASC));");
		}
		sql.push("CREATE INDEX "+tableName+"_"+pk+" ON "+tableName+" ("+pk+");");
		for(var i in meta.indexedColumn){
			var column = meta.indexedColumn[i];
			sql.push("CREATE INDEX "+tableName+"_"+column+" ON "+tableName+" ("+column+");");
        }
        console.log(sql);
		return sql;
	}
}

module.exports = SQLiteGenerator;