class HealthCheck {
    constructor() {}

    async check(e) {
        console.log('Running Health Check');

        return {
            'status': 'healthy',
            'success': true
        }
    }
}

module.exports = HealthCheck;