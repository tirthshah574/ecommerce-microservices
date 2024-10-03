// Import specific modules from AWS SDK v3
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Create DynamoDB client and DocumentClient
const client = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(client);

exports.deleteProduct = async (event) => {
    const { productId } = event;

    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
            productId,
        },
    };

    try {
        // Using DeleteCommand with DynamoDBDocumentClient
        await dynamoDB.send(new DeleteCommand(params));
        return `Product with ID ${productId} was deleted.`;
    } catch (error) {
        return {
            error: `Could not delete product: ${error.message}`,
        };
    }
};
