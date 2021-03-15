const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'ap-south-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'invoices';
const invoicePath= '/invoices';


exports.handler = async function(event) {
  console.log('Request event: ', event);
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === invoicePath:
        
        if(event.queryStringParameters !=null){
            response = await getInvoice(event.queryStringParameters.invoiceId);
        }else{
            response = await getInvoices();
        }
      
      break;

    case event.httpMethod === 'POST' && event.path === invoicePath:
      response = await saveInvoice(JSON.parse(event.body));
      break;
    case event.httpMethod === 'PATCH' && event.path === invoicePath:
      const requestBody = JSON.parse(event.body);
      response = await modifyInvoice(requestBody.invoice_id, requestBody.updateKey, requestBody.updateValue);
      break;
    case event.httpMethod === 'DELETE' && event.path === invoicePath:
      response = await deleteInvoice(JSON.parse(event.body).invoiceId);
      break;
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
}

async function getInvoice(invoiceId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'invoice_id': invoiceId
    }
  }
  return await dynamodb.get(params).promise().then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
    return buildResponse(500, error);
  });
}

async function getInvoices() {
  const params = {
    TableName: dynamodbTableName
  }
  const allInvoices = await scanDynamoRecords(params, []);
  const body = {
    invoices: allInvoices
  }
  return buildResponse(200, body);
}

async function saveInvoice(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    return buildResponse(200, body);
  }, (error) => {
     
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
    return buildResponse(500, error);
  })
}

async function modifyInvoice(invoiceId, updateKey, updateValue) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'invoice_id': invoiceId
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }
  return await dynamodb.update(params).promise().then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
    return buildResponse(500, error);
  })
}

async function deleteInvoice(invoiceId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'invoice_id': invoiceId
    },
    ReturnValues: 'ALL_OLD'
  }
  return await dynamodb.delete(params).promise().then((response) => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
    return buildResponse(500, error);
  })
}

async function scanDynamoRecords(scanParams, itemArray) {
    try {
      const dynamoData = await dynamodb.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch(error) {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
      return buildResponse(500, error);
    }
  }
  
  function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }


  // CREATE, READ, READ ONE     -- working










// ******************** OLD CODE

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region:'ap-south-1'});


exports.handler = function(event, context, callback) {
    
    let scanningParameters = {
        TableName : 'invoices'
    };
    ddb.scan(scanningParameters, function(err,data){
        if(err){
            callback(err,null);
        }else{
            callback(null,data.Items);
        }
        
    });
};
