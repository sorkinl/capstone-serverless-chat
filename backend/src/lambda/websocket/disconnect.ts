import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent,):Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext.connectionId;
    await addConnectionId(connectionId)
    return {
        statusCode:200,
        body: null
    }
}

async function addConnectionId(connectionId: string){
    await docClient.delete({
       TableName: connectionsTable,
        Key: {
            id: connectionId
        }
    }).promise();
}