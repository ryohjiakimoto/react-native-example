#!/bin/bash

set -e

ORG_DIR=`pwd`
cd ${0%/*}/..

source deploy/configure

function parseArgs() {
    while [ ! -z $1 ]
    do
	if [ $1 == "-b" ]
	then
	    shift
	    BUCKET_NAME=$1
	elif [ $1 == "-t" ]
	then
	    shift
	    DYNAMO_TABLE_NAME=$1
	elif [ $1 == "-r" ]
	then
	    shift
	    REGION=$1
	else
	    echo "USAGE"
	    echo "./deploy.sh"
	    echo "   -b [S3 bucket name]"
	    echo "   -t [DynamoDB table name]"
	    echo "   -r [AWS region]"
	    exit 1
	fi
	shift
    done
}

function getDynamoTable() {
    local tableName=$1
    local region=$2
    aws dynamodb list-tables \
	--region ${region} \
	--query 'length(TableNames[?@==`'${tableName}'`])'
}

function createDynamoTable() {
    local tableName=$1
    local region=$2
    aws dynamodb create-table \
	--region ${region} \
	--table-name ${tablaName} \
	--attribute-definitions \
	AttributeName="Id",AttributeType="S" AttributeName="PutDate",AttributeType="S" \
	--key-schema \
	AttributeName="PutDate",KeyType="HASH" AttributeName="Id",KeyType="RANGE" \
	--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 > /dev/null
}

function getS3Bucket() {
    local bucketName=$1
    local region=$2
    aws s3api list-buckets \
	--region ${region} \
	--query 'length(Buckets[?Name==`'${bucketName}'`])'
}

function createS3Bucket() {
    local bucketName=$1
    local region=$2
    aws s3api create-bucket \
	--region ${region} \
	--bucket ${bucketName} \
	--create-bucket-configuration LocationConstraint=${region} > /dev/null
    sed -e "s/<BUCKET_NAME>/${bucketName}/g" deploy/bucket_policy_template.json \
	> deploy/bucket_policy.json
    aws s3api put-bucket-policy \
	--region ${region} \
	--bucket ${bucketName} \
	--policy file://deploy/bucket_policy.json
    rm deploy/bucket_policy.json
}

parseArgs $*

echo "create dynamodb table : ${DYNAMO_TABLE_NAME}"
if [ `getDynamoTable ${DYNAMO_TABLE_NAME} ${REGION}` == 0 ]
then
    createDynamoTable ${DYNAMO_TABLE_NAME} ${REGION}
else
    echo "skip to create dynamodb table"
fi

echo "create s3 bucket : ${BUCKET_NAME}"
if [ `getS3Bucket ${BUCKET_NAME} ${REGION}` == 0 ]
then
    createS3Bucket ${BUCKET_NAME} ${REGION}
else
    echo "skip to create s3 bucket"
fi

sls deploy \
    --region ${REGION} \
    --tableName ${DYNAMO_TABLE_NAME} \
    --bucketName ${BUCKET_NAME}

cd ${ORG_DIR}

echo "SUCCESS END"
