var RecordMapper = require('./RecordMapper.js');
var ColumnMapper = require('./column/ColumnMapper.js');

class TableMetaData {

	constructor(session, modelMeta) {
		this.session = session;
		this.columnMeta = [];
		this.columnName = [];
		this.columnMap = {};
		this.mapModel(modelMeta);
	}

	mapModel(modelMeta) {
		for(var i in modelMeta){
			this[i] = modelMeta[i];
		}
		for(var i in modelMeta.column){
			var column = modelMeta.column[i];
			if(column.type in ColumnMapper){
				var meta = new ColumnMapper[column.type](this, column);
				this.columnMeta.push(meta)
				this.columnName.push(meta.name);
				this.columnMap[meta.name] = meta;
			}
		}
		this.hasRelation = (this.relation.length > 0);
		this.hasParent = (this.parent.length > 0);
	}

	setModelClass(modelClass) {
		this.modelClass = modelClass;
		this.modelClass.tableName = this.tableName;
		modelClass.meta = this;
		this.recordMapper = new RecordMapper(modelClass);
		this.recordMapper.meta = this;
		this.modelClass.recordMapper = this.recordMapper;
		return this;
	}
}

module.exports = TableMetaData;
