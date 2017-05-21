'use strict';

let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();
let s3 = new AWS.S3();

let Const = require('./Const');

function getDateString(date) {
    let month = date.getMonth() + 1;
    let monthStr = (month < 10) ? "0" + month : month.toString();
    let day = date.getDate();
    let dayStr = (day < 10) ? "0" + day : day.toString();
    return date.getFullYear().toString() + monthStr + dayStr;
}

function getQueryParam(date) {
    return {
        TableName: Const.DYNAMO_TABLE_NAME,
        KeyConditionExpression : "PutDate = :T0",
        ExpressionAttributeValues : {
            ":T0" : getDateString(date)
        }
    };
}

function getItemById(infoArray, id) {
    return infoArray.find((info) => {
        return (info.Id == id) ? true : false;
    });
}

function getInfoDiff(infoPost, infoPre) {
    let result = {
        id : infoPost.Id,
        d_followers_count : infoPost.FollowersCount - infoPre.FollowersCount,
        d_items_count : infoPost.ItemsCount - infoPre.ItemsCount
    };
    if (infoPost.IconUrl !== null) {
        result.icon_url = infoPost.IconUrl;
    }
    return result;
}

function getS3Param(key, body) {
    return {
        Bucket : Const.S3_BUCKET_NAME,
        Key : key,
        Body : body
    };
}

function getInfoSortedByFollowersCount(infoArray) {
    let arr = infoArray;
    return arr.sort((a, b) => {
        if (a.d_followers_count > b.d_followers_count) {
            return -1;
        }
        return 1;
    });
}

function getInfoSortedByItemsCount(infoArray) {
    let arr = infoArray;
    return arr.sort((a, b) => {
        if (a.d_items_count > b.d_items_count) {
            return -1;
        }
        return 1;
    });
}

function uploadFileToS3(fileName, fileBody) {
    return new Promise((resolve, reject) => {
        s3.upload(getS3Param(fileName, fileBody), (err, data) => {
            if (err) {
                reject(new Error("Fail :" + err));
            }
            resolve(data);
        });
    });
}

function uploadDiffInfo(dataNow, dataLastWeek) {
    let infoArray = [];
    dataNow.Items.forEach((infoNow) => {
        let infoLastWeek = getItemById(dataLastWeek.Items, infoNow.Id);
        if (infoLastWeek === undefined) {
            console.log("not found : " + infoNow.Id);
            return;
        }
        let infoDiff = getInfoDiff(infoNow, infoLastWeek);
        infoArray.push(infoDiff);
    });
    return [
        uploadFileToS3("item_info.json", 
            JSON.stringify(getInfoSortedByItemsCount(infoArray))),
        uploadFileToS3("follower_info.json", 
            JSON.stringify(getInfoSortedByFollowersCount(infoArray)))
    ];
}

module.exports.handler = (event, context, callback) => {
    let now = new Date();
    let nowLastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    new Promise((resolve, reject) => {
	docClient.query(getQueryParam(now), (err, data) => {
            if (err) {
		context.fail(new Error("Fail. err:" + err));
		return;
            }
	    let output = {
		dataNow : data
	    };
	    resolve(output);
	});
    }).then((output) => {
	return new Promise((resolve, reject) => {
            docClient.query(getQueryParam(nowLastWeek), (err, data) => {
		if (err) {
                    context.fail(new Error("Fail. err:" + err));
		    return;
		}
		output.dataLastWeek = data;
		resolve(output);
	    });
	});
    }).then((output) => {
        return Promise.all(uploadDiffInfo(output.dataNow, output.dataLastWeek));
    }).then((results) => {
        context.done(null, null);
    }).catch((reject) => {
        context.fail(new Error("Fail :" + reject));
    });
};
