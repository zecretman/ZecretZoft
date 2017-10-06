var TableMetaData = require('./TableMetaData.js');
var CassandraConnector = require('./CassandraConnector.js');
var SQLiteConnector = require('./SQLiteConnector.js');

class Session {
	
	constructor(path) {
		if (path != undefined) this.connector = new SQLiteConnector(path);
		else this.connector = new CassandraConnector();
		this.generator = this.connector.generator;
		this.type = this.connector.type;
		this.meta = {};
		this.metaList = [];
		this.hasTableList = false;
	}

	connect() {
		this.connector.connect();
	}

	appendModel(modelClass, modelMeta) {
		var meta = new TableMetaData(this, modelMeta).setModelClass(modelClass);
		this.meta[modelMeta.tableName] =  meta;
		this.metaList.push(meta);
	}

	create(model, attribute) {
		var record = new model();
		record.meta = model.meta;
		if(attribute == undefined) record.getDefault();
		else record = model.recordMapper.mapRecord(attribute);
		for(var i in model.meta.relation){
			var relation = model.meta.relation[i];
			record[relation.column] = [];
		}
		return record;
	}

	insert(record, avoidCommit, hasID) {
		if(avoidCommit == undefined) avoidCommit = true;
		if(hasID == undefined) hasID = false;

		var result = this.generator.insert(record, hasID);
		var sql = '';
		var parameterList = [];
		if (this.type == global.XerialDBType.Cassandra) {
			sql = result[0];
			parameterList = result[1];
			this.connector.execute(sql, parameterList);
		} else {
			sql = result;
			this.connector.execute(sql);
		}

		for (var i in record.relationList) {
			var relation = relationList[i];
			var children = record[relation.column];
			this.insertMultiple(children, true, hasID)
		}
		if (!avoidCommit){
			this.connector.commit();
			return record;
		} else {
			return record;
		}
	}

	insertMultiple(recordList, avoidCommit, hasID) {
		if(avoidCommit == undefined) avoidCommit = true;

		var resultList = []
		for (var i in recordList) {
			var record = recordList[i];
			var result = this.insert(record, true, hasID);
			resultList.push(result);
		}
		if (!avoidCommit){
			this.connector.commit();
			return resultList;
		} else {
			return resultList;
		}
	}

	update(record, avoidCommit) {
		if(avoidCommit == undefined) avoidCommit = true;
		if(!record.isInserted) return;

		var sql = this.generator.update(record);
		console.log(sql);
		this.connector.execute(sql);

		for (var i in record.relationList) {
			var relation = relationList[i];
			var children = record[relation.column];
			this.updateMultiple(children, true)
		}
		if (!avoidCommit){
			this.connector.commit();
			return record;
		} else {
			return record;
		}
	}

	updateMultiple(recordList, avoidCommit) {
		if(avoidCommit == undefined) avoidCommit = true;
		
		var resultList = []
		for (var i in recordList) {
			var record = recordList[i];
			var result = this.update(record, true);
			resultList.push(result);
		}
		if (!avoidCommit){
			this.connector.commit();
			return resultList;
		} else {
			return resultList;
		}
	}

	add(record, avoidCommit, hasID) {
		if(avoidCommit == undefined) avoidCommit = true;
		if(hasID == undefined) hasID = false;
		var oldRecord = this.select(record.meta.modelClass, 'WHERE id='+record.id, false, false)
		if (oldRecord.length > 0 && record.id != undefined) {
			record.isInserted = true;
			return this.update(record, avoidCommit);
		} else {
			return this.insert(record, avoidCommit, hasID);
		}
	}

	drop(record, avoidCommit) {
		if(avoidCommit == undefined) avoidCommit = true;
		if(!record.isInserted) return;

		var sql = this.generator.drop(record);
		this.connector.execute(sql);

		for (var i in record.relationList) {
			var relation = relationList[i];
			var children = record[relation.column];
			this.dropMultiple(children, true)
		}
		if (!avoidCommit){
			this.connector.commit();
			return record;
		} else {
			return record;
		}
	}

