import { Construct, Duration } from '@aws-cdk/core';
import { IHostedZone, HostedZone, RecordSet, RecordType, CfnHealthCheck, CfnRecordSet } from '@aws-cdk/aws-route53';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';

export interface ICCRegionalRecordProps {
    api: LambdaRestApi,
    region: string
}

export class ICCRegionalRecord extends Construct {
    public readonly hostedZone: IHostedZone
    public readonly recordSet: CfnRecordSet

    constructor(scope: Construct, id: string, props: ICCRegionalRecordProps) {
        super(scope, id);

        const STAGE = this.node.tryGetContext('STAGE')

        this.hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
            domainName: 'kennethwinner.com',
            privateZone: false
        })

        console.log(props.api.url)

        let healthCheck = new CfnHealthCheck(this, 'icc-demo-health-check', {
            healthCheckConfig: {
                type: 'HTTPS',
                resourcePath: '/healthcheck',
                failureThreshold: 3,
                fullyQualifiedDomainName: props.api.domainName?.domainNameAliasDomainName
                // fullyQualifiedDomainName: props.api.domainName?.domainNameAliasDomainName
            }
        });

        this.recordSet = new CfnRecordSet(this, 'test', {
            name: 'global-demo.kennethwinner.com',
            region: props.region,
            type: RecordType.CNAME,
            hostedZoneId: this.hostedZone.hostedZoneId,
            ttl: '60',
            resourceRecords: [
                props.api.domainName?.domainNameAliasDomainName || ''
            ],
            setIdentifier: props.region,
            healthCheckId: healthCheck.ref
        });
    }
}