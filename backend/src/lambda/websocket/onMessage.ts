import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
require ('./patch.js');

const docClient = new AWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.CONNECTIONS_TABLE
let send = undefined
function init(event: APIGatewayProxyEvent) {
  console.log(event)
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: 'latest',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  })
  send = async (connectionId: any, data: any) => {
    await apigwManagementApi
      .postToConnection({ ConnectionId: connectionId, Data: `Echo: ${data}` })
      .promise()
  }
}
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    init(event);
    let message = JSON.parse(event.body).message
    let connections = await getConnections();
    console.log(connections.Items);
    connections.Items.forEach(function(connection){
        console.log("Connection " + connection.id)
        send(connection.id,message);
    })
    return{
        statusCode: 200,
        body: ''
    };
  
}

async function getConnections(){
    return await docClient.scan({
        TableName: connectionsTable,
    }).promise()
}
