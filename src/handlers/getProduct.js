// Import specific modules from AWS SDK v3
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { GetCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Create DynamoDB client and DocumentClient
const client = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(client);

exports.getProduct = async (event) => {
    const { productId } = event;

    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
            productId,
        },
    };

    try {
        // Using GetCommand with DynamoDBDocumentClient
        const data = await dynamoDB.send(new GetCommand(params));
        return data.Item ? data.Item : null;
    } catch (error) {
        return {
            error: `Could not retrieve product: ${error.message}`,
        };
    }
};
