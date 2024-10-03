// Import specific modules from AWS SDK v3
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Create DynamoDB client and DocumentClient
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.getAllProducts = async (event) => {
    const params = {
        TableName: process.env.PRODUCTS_TABLE,
    };

    try {
        // Using ScanCommand with DynamoDBDocumentClient
        const result = await dynamoDb.send(new ScanCommand(params));
        return result.Items;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw new Error('Could not retrieve products');
    }
};