	dropMultiple(recordList, avoidCommit) {
		if(avoidCommit == undefined) avoidCommit = true;

		var resultList = []
		for (var i in recordList) {
			var record = recordList[i];
			var result = this.drop(record, true);
			resultList.push(result);
		}
		if (!avoidCommit){
			this.connector.commit();
			return resultList;
		} else {
			return resultList;
		}
	}

	commit() {
		this.connector.commit();
	}

	select(model, clause, isFetchRelation, isFetchParent, column) {
		if(isFetchRelation == undefined) isFetchRelation = true;
		if(isFetchParent == undefined) isFetchParent = true;
		var meta = model.meta;
		if (meta == undefined) {
			var item = new model();
			meta = item.getMetaData();
			meta = new TableMetaData(this, meta).setModelClass(model);
		}
		column = this.processColumn(meta, column);
		var sql = this.generator.select(meta, clause, column);
		var data = this.connector.fetch(sql);
		var recordList = this.mapRecord(model, data);
		if (meta.hasRelation && isFetchRelation && recordList.list.length) {
			recordList = this.fetchRelation(model, recordList)
		}
		if (meta.hasParent && isFetchParent && recordList.list.length) {
			recordList = this.fetchParent(model, recordList);
		}
		return recordList;
	}

	fetchRelation(model, recordList) {
		for (var i in model.meta.relation) {
			var relation = model.meta.relation[i];
			var table = relation.table;
			if (table in meta) {
				var meta = this.meta[table];
				var sql = this.generator.select(meta, 'WHERE '+meta.parentColumn+' IN ('+recordList.key.join(',')+')');
				var data = this.connector.fetch(sql)
				var meta = this.meta[relation.table];
				var children = this.mapRecord(meta.modelClass, data);
				for(var i in children.list){
					var child = children.list[i];
					recordList.map[child.getParentID()][relation.column].push(child);
				}
			}
		}
		return recordList;
	}

	fetchParent(model, recordList) {
		for(var i in model.meta.parent){
			var parent = model.meta.parent[i];
			if(parent.parentTable in this.meta){
				var parentID = [];
				for(var j in recordList.list){
					parentID.push(recordList.list[j][parent.column]);
				}
				var meta = this.meta[parent.parentTable];
				var sql = this.generator.select(meta, 'WHERE '+parent.parentColumn+' IN ('+parentID.join(',')+')');
				var data = this.connector.fetch(sql);
				var meta = this.meta[parent.parentTable];
				var parentList = this.mapRecord(meta.modelClass, data);
				for(var j in recordList.list){
					var pid = recordList.list[j][parent.column];
					recordList.list[j][parent.column] = parentList.map[pid];
				}
			}
		}
		return recordList;
	}

	mapRecord(model, data) {
		var recordList = [];
		recordList.list = [];
		recordList.map = {};
		recordList.key = [];
		for(var i in data){
			var record = this.create(model);
			record.isInserted = true;
			for(var j in data[i]){
				record[j] = data[i][j];
			}
			recordList.list.push(record);
			recordList.push(record);
			recordList.key.push(record.getPrimaryKey());
			recordList.map[record.getPrimaryKey()] = record;
		}
		return recordList;
	}

	checkTable() {
		if(!this.hasTableList){
			var result = this.connector.fetch(this.generator.getTableName());
			console.log(result);
			this.tableName = result;
			this.hasTableList = true;
			this.createAllTables();
		}else{
			this.createAllTables();
		}
	}

	createAllTables() {
		for (var i in this.metaList) {
			var meta = this.metaList[i];
			var tableName = this.createTable(meta)
		}
	}

	createTable(meta) {
		if(meta.tableName in this.meta){
			if(!this.hasTable(meta.tableName)){
				var sqlList = this.generator.createTable(meta);
				this.connector.executeMultiple(sqlList);
				return meta.tableName;
			}
			return meta.tableName;
		}
	}

	hasTable(tableName) {
		for(var i=0;i<this.tableName.length; i++){
			if(this.tableName[i].name == tableName) return true;
		}
		return false;
	}

	processColumn(meta, column) {
		if(column == undefined || meta.columnName.length == column.length){
			return undefined;
		} else {
			var result = [];
			for(var i in column){
				if(column[i] in meta.columnMap) result.push(column[i]);
				else result.push('0');
			}
			return result;
		}
	}
}

module.exports = Session;
