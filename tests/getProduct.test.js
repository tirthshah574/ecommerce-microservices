const { getProduct } = require('../src/handlers/getProduct');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('getProduct', () => {
  beforeEach(() => {
    ddbMock.reset();
    process.env.PRODUCTS_TABLE = 'MockProductsTable';
  });

  it('should return a product successfully', async () => {
    const mockProduct = { productId: '123', name: 'Test Product' };
    ddbMock.on(GetCommand).resolves({ Item: mockProduct });

    const event = { productId: '123' };
    const result = await getProduct(event);

    expect(result).toEqual(mockProduct);
    const getCommandInput = ddbMock.call(0).args[0].input;
    expect(getCommandInput.TableName).toBe('MockProductsTable');
    expect(getCommandInput.Key).toEqual({ productId: '123' });
  });

  it('should return null when product is not found', async () => {
    ddbMock.on(GetCommand).resolves({ Item: null });

    const event = { productId: '123' };
    const result = await getProduct(event);

    expect(result).toBeNull();
  });

  it('should return an error when DynamoDB operation fails', async () => {
    ddbMock.on(GetCommand).rejects(new Error('DynamoDB error'));

    const event = { productId: '123' };
    const result = await getProduct(event);

    expect(result).toEqual({ error: 'Could not retrieve product: DynamoDB error' });
  });
});