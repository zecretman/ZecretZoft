var cassandra = require('cassandra-driver');
var CassandraGenerator = require('./CassandraGenerator.js');

class CassandraConnector {

	constructor() {
		this.type = global.XerialDBType.Cassandra
		this.generator = new CassandraGenerator();
		this.client = new cassandra.Client({contactPoints: ['localhost']});
	}

	async connect() {
		console.log('Before connect');
		var err = await this.client.connect();
		console.log('After connect');
		console.log(err);
		// this.client.on('log', function(level, className, message, furtherInfo) {
		// 	console.log('log event: %s -- %s', level, message);
		// });
	}

	async execute(sql, parameterList) {
		console.log(sql);
		console.log(parameterList);
		await this.client.execute(sql, parameterList);
	}

	async executeMultiple(sqlList) {
		for (var index in sqlList) {
			var sql = sqlList[index];
			await this.client.execute(sql);
		}
	}

	async fetch(sql, parameterList) {
		// this.client.execute(sql, parameterList, function(err, result) {
		// 	console.log(err);
		// 	console.log(result);
		// });
		return await this.client.execute(sql, parameterList);
	}

	async commit() {
		await this.client.execute('COMMIT');
	}
}

module.exports = CassandraConnector;
