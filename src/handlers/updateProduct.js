// Import specific modules from AWS SDK v3
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { UpdateCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Create DynamoDB client and DocumentClient
const client = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(client);

exports.updateProduct = async (event) => {
    const { productId, name, description, price, category, stock } = event;

    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
            productId,
        },
        UpdateExpression: 'set #name = :name, #description = :description, #price = :price, #category = :category, #stock = :stock, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#description': 'description',
            '#price': 'price',
            '#category': 'category',
            '#stock': 'stock',
            '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
            ':name': name,
            ':description': description || null,
            ':price': price,
            ':category': category || null,
            ':stock': stock,
            ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        // Using UpdateCommand with DynamoDBDocumentClient
        const data = await dynamoDB.send(new UpdateCommand(params));
        return data.Attributes;
    } catch (error) {
        return {
            error: `Could not update product: ${error.message}`,
        };
    }
};
