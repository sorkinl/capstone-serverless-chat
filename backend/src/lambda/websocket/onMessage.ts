
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
require ('./patch.js');

const docClient = new AWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.CONNECTIONS_TABLE
let send = undefined
function init(event) {
  console.log(event)
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: 'latest',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  })
  send = async (connectionId, data) => {
    await apigwManagementApi
      .postToConnection({ ConnectionId: connectionId, Data:  data })
      .promise()
  }
}
export const handler = (
  event
) => {
    init(event);
    let message = JSON.parse(event.body).message
    getConnections().then((data) => {
      console.log(data.Items);
      data.Items.forEach(function(connection){
        console.log("Connection " + connection.id)
        send(connection.id, message)
      })
    })
    
    
    return{}
}

function getConnections(){
    return docClient.scan({
        TableName: connectionsTable,
    }).promise()
}
