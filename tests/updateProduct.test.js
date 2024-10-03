const { updateProduct } = require('../src/handlers/updateProduct');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('updateProduct', () => {
  beforeEach(() => {
    ddbMock.reset();
    process.env.PRODUCTS_TABLE = 'MockProductsTable';
  });

  it('should update a product successfully', async () => {
    const updatedProduct = {
      productId: '123',
      name: 'Updated Product',
      description: 'New description',
      price: 29.99,
      category: 'New Category',
      stock: 50,
      updatedAt: expect.any(String)
    };
    ddbMock.on(UpdateCommand).resolves({ Attributes: updatedProduct });

    const event = {
      productId: '123',
      name: 'Updated Product',
      description: 'New description',
      price: 29.99,
      category: 'New Category',
      stock: 50
    };
    const result = await updateProduct(event);

    expect(result).toEqual(updatedProduct);
    const updateCommandInput = ddbMock.call(0).args[0].input;
    expect(updateCommandInput.TableName).toBe('MockProductsTable');
    expect(updateCommandInput.Key).toEqual({ productId: '123' });
    expect(updateCommandInput.UpdateExpression).toContain('set #name = :name');
    expect(updateCommandInput.ExpressionAttributeValues[':name']).toBe('Updated Product');
  });

  it('should return an error when DynamoDB operation fails', async () => {
    ddbMock.on(UpdateCommand).rejects(new Error('DynamoDB error'));

    const event = {
      productId: '123',
      name: 'Updated Product',
      price: 29.99,
      stock: 50
    };
    const result = await updateProduct(event);

    expect(result).toEqual({ error: 'Could not update product: DynamoDB error' });
  });
});