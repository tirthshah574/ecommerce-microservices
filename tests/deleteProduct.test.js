const { deleteProduct } = require('../src/handlers/deleteProduct');
const { DynamoDBDocumentClient, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('deleteProduct', () => {
  beforeEach(() => {
    ddbMock.reset();
    process.env.PRODUCTS_TABLE = 'MockProductsTable';
  });

  it('should delete a product successfully', async () => {
    ddbMock.on(DeleteCommand).resolves({});

    const event = { productId: '123' };
    const result = await deleteProduct(event);

    expect(result).toBe('Product with ID 123 was deleted.');
    const deleteCommandInput = ddbMock.call(0).args[0].input;
    expect(deleteCommandInput.TableName).toBe('MockProductsTable');
    expect(deleteCommandInput.Key).toEqual({ productId: '123' });
  });

  it('should return an error when DynamoDB operation fails', async () => {
    ddbMock.on(DeleteCommand).rejects(new Error('DynamoDB error'));

    const event = { productId: '123' };
    const result = await deleteProduct(event);

    expect(result).toEqual({ error: 'Could not delete product: DynamoDB error' });
  });
});