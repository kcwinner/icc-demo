#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { ICCGlobalTablesStack } from '../lib/icc-global-table';
import { ICCGlobalApiStack } from '../lib/icc-api-stack';

const STAGE = process.env.STAGE || 'dev'
const REGION = process.env.REGION || 'us-east-2'
const ACCOUNT = process.env.ACCOUNT

const app = new cdk.App(
{ 
    context: { 
        STAGE: STAGE
    }
})

let replicationRegions = ['us-west-2'];
let globalTableStack = new ICCGlobalTablesStack(app, `icc-global-dynamo-stack-${STAGE}`, { 
    replicationRegions: replicationRegions,
});

// Deploy stack to us-east-2
new ICCGlobalApiStack(app, `icc-global-api-1-${STAGE}`, globalTableStack, { 
    env: { 
        region: 'us-east-2', 
        account: ACCOUNT 
    } 
});

// Deploy stack to us-west-2
new ICCGlobalApiStack(app, `icc-global-api-2-${STAGE}`, globalTableStack, { 
    env: { 
        region: 'us-west-2', 
        account: ACCOUNT 
    } 
});