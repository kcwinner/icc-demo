const pathToRegexp = require('path-to-regexp')

class Router {
    constructor(options) {
        this.middleware = options.middleware || [];
        this.routes = options.routes || [];
        this.defaultRoute = options.defaultRoute;
    }

    async route(event) {
        if (this.middleware.length === 0) {
            let route = this.routes.find(route => this.checkRoute(route, event)) || [null, null, this.defaultRoute];
            let fn = route[2];
            return await fn(event);
        }

        let middleWaredEvent = await this.middleware.reduce(async (event, middleware) => {
            return await middleware(event);
        })

        console.log(middleWaredEvent);

        let route = this.routes.find(route => this.checkRoute(route, event)) || [null, null, this.defaultRoute];
        let fn = route[2];

        return fn(middleWaredEvent);
    }

    checkRoute(route, event) {
        // match method and path
        let methodMatches = route[0].toUpperCase() === 'ANY' ||
            ((event.httpMethod || '').toUpperCase() === route[0].toUpperCase())

        if (methodMatches) {
            let keys = [];
            let re = pathToRegexp.pathToRegexp(route[1], keys);
            let results = re.exec(event.path);
            if (results) {
                // add parsed path results to event.pathParameters to make it easy to interchange with apigateway routing
                event.pathParameters = event.pathParameters || {};
                keys.forEach(function (key, index) {
                    event.pathParameters[key.name] = results[index + 1];
                });
                return true;
            }
        }
        return false;
    }
}

module.exports = Router;