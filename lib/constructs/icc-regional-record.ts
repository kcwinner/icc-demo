import { Construct } from '@aws-cdk/core';
import { IHostedZone, HostedZone, RecordType, CfnHealthCheck, CfnRecordSet } from '@aws-cdk/aws-route53';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';

export interface ICCRegionalRecordProps {
    api: LambdaRestApi,
    region: string
    domainName: string
}

export class ICCRegionalRecord extends Construct {
    public readonly hostedZone: IHostedZone
    public readonly recordSet: CfnRecordSet

    constructor(scope: Construct, id: string, props: ICCRegionalRecordProps) {
        super(scope, id);

        this.hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
            domainName: props.domainName,
            privateZone: false
        })

        let url = props.api.url.replace('https://', '').split('/')[0];

        let healthCheck = new CfnHealthCheck(this, 'icc-demo-health-check', {
            healthCheckConfig: {
                type: 'HTTPS',
                resourcePath: '/prod/healthcheck',
                failureThreshold: 3,
                fullyQualifiedDomainName: url
            }
        });

        this.recordSet = new CfnRecordSet(this, 'test', {
            name: `global-demo.${this.hostedZone.zoneName}`,
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