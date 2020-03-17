import { Construct } from '@aws-cdk/core';
import { UserPool, UserPoolClient, AuthFlow } from '@aws-cdk/aws-cognito';

export interface ICCUserPoolProps {

}

export class ICCUserPool extends Construct {
    public readonly userPool: UserPool
    public readonly userPoolClient: UserPoolClient

    constructor(scope: Construct, id: string, props?: ICCUserPoolProps) {
        super(scope, id);

        const STAGE = this.node.tryGetContext('STAGE')

        this.userPool = new UserPool(this, id, {
            userPoolName: `${id}-${STAGE}`,
            selfSignUpEnabled: false,
            signInAliases: { username: false, email: true },
            userInvitation: {
                emailSubject: 'Invite to join ICC API!',
                emailBody: `You have been invited to join the ICC API! 
                Username: {username} 
                Temporary password: {####}. 
                You will be required to change your password upon logging in.`
            }
        })

        this.userPoolClient = new UserPoolClient(this, `${id}-client`, {
            userPool: this.userPool,
            generateSecret: false,
            enabledAuthFlows: [
                AuthFlow.USER_PASSWORD
            ]
        })
    }
}