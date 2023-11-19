import {SNS, DynamoDB} from "aws-sdk";
import {SQSEvent} from "aws-lambda";
import * as process from "process";




export async function demoLambdaHandler(event: SQSEvent) {
    console.info(`Executing demo lambda with input ${event}`);
    const dynamoDB = new DynamoDB({region: process.env.region ?? 'us-east-1'});
    const sns = new SNS({region: process.env.region ?? 'us-east-1'});
    for (const record of event.Records) {
        const  body = JSON.parse(record.body);
        console.info(`Inserting into Dynamo: ${record.body}`);
        await dynamoDB.putItem({
            Item: body!,
            TableName: process.env.tableName!,
        }).promise();
    }
}