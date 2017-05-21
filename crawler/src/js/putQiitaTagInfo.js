'use strict';

let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();
let https = require('https');

let Const = require('./Const');

const PAGE_LIMIT = 10;

function getHttpsRequest(url) {
    return new Promise((resolve, reject) => {
        let req = https.get(url, (res) => {
            let body = "";
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', (res) => {
                resolve(body);
            });
        });
        req.on("error", (e) => {
            reject(e);
        });
    });
}

function getToday() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let monthStr = (month < 10) ? "0" + month : month.toString();
    let day = date.getDate();
    let dayStr = (day < 10) ? "0" + day : day.toString();
    return date.getFullYear().toString() + monthStr + dayStr;
}

module.exports.handler = (event, context, callback) => {
    let promises = [];
    for (var i = 1; i <= PAGE_LIMIT; i++) {
        console.log(i);
        promises.push(getHttpsRequest("https://qiita.com/api/v2/tags?page=" + i + "&per_page=100&sort=count"));
    }
    let today = getToday();
    let putParam = {
	TableName : Const.DYNAMO_TABLE_NAME
    };
    Promise.all(promises).then((resolves) => {
        resolves.forEach((results) => {
            JSON.parse(results).forEach((result) => {
                putParam.Item = {
		    PutDate : today,
		    Id : result.id,
                    FollowersCount : result.followers_count,
                    IconUrl : result.icon_url,
                    ItemsCount : result.items_count
		};
                docClient.put(putParam, (err, data) => {
                    if (err) {
                        context.fail(new Error("Fail :" + err));
                    }
                    context.done(null, null);
                });
            });
        });
    }).catch((rejects) => {
        context.fail(new Error("Fail :" + rejects));
    });
};
