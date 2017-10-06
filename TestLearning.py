# -*- coding: utf-8 -*-

import sys, os
from datetime import datetime
from sklearn.svm import SVC
from sklearn import preprocessing
from sklearn.cluster import KMeans
from sklearn.externals import joblib
import numpy as np
import time

class VesselIdentification :

	def __init__(self) :
		self.kmeanCentroid = []
		self.indexToolType = {}
		self.clf = SVC(gamma=1)
		self.toolTypeName = {}
		self.n_clusters = 32

	def preProcessData(self, data):
		for i in data: print 'toolType:', i
		toolTypeList, toolTypeDict = [], {}
		dataDict, dataLengthDict = {}, {}
		vesselDict, speedDict, courseDict, timeDict, latDict, longDict = {}, {}, {}, {}, {}, {}
		speedDictNormalized, timeDictNormalized, vesselDictNormalized = {}, {}, {}
		vesselKmean, vesselKmeanPredict, vesselKmeanBond, vesselCombineData, vesselRecordCount = {}, {}, {}, {}, {}
		combinedResult, dataTypeList = np.array([]), np.array([])
		for toolType in data:
			vesselDict[toolType], speedDict[toolType], courseDict[toolType] = [], [], []
			timeDict[toolType], latDict[toolType], longDict[toolType] = [], [], []
			speedDictNormalized[toolType], timeDictNormalized[toolType], vesselDictNormalized[toolType] = [], [], []
			vesselKmean[toolType], vesselKmeanPredict[toolType] = [], []
			for i in data[toolType]:
				if not dataDict.has_key(toolType): dataDict[toolType] = []
				if not dataLengthDict.has_key(toolType): dataLengthDict[toolType] = []
				dataDict[toolType].extend(data[toolType][i])
				dataLengthDict[toolType].append(len(data[toolType][i]))
				toolTypeList.append(toolType)

		for index, toolType in enumerate(data): 
			vesselDict[toolType] = np.array(dataDict[toolType])
			speedDict[toolType] = np.delete(vesselDict[toolType], [1,2,3,4], axis=1)
			courseDict[toolType] = np.delete(vesselDict[toolType], [0,2,3,4], axis=1)
			latDict[toolType] = np.delete(vesselDict[toolType], [0,1,3,4], axis=1)
			longDict[toolType] = np.delete(vesselDict[toolType], [0,1,2,4], axis=1)
			timeDict[toolType] = np.delete(vesselDict[toolType], [0,1,2,3], axis=1)
			speedDictNormalized[toolType] = preprocessing.normalize(speedDict[toolType], norm='l1', axis=0)
			timeDictNormalized[toolType] = preprocessing.normalize(timeDict[toolType], norm='l1', axis=0)
			vesselDictNormalized[toolType] = np.column_stack((speedDictNormalized[toolType], courseDict[toolType]))
			vesselDictNormalized[toolType] = np.column_stack((vesselDictNormalized[toolType], timeDictNormalized[toolType]))
			vesselKmean[toolType] = KMeans(n_clusters=self.n_clusters, random_state=500).fit(vesselDictNormalized[toolType])
			self.kmeanCentroid.append(vesselKmean[toolType])
			self.toolTypeName[index] = toolType

		prepareData = {'vesselDictNormalized': vesselDictNormalized, 'latDict': latDict, 'longDict': longDict, 'dataLengthDict': dataLengthDict, 'vesselKmean': vesselKmean}
		prepareData['rawResult'] = self.convertDataToPrepare(data, prepareData)
		return self.prepareLearningData(data, prepareData)

	def learn(self, learningData):
		dataTypeList = np.array([])
		toolTypeDict = {}
		for index, toolType in enumerate(learningData):
			if index == 0 : combinedResult = learningData[toolType]
			else : combinedResult = np.concatenate([combinedResult, learningData[toolType]])
			toolTypeDict[index] = {'length': len(learningData[toolType]), 'name': toolType}
			dataTypeList = np.concatenate([dataTypeList, [index] * len(learningData[toolType])])

		self.clf = SVC(gamma=1)
		self.clf.fit(combinedResult, dataTypeList)
		return combinedResult, toolTypeDict, dataTypeList


	def predict(self, predictData, toolTypeDict, dataTypeList):
		predict = self.clf.predict(predictData)
		predict = predict.astype(int)
		dataTypeListCopy = list(dataTypeList)[:]
		predictCopy = list(predict)[:]
		testList = {}
		predictTestList = {}
		for i in toolTypeDict:
			testList[i] = dataTypeListCopy[:toolTypeDict[i]['length']]
			del dataTypeListCopy[:toolTypeDict[i]['length']]
			predictTestList[i] = predictCopy[:toolTypeDict[i]['length']]
			del predictCopy[:toolTypeDict[i]['length']]

		for i in toolTypeDict:
			testList[i] = np.array(testList[i]).astype(int)
			predictTestList[i] = np.array(predictTestList[i]).astype(int)
			likeNumber = np.sum(testList[i] == predictTestList[i])
			print 'type:', toolTypeDict[i]['name'], 'like:', likeNumber, 'percent:', likeNumber/float(len(predictTestList[i]))

		dataTypeList = dataTypeList.astype(int)
		likeNumber = np.sum(dataTypeList == predict)
		print 'like:', likeNumber, 'percent:', likeNumber/float(len(predict))

	def prepareLearningData(self, data, prepareData):
		rawResult = prepareData['rawResult']
		dataLengthDict = prepareData['dataLengthDict']
		result = {i: [] for i in data}
		for toolType in rawResult :
			for index in rawResult[toolType]:
				rawData = rawResult[toolType][index]
				dataLength = dataLengthDict[toolType][index]
				kmeanLength = len(data.keys()) * self.n_clusters
				vesselData = [0.0] * (5 + (len(data.keys()) * self.n_clusters))
				for kmeanIndex in rawResult[toolType][index]['kmeanGroup']: vesselData[int(kmeanIndex)] = float(rawResult[toolType][index]['kmeanGroup'][int(kmeanIndex)] / float(dataLength))
				mean_long = np.mean(rawResult[toolType][index]['long'])
				mean_lat = np.mean(rawResult[toolType][index]['lat'])
				std_long = np.std(rawResult[toolType][index]['long'])
				std_lat = np.std(rawResult[toolType][index]['lat'])
				vesselData[kmeanLength] = mean_long
				vesselData[kmeanLength + 1] = mean_lat
				vesselData[kmeanLength + 2] = std_long
				vesselData[kmeanLength + 3] = std_lat
				result[toolType].append(vesselData)
		return result

	def convertDataToPrepare(self, data, prepareData):
		rawResult, vesselCombineData, vesselKmeanBond, vesselRecordCount = {}, {}, {}, {}
		for i in data:
			rawResult[i] = {}
			vesselCombineData[i] = {}
			vesselKmeanBond[i] = {}
			vesselRecordCount[i] = np.array([])
		vesselDictNormalized = prepareData['vesselDictNormalized']
		latDict = prepareData['latDict']
		longDict = prepareData['longDict']
		dataLengthDict = prepareData['dataLengthDict']
		vesselKmean = prepareData['vesselKmean']
		for toolType in data:
			vesselCombineData[toolType] = np.column_stack((vesselDictNormalized[toolType], latDict[toolType]))
			vesselCombineData[toolType] = np.column_stack((vesselCombineData[toolType], longDict[toolType]))
			for subToolType in data:
				vesselKmeanBond[toolType][subToolType] = vesselKmean[subToolType].predict(vesselDictNormalized[toolType])
				vesselCombineData[toolType] = np.column_stack((vesselCombineData[toolType] , vesselKmeanBond[toolType][subToolType]))
		
		for toolType in dataLengthDict:
			for index, count in enumerate(dataLengthDict[toolType]):
				vesselRecordCount[toolType] = np.concatenate([vesselRecordCount[toolType],([index] * count)])

		for toolType in data: vesselCombineData[toolType] = np.column_stack((vesselRecordCount[toolType], vesselCombineData[toolType]))

		for toolType in vesselCombineData:
			for rawData in vesselCombineData[toolType]:
				dataIndex = int(rawData[0])
				if not rawResult[toolType].has_key(dataIndex): rawResult[toolType][dataIndex] = {}
				if not rawResult[toolType][dataIndex].has_key('lat'): rawResult[toolType][dataIndex]['lat'] = []
				if not rawResult[toolType][dataIndex].has_key('long'): rawResult[toolType][dataIndex]['long'] = []
				if not rawResult[toolType][dataIndex].has_key('kmeanGroup'): rawResult[toolType][dataIndex]['kmeanGroup'] = {}
				rawResult[toolType][dataIndex]['lat'].append(rawData[4])
				rawResult[toolType][dataIndex]['long'].append(rawData[5])
				kmeanGroup = list(rawData)[6:]
				for index, i in enumerate(kmeanGroup):
					kmeanIndex = int(i + (index * self.n_clusters))
					if not rawResult[toolType][dataIndex]['kmeanGroup'].has_key(kmeanIndex): rawResult[toolType][dataIndex]['kmeanGroup'][kmeanIndex] = 0
					rawResult[toolType][dataIndex]['kmeanGroup'][kmeanIndex] += 1.0
		return rawResult

	def process(self, startTime=0, endTime=0):
		import cPickle as pickle
		import os.path
		
		path = './VMSForLearning.ml'
		if os.path.exists(path):
			with open('./VMSForLearning.ml','rb') as fp:
				data = pickle.load(fp)
		else:
			data = self.getVMSData(startTime, endTime)
			with open('./VMSForLearning.ml','wb') as fp:
				pickle.dump(data,fp)

		learningData = self.preProcessData(data)
		combinedResult, toolTypeDict, dataTypeList = self.learn(learningData)
		predict = self.clf.predict(combinedResult)
		self.predict(combinedResult, toolTypeDict, dataTypeList)

		joblib.dump(self.kmeanCentroid, './kmeanCentroid.pkl')
		joblib.dump(self.clf, './SVC.pkl')




if __name__ == '__main__':
	identification = VesselIdentification()
	identification.process()
