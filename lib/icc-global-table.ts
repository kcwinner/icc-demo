import * as cdk from '@aws-cdk/core';
import { BillingMode, AttributeType, Table } from '@aws-cdk/aws-dynamodb';

const BILLING_MODE = BillingMode.PAY_PER_REQUEST; 

// Replication Regions can not contain the region the stack is deployed
// https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-dynamodb/lib/table.ts#L1022
export interface ICCGlobalTablesStackProps extends cdk.StackProps {
    replicationRegions: string[]
}

export class ICCGlobalTablesStack extends cdk.Stack {
    public readonly table: Table;
    public readonly tableName: string;

    constructor(scope: cdk.Construct, id: string, props: ICCGlobalTablesStackProps) {
        super(scope, id, props);

        const STAGE = this.node.tryGetContext('STAGE');

        this.tableName = `icc-demo-global-table-${STAGE}`

        this.table = new Table(this, 'global-demo-table', {
            billingMode: BILLING_MODE,
            tableName: this.tableName,
            partitionKey: {
                name: 'pk',
                type: AttributeType.STRING
            },
            replicationRegions: props.replicationRegions
        })
    }
}