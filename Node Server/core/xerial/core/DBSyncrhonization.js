var DBSyncrhonization = function(session, rootURI){
	var object = this;
	
	this.session = session;
	this.rootURI = rootURI;
	
	this.mapper = {
		'DBSynchronizationLog' : DBSynchronizationLog,
		'DBSynchronizationLogItem' : DBSynchronizationLogItem,
		'RecordDrop' : RecordDrop,
	}
	
	this.initModel = function(modelMetaData){
		var url = this.rootURI+'dbsync/meta/model';
		$.ajax({
			'type' : 'GET',
			'crossDomain' : true,
            'contentType' : "application/json; charset=utf-8",
			'url' : url,
			'success' : object.mapModel,
			'error' : function(){
				console.log('Error by loading : '+url);
			}
		});
	}
	
	this.mapModel = function(response){
		var meta = JSON.parse(response);
		for(var i in this.mapper){
			this.session.appendModel(this.mapper[i], meta.model[i]);
		}
	}
	
	this.syncronizeUp = function(){
		
	}
	
	this.syncronizeDown = function(){
		
	}
}
