'use strict';

let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

let Const = require('./Const');

function getDateString(date) {
    let month = date.getMonth() + 1;
    let monthStr = (month < 10) ? "0" + month : month.toString();
    let day = date.getDate();
    let dayStr = (day < 10) ? "0" + day : day.toString();
    return date.getFullYear().toString() + monthStr + dayStr;
}

const LAST_WEEK = new Date((new Date()).getTime() - 10 * 24 * 60 * 60 * 1000);

module.exports.handler = (event, context, callback) => {
    docClient.scan(getScanParam(LAST_WEEK), (err, data) => {
	onScan(err, data).then((result) => {
	    context.done(null, null);
	}).catch((err) => {
	    context.fail(err);
	});
    });
};

function getDelParam(putDate, id) {
    return {
        TableName : Const.DYNAMO_TABLE_NAME,
        Key : {
            PutDate : putDate,
            Id : id
        }
    };
}

function getScanParam(date) {
    return {
        TableName : Const.DYNAMO_TABLE_NAME,
        ProjectionExpression: "#date, #id",
        FilterExpression : "#date < :T0", 
        ExpressionAttributeNames: {
            "#date": "PutDate",
            "#id": "Id"
        },
        ExpressionAttributeValues: {
            ":T0" : getDateString(date)
        }
    };
}

function onScan(err, data) {
    if (err) {
        return Promise.reject(new Error("Fail :" + err));
    }
    let promises = data.Items.map((item) => {
        return new Promise((resolve, reject) => {
	    docClient.delete(getDelParam(item.PutDate, item.Id), (err, data) => {
                if (err) {
		    reject(new Error("Fail :" + err));
                }
                resolve(data);
	    });
        });
    });
    return Promise.all(promises).then((results) => {
        if (typeof data.LastEvaluatedKey != "undefined") {
	    console.log("Scanning for more...");
	    let scanParam = getScanParam(LAST_WEEK);
	    scanParam.ExclusiveStartKey = data.LastEvaluatedKey;
	    docClient.scan(scanParam, onScan);
        }
        return Promise.resolve();
    }).catch((rejects) => {
        return Promise.reject(new Error("Fail :" + rejects));
    });
}
