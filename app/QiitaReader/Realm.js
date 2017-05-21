'use strict';

import Realm from 'realm';

class History extends Realm.Object {}
  History.schema = {
    name: 'History',
    primaryKey: 'url',
    properties: {
	url: 'string',
        title: 'string',
        userId: 'string',
	profileImageUrl: 'string',
	accessTime: 'date'
    }
};

export default new Realm({
  schema: [ History ], 
  schemaVersion: 2,
});
