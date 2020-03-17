import { Construct, Duration } from '@aws-cdk/core';
import { HostedZone, RecordSet, RecordType, RecordTarget, IHostedZone } from '@aws-cdk/aws-route53';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';

export interface ICCRegionalRecordProps {
    api: LambdaRestApi,
    region: string
}

export class ICCRegionalRecord extends Construct {
    public readonly hostedZone: IHostedZone
    public readonly recordSet: RecordSet

    constructor(scope: Construct, id: string, props: ICCRegionalRecordProps) {
        super(scope, id);

        const STAGE = this.node.tryGetContext('STAGE')

        this.hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
            domainName: 'kennethwinner.com',
            privateZone: false
        })

        let fqdn = `${props.api.restApiId}.execute-api.${props.region}.amazonaws.com`

        this.recordSet = new RecordSet(this, 'test', {
            recordName: 'global-demo.kennethwinner.com',
            recordType: RecordType.CNAME,
            zone: this.hostedZone,
            ttl: Duration.seconds(60),
            target: {
                values: [
                    props.api.domainName?.domainNameAliasDomainName || ''
                ]
            }
        })
    }
}