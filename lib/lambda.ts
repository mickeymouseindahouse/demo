import {App, Duration, Stack, StackProps} from "aws-cdk-lib";
import {Code, EventSourceMapping, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Topic} from "aws-cdk-lib/aws-sns";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";


export interface LambdaStackProps {
    stackProps: StackProps,
    tableName: string,
    queue: Queue,
    topic: Topic,
}


export class LambdaStack extends Stack {
    constructor(parent: App, name: string, props: LambdaStackProps) {
        super(parent, name, props.stackProps);

        const lambdaFunction = new Function(this, 'DemoLambda', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.demoLambdaHandler',
            code: Code.fromAsset('lambda/demo_lambda/dist'),
            timeout: Duration.minutes(5),
            environment: {
                tableName: props.tableName,
                topicArn: props.topic.topicArn,
            },
        });

        props.queue.grantConsumeMessages(lambdaFunction);
        lambdaFunction.addEventSource(new SqsEventSource(props.queue, {
            batchSize: 1,
        }));
        props.topic.grantPublish(lambdaFunction);
    }
}