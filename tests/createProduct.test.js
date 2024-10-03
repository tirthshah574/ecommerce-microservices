const { createProduct } = require('../src/handlers/createProduct');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');

// Mock the DynamoDBDocumentClient
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('createProduct', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    ddbMock.reset();
    // Mock the environment variable
    process.env.PRODUCTS_TABLE = 'MockProductsTable';
  });

  it('should create a product successfully', async () => {
    // Mock the PutCommand to resolve successfully
    ddbMock.on(PutCommand).resolves({});

    const event = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      category: 'Test Category',
      stock: 100
    };

    const result = await createProduct(event);

    expect(result).toHaveProperty('productId');
    expect(result.name).toBe('Test Product');
    expect(result.description).toBe('This is a test product');
    expect(result.price).toBe(19.99);
    expect(result.category).toBe('Test Category');
    expect(result.stock).toBe(100);
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');

    // Verify that PutCommand was called with the correct parameters
    const putCommandInput = ddbMock.call(0).args[0].input;
    expect(putCommandInput.TableName).toBe('MockProductsTable');
    expect(putCommandInput.Item).toMatchObject(result);
  });

  it('should throw an error when DynamoDB operation fails', async () => {
    // Mock the PutCommand to reject with an error
    ddbMock.on(PutCommand).rejects(new Error('DynamoDB error'));

    const event = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      category: 'Test Category',
      stock: 100
    };

    await expect(createProduct(event)).rejects.toThrow('Could not create product');
  });
});