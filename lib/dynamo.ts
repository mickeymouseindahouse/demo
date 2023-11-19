import {App, CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import {AttributeType, Table} from "aws-cdk-lib/aws-dynamodb";
import {tap} from "node:test/reporters";


export class DynamoStack extends Stack {
    private table: Table;

    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props);

        this.table = new Table(this, 'DemoTable', {
            tableName: 'DemoTable',
            partitionKey: {
                name: 'requestId',
                type: AttributeType.STRING,
            },
            sortKey: {
                name: 'userId',
                type: AttributeType.STRING,
            }
        });

        new CfnOutput(this, 'TableName', {
            value: this.table.tableName,
        });
    }

    public getTableName(): string {
        return this.table.tableName;
    }
}