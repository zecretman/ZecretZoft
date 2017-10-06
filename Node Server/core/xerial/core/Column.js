
var ColumnIsNumberMapper = {
	'Date' : 0,
	'DateTime' : 0,
	'Float' : 1,
	'Integer' : 1,
	'String' : 0,
	'Text' : 0,
	'BigInteger' : 1,
}

class Column {
	
	constructor(type, dict) {
		this.default = ""
		this.isIndex = 0
		this.isNotNull = 0
		this.isUnique = 0
		this.foreignKey = ''
		this.foreignNodeKey = ''
		this.isPrimaryKey = 0
		this.isUpdateColumn = 0
		this.type = type
		this.isNumber = ColumnIsNumberMapper[type]
		this.hasDefualt = 0
		this.isForeignKey = 0
		this.isForeignNodeKey = 0

		for (var i in dict) {
			this[i] = dict[i]
		}

		if (this.default !== "") this.hasDefualt = 1
		if (this.foreignKey !== "") this.isForeignKey = 1
		if (this.foreignNodeKey !== "") this.isForeignNodeKey = 1
	}
}

module.exports = Column;