console.log("test_submit was run!");
// Require axios library to make API requests
const axios = require('axios');
const url = require('url');
// const hubspot = require('@hubspot/api-client');

let APIKEY = process.env.dev_api_key;

// const hubspotClient = new hubspot.Client({ apiKey: APIKEY });
// console.log("hubspot: "+ Object.keys(hubspot));

const hubdb_endpoints = {
	base(endpoint, params, key, draft=false){
		if(params){
			params = new url.URLSearchParams(params);
		}
    let ret = `https://api.hubapi.com/cms/v3/hubdb/${endpoint}${draft?'/draft':''}?${params?params+'&':''}hapikey=${key}`;
		console.log(ret.split("key=")[0] + "key=****");
		return ret;
	},
  //-- tables endpoints --//
	/* GET, POST  - get all tables or post new table (as JSON) */
	tables(params=null, draft=false, key=APIKEY){return this.base(`tables`,params,key,draft)},
	/* GET - get single table details*/
	table(table_name, params=null, draft=false, key=APIKEY){return this.base(`tables/${table_name}`,params,key,draft)},
	/* POST - publish single table*/
	table_publish(table_name, params=null, key=APIKEY){return this.base(`tables/${table_name}/draft/publish`,params,key)},
  /* GET */
  //-- rows endpoints --//
  /* GET, POST - get all rows or post new row (as JSON)*/
	table_rows(table_name, params=null, draft=false, key=APIKEY){return this.base(`tables/${table_name}/rows`,params,key,draft)},
  /* GET - get single row details*/
  table_row(table_name, params=null, draft=false, key=APIKEY){return this.base(`tables/${table_name}/rows`,params,key,draft)},
	

}

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = async (context, sendResponse) => {
  
  // your code called when the function is executed

  // context.params
  // context.body
  // context.accountId
  // context.limits

  // secrets created using the CLI are available in the environment variables.
  // process.env.secretName

  let functionResponse = "";

  if (context.method.toLowerCase() === 'post') {
    console.log("context.body:");
    console.log(context.body);
    let cb = context.body;
    functionResponse = await submit_data(cb['name'],cb['field1'],cb['field2']);
  }else if(context.method.toLowerCase() === 'get'){
    functionResponse += await getTables();
    
    // functionResponse += JSON.stringify(getTables());
    // functionResponse += JSON.stringify(getTable(table_def.tableIdOrName));
  };
  console.log(JSON.stringify(functionResponse));


  // sendResponse is a callback function you call to send your response.
  sendResponse({
    body: functionResponse,
    statusCode: 200
  });
};


const form_submissions_def = {
  "id": "5307719",
  "name": "form_submissions",
  "createdAt": "2021-11-16T05:57:50.190Z",
  "publishedAt": "2021-11-18T13:55:26.269Z",
  "updatedAt": "2021-11-18T13:55:21.347Z",
  "label": "form submissions",
  "columns": [
    {
      "name": "name",
      "label": "Name",
      "id": "1",
      "archived": false,
      "foreignIdsByName": {},
      "foreignIdsById": {},
      "type": "TEXT"
    },
    {
      "name": "field1",
      "label": "field1",
      "id": "2",
      "archived": false,
      "foreignIdsByName": {},
      "foreignIdsById": {},
      "type": "TEXT"
    },
    {
      "name": "field2",
      "label": "field2",
      "id": "3",
      "archived": false,
      "foreignIdsByName": {},
      "foreignIdsById": {},
      "type": "NUMBER"
    }
  ],
  "published": true,
  "archived": false,
  "columnCount": 3,
  "rowCount": 0,
  "createdBy": {
    "id": "24824378",
    "email": "skyemc.biz@gmail.com",
    "firstName": "Skye",
    "lastName": "Mcintyre"
  },
  "updatedBy": {
    "id": "24824378",
    "email": "skyemc.biz@gmail.com",
    "firstName": "Skye",
    "lastName": "Mcintyre"
  },
  "useForPages": false,
  "allowChildTables": false,
  "enableChildTablePages": false,
  "dynamicMetaTags": {},
  "allowPublicApiAccess": false
};

/**
 * query param options:
 * - sort
 * - after
 * - limit
 * - createdAt
 * - createdAfter
 * - createdBefore
 * - updatedAt
 * - updatedAfter
 * - updatedBefore
 * - archived
 * @returns {String} tablesJson
 */
async function getTables(){
  let retVal = "getTables: ";
  try {
    const apiResponse = await axios.get(hubdb_endpoints.tables());
    retVal += JSON.stringify(apiResponse.data);
    console.log("api query success");
  } catch (e) {
    e.message === 'HTTP request failed'
      ? retVal+=JSON.stringify(e.response, null, 2)
      : retVal+=e;
      console.log("api query failed");
  }
  return retVal;
};

const form_subs_row = ()=>{
  return {
    // the following 3 parameters need to be included if this table is used in dynamic pages.
    "path": "",
    "name": "",
    "childTableId": 0,
    "values": {
      "name":"",
      // (type: TEXT
      "field1":"",
      // (type: TEXT)
      "field2":0,
      // (type: NUMBER)
    }
  };
}

async function submit_data(name="", field1="", field2=""){
  console.log(`submit_data(name=${name}, field1=${field1}, field2=${field2})`);
  const tableIdOrName = form_submissions_def.name;
  let post_data = form_subs_row();
  post_data.values.name=name;
  post_data.values.field1=field1;
  post_data.values.field2=field2;
  post_data = post_data.values;
  console.log("posting:" +JSON.stringify(post_data));
  let retVal;

  try {
    retVal = await axios.post(hubdb_endpoints.rows(tableIdOrName), post_data);
    console.log(JSON.stringify(retVal, null, 2));
    retVal = await axios.post(hubdb_endpoints.table_publish(tableIdOrName));
    console.log(JSON.stringify(retVal, null, 2));
  } catch (e) {
    e.message === 'HTTP request failed'
    ? retVal = e.response
    : retVal = e;
    console.error(JSON.stringify(retVal, null, 2));
  }

  return JSON.stringify(retVal)
};

// async function getTable(tablename){

//   const tableIdOrName = tablename;
//   const archived = undefined;
//   const includeForeignIds = undefined;

//   try {
//     const apiResponse = await hubspotClient.cms.hubdb.tablesApi.getTableDetails(tableIdOrName, archived, includeForeignIds);
//     console.log(JSON.stringify(apiResponse.body, null, 2));
//   } catch (e) {
//     e.message === 'HTTP request failed'
//       ? console.error(JSON.stringify(e.response, null, 2))
//       : console.error(e);
//   }
// };

// will run if called as node ../test_submit.js
if(require.main = module){
  APIKEY = "eabacb38-3c6e-4946-8ab3-fbdc8df7ce42";
  mainfn();
}

async function mainfn(){
  // let data= {
  //   "values": {
  //     "text_column": "sample text value",
  //     "number_column": 76,
  //     "multiselect": [
  //       {
  //         "id": "1",
  //         "name": "Option 1",
  //         "type": "option",
  //         "order": 0
  //       },
  //       {
  //         "id": "2",
  //         "name": "Option 2",
  //         "type": "option",
  //         "order": 1
  //       }
  //     ]
  //   },
  //   "path": "test_path",
  //   "name": "test_title",
  //   "childTableId": "1902373"
  // };
  let data = form_subs_row();
  data.values.name = "hello"
  data.values.field1 = "hi";
  data.values.field2 = 1234;
  // let sub_res = await submit_data("hello", "hi", 123);
  await axios.post(hubdb_endpoints.table_rows("form_submissions", null), data=data);
  // console.log(sub_res.data);
  let req = await axios.get(hubdb_endpoints.table_rows("form_submissions",null, draft=true));
  console.log(req.data);
}