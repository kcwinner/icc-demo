import * as cdk from '@aws-cdk/core';
import { ICCGlobalTablesStack } from '../lib/icc-global-table';
import { LambdaRestApi, EndpointType } from '@aws-cdk/aws-apigateway';
import { Runtime, Code, Function } from '@aws-cdk/aws-lambda';
import { HostedZone } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';

import { ICCRegionalRecord } from './constructs/icc-regional-record';

const DOMAIN_NAME = 'global-demo.kennethwinner.com'

export class ICCGlobalApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, globalTableStack: ICCGlobalTablesStack, props?: cdk.StackProps) {
    super(scope, id, props);

    const STAGE = this.node.tryGetContext('STAGE')
    const REGION = props?.env?.region;

    let lambdaFunction = new Function(this, 'icc-api-function', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.asset('lambda'),
      handler: 'api.handler',
      environment: {
        TABLE_NAME: globalTableStack.tableName
      }
    });

    globalTableStack.table.grantReadWriteData(lambdaFunction);

    let hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'kennethwinner.com',
      privateZone: false
    })

    let dnsCert = new DnsValidatedCertificate(this, 'demo-certificate', {
      domainName: DOMAIN_NAME,
      hostedZone: hostedZone,
      region: REGION
    });

    let regionalApi = new LambdaRestApi(this, `icc-api-${STAGE}`, {
      handler: lambdaFunction,
      domainName: {
        certificate: dnsCert,
        domainName: DOMAIN_NAME,
        endpointType: EndpointType.REGIONAL
      }
    })

    let record = new ICCRegionalRecord(this, `icc-api-regional-record-${STAGE}`, {
      api: regionalApi,
      region: REGION || ''
    })
  }
}
