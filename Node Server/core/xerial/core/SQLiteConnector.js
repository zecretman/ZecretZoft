var sqlite3 = require('sqlite-sync');
var SQLiteGenerator = require('./SQLiteGenerator.js');

class SQLiteConnector {

    constructor(path) {
        this.path = path;
        this.type = global.XerialDBType.SQLite;
        this.generator = new SQLiteGenerator();
        this.isTransaction = false;
    }

    connect(){
		sqlite3.connect(this.path);
		return this;
	}
	
	execute(sql){
		sqlite3.run(sql)
	}
	
	executeMultiple(sqlList){
		for (var i in sqlList){
			var sql = sqlList[i];
			sqlite3.run(sql)
		}
	}
	
	fetch(sql){
		var result = sqlite3.run(sql);
		return result;
	}
	
	commit(){
		sqlite3.run("COMMIT");
	}
}

module.exports = SQLiteConnector;
