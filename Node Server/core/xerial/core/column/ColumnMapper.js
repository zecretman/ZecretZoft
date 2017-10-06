var DateColumn = require('./DateColumn.js');
var DateTimeColumn = require('./DateTimeColumn.js');
var FloatColumn = require('./FloatColumn.js');
var IntegerColumn = require('./IntegerColumn.js');
var StringColumn = require('./StringColumn.js');
var TextColumn = require('./TextColumn.js');
var BigIntegerColumn = require('./BigIntegerColumn.js');

var ColumnMapper = {
	'Date' : DateColumn,
	'DateTime' : DateTimeColumn,
	'Float' : FloatColumn,
	'Integer' : IntegerColumn,
	'String' : StringColumn,
	'Text' : TextColumn,
	'BigInteger' : BigIntegerColumn,
}

module.exports = ColumnMapper;