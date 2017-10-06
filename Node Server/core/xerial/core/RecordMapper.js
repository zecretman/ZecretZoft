class RecordMapper {

	constructor(recordClass) {
		this.recordClass = recordClass;
	}

	mapRecord(attribute) {
		var record = new this.recordClass();
		record.meta = recordClass.meta;
		for(var i in attribute){
			record[i] = attribute[i];
			if (record.meta.columnMap[i] != undefined) {
				if (record.meta.columnMap[i].type == 'Date') {
					record[i] = new Date(attribute[i] * 1000);
				}
			} else {
				record[i] = attribute[i];
			}
		}
		this.mapRelation();
		this.mapParent();
		return record;
	}

	mapRelation() {

	}

	mapParent() {

	}
}

module.exports = RecordMapper;


