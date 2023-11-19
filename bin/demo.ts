#!/usr/bin/env node
import {App} from "aws-cdk-lib";
import {SqsSnsStack} from "../lib/sqs_sns";
import {DynamoStack} from "../lib/dynamo";
import {LambdaStack} from "../lib/lambda";

const app = new App();
const env = {
    account: '103562443735',
    region: 'us-east-1',
};

const sqsSnsStack: SqsSnsStack = new SqsSnsStack(app, 'SqsSnsStack', {
    env: env,
    stackName: 'SqsSnsStack',
});

const dynamoStack: DynamoStack = new DynamoStack(app, 'DynamoStack', {
    env: env,
    stackName: 'DynamoStack',
});

const lambdaStack: LambdaStack = new LambdaStack(app, 'LambdaStack', {
    stackProps: {
        env: env,
        stackName: 'LambdaStack'
    },
    queue: sqsSnsStack.getQueue(),
    topic: sqsSnsStack.getTopic(),
    tableName: dynamoStack.getTableName(),
});
lambdaStack.addDependency(sqsSnsStack);
lambdaStack.addDependency(dynamoStack);