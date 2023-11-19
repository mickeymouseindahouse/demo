import {App, CfnOutput, Duration, Stack, StackProps} from "aws-cdk-lib";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Topic} from "aws-cdk-lib/aws-sns";
import {SqsSubscription} from "aws-cdk-lib/aws-sns-subscriptions";


export class SqsSnsStack extends Stack {
    private queue: Queue;
    private topic: Topic;

    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props);

        this.queue = new Queue(this, 'DemoQueue', {
            visibilityTimeout: Duration.seconds(300),
        });
        this.topic = new Topic(this, 'DemoTopic', {
            displayName: 'DemoTopic',
            topicName: 'DemoTopic',
        });
        this.topic.addSubscription(new SqsSubscription(this.queue));

        new CfnOutput(this, 'QueueURL', {
            value: this.queue.queueUrl,
        });
        new CfnOutput(this, 'TopicARN', {
            value: this.topic.topicArn,
        });
    }

    public getQueue(): Queue {
        return this.queue;
    }

    public getTopic(): Topic {
        return this.topic;
    }


}