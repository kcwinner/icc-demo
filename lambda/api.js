const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const Router = require('./lib/router');

const example = require('./routes/example');
const Example = new example({db: dynamo});

const healthcheck = require('./routes/healthcheck');
const HealthCheck = new healthcheck();

const router = new Router({
    routes: [
        [ 'GET', '/examples', (e) => Example.scanSomething(e) ],
        [ 'GET', '/healthcheck', (e) => HealthCheck.check(e) ]
    ]
})

exports.handler = async (event, context) => {
    console.log(`Event: ${JSON.stringify(event)}`)
    context.callbackWaitsForEmptyEventLoop = false;

    let response;
    try {
        let result = await router.route(event);
        result['region'] = process.env.AWS_REGION;
        result['host'] = event.headers.Host;
        response = {
            'statusCode': 200,
            'body': JSON.stringify(result)
        }
    } catch (err) {
        console.log(err)
        response = {
            'statusCode': 500,
            'body': JSON.stringify({
                message: 'Internal Error',
                requestID: context.awsRequestId,
                requestTime: event.requestContext.requestTime
            })
        }
    }

    response.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    }

    return response;
};