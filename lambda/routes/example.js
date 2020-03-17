class Example {
    constructor(options) {
        this.db = options.db;
    }

    async scanSomething(e) {
        console.log('Scanning!');

        let scanParams = {
            TableName: process.env.TABLE_NAME
        }

        console.log(scanParams);

        let data = await this.db.scan(scanParams).promise();

        console.log(data)

        return data;
    }
}

module.exports = Example;