# Introduction

This is an application of Qiita reader for an example of React Native application.
The feature of the application is
* you can check featured tags ordered by the number of submission at the last week.
* you can check reacently submitted articles for each tag.
* you can check your history of articles which you read, and read them again.

The application uses following technologies.
* React Native : https://facebook.github.io/react-native/
* Realm : https://realm.io/
* Serverless Framework : https://github.com/serverless/serverless

# How to use

## Crawler of Qiita tag information

### Setup

install followings
- npm
- serverless framework
- AWS CLI

#### npm

Check if npm has already been installed.
```bash
$ npm version
```
Version information will be shown.

If not, install node.js.
```bash
$ brew install node
```

#### serverless framework

Check if serverless framework has already been installed.
```bash
$ sls --version
```
Version number will be shown.

If not, install serverless framework.
```bash
$ npm install serverless
```

Then, you need to configure AWS credentials.
```bash
$ sls config credentials --provider aws --key 1234 --secret 5678
```

#### AWS CLI

At the deploy script, AWS CLI is used to create a table of DynamoDB
and an S3 bucket.

Please check the following page to install it.
http://docs.aws.amazon.com/cli/latest/userguide/installing.html

After the installation, please configure awc cli as follows.
```
$ aws configure
(then answer questions.)
```

### Deploy

Edit crawler/deploy/configure.
* DYNAMO_TABLE_NAME : DynamoDB table name.
* BUCKET_NAME : S3 bucket name.
* REGION : AWS region.

Then, run crawler/deploy/deploy.sh

## React Native App

### React Native

See
https://facebook.github.io/react-native/docs/getting-started.html

### Setup Application

Edit app/QiitaReader/Const.js and modify BUCKET_URL with your S3 bucket name.

### Run Application

```
$ cd QiitaReader
$ npm install
$ react-native run-ios
```

# License

The MIT License (MIT)

Copyright (c) 2017 ryohjiakimoto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
