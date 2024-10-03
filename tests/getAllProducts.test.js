const { getAllProducts } = require('../src/handlers/getAllProducts');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('getAllProducts', () => {
  beforeEach(() => {
    ddbMock.reset();
    process.env.PRODUCTS_TABLE = 'MockProductsTable';
  });

  it('should return all products successfully', async () => {
    const mockProducts = [
      { productId: '1', name: 'Product 1' },
      { productId: '2', name: 'Product 2' },
    ];
    ddbMock.on(ScanCommand).resolves({ Items: mockProducts });

    const result = await getAllProducts();

    expect(result).toEqual(mockProducts);
    const scanCommandInput = ddbMock.call(0).args[0].input;
    expect(scanCommandInput.TableName).toBe('MockProductsTable');
  });

  it('should throw an error when DynamoDB operation fails', async () => {
    ddbMock.on(ScanCommand).rejects(new Error('DynamoDB error'));

    await expect(getAllProducts()).rejects.toThrow('Could not retrieve products');
  });
});