// Import specific modules from AWS SDK v3
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Create DynamoDB client and DocumentClient
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.createProduct = async (event) => {
    const { name, description, price, category, stock } = event;

    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
            productId: uuidv4(),
            name,
            description,
            price,
            category,
            stock,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    };

    try {
        // Using PutCommand with DynamoDBDocumentClient
        await dynamoDb.send(new PutCommand(params));
        return params.Item;
    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Could not create product');
    }
};
