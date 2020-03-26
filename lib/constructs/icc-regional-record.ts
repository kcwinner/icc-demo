import { Construct } from '@aws-cdk/core';
import { IHostedZone, HostedZone, RecordType, CfnHealthCheck, CfnRecordSet } from '@aws-cdk/aws-route53';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';

export interface ICCRegionalRecordProps {
    hostedZone: IHostedZone
    api: LambdaRestApi,
    region: string
    domainName: string
}

export class ICCRegionalRecord extends Construct {
    public readonly recordSet: CfnRecordSet

    constructor(scope: Construct, id: string, props: ICCRegionalRecordProps) {
        super(scope, id);

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
            name: `global-demo.${props.hostedZone.zoneName}`,
            region: props.region,
            type: RecordType.CNAME,
            hostedZoneId: props.hostedZone.hostedZoneId,
            ttl: '60',
            resourceRecords: [
                props.api.domainName?.domainNameAliasDomainName || ''
            ],
            setIdentifier: props.region,
            healthCheckId: healthCheck.ref
        });
    }
}