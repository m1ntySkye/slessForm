console.log("test_submit was run!");
// Require axios library to make API requests
const axios = require('axios');
const hubspot = require('@hubspot/api-client')
const hubspotClient = new hubspot.Client({ developerApiKey: process.env.hubdb_token })
// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = (context, sendResponse) => {
  console.log(hubspot);
  
  // your code called when the function is executed

  // context.params
  // context.body
  // context.accountId
  // context.limits

  // secrets created using the CLI are available in the environment variables.
  // process.env.secretName 

  let functionResponse;
  if (context.method.toLowerCase() === 'post') {
    functionResponse = JSON.stringify(context.body)
    console.log("context.body:");
    console.log(context.body);
    
  }else{
    functionResponse += JSON.stringify(getTables());
    functionResponse += JSON.stringify(getTable(table_def.tableIdOrName));
  }
  console.log("context.params:");
  console.log(context.params);


  // sendResponse is a callback function you call to send your response.
  sendResponse({
    body: functionResponse,
    statusCode: 200
  });
};

let table_def = {
  tableIdOrName:"form_submissions"

}

async function sendToHubDB(data, table_def){

  const values = {
    "text_column": "sample text value",
    "number_column": 76,
    "multiselect": [
      {
        "id": "1",
        "name": "Option 1",
        "type": "option",
        "order": 0
      },
      {
        "id": "2",
        "name": "Option 2",
        "type": "option",
        "order": 1
      }
    ]
  };
  const HubDbTableRowV3Request = { path: "test_path", name: "test_title", childTableId: 1902373, values };
  const tableIdOrName = "tableIdOrName";

  try {
    const apiResponse = await hubspotClient.cms.hubdb.rows.rowsApi.createTableRow(tableIdOrName, HubDbTableRowV3Request);
    console.log(JSON.stringify(apiResponse.body, null, 2));
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
}

async function getTable(tablename){

  const tableIdOrName = tablename;
  const archived = undefined;
  const includeForeignIds = undefined;

  try {
    const apiResponse = await hubspotClient.cms.hubdb.tablesApi.getTableDetails(tableIdOrName, archived, includeForeignIds);
    console.log(JSON.stringify(apiResponse.body, null, 2));
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
}


async function getTables(){
  
  const sort = undefined;
  const after = undefined;
  const limit = undefined;
  const createdAt = undefined;
  const createdAfter = undefined;
  const createdBefore = undefined;
  const updatedAt = undefined;
  const updatedAfter = undefined;
  const updatedBefore = undefined;
  const archived = undefined;
  
  try {
    const apiResponse = await hubspotClient.cms.hubdb.tablesApi.getAllTables(sort, after, limit, createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, archived);
    
    return JSON.stringify(apiResponse.body, null, 2);
  } catch (e) {
    let retVal;
    e.message === 'HTTP request failed'
      ? retVal=JSON.stringify(e.response, null, 2)
      : retVal=e;
    return retVal;
  }
}
