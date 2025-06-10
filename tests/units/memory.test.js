// Fix this path if necessary
const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index.js');

describe('In-Memory Fragment Data Layer', () => {
  const ownerId = 'user123';
  const fragmentId = 'fragment123';
  const fragment = {
    id: fragmentId,
    ownerId,
    type: 'text/plain',
    size: 11,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  const buffer = Buffer.from('hello world');

  beforeEach(async () => {
    // Clear any existing data before each test
    await deleteFragment(ownerId, fragmentId).catch(() => {});
  });

  test('writeFragment() stores metadata and readFragment() retrieves it', async () => {
    await writeFragment(fragment);
    const result = await readFragment(ownerId, fragmentId);
    expect(result).toEqual(fragment);
  });

  test('writeFragmentData() stores buffer and readFragmentData() retrieves it', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(buffer);
  });

  test('readFragment() returns undefined for non-existent metadata', async () => {
    const result = await readFragment('unknownUser', 'unknownId');
    expect(result).toBeUndefined();
  });

  test('readFragmentData() returns undefined for non-existent buffer', async () => {
    const result = await readFragmentData('unknownUser', 'unknownId');
    expect(result).toBeUndefined();
  });

  test('listFragments() returns only fragment ids when expand=false', async () => {
    await writeFragment(fragment);
    const result = await listFragments(ownerId, false);
    expect(result).toEqual([fragmentId]);
  });

  test('listFragments() returns full metadata when expand=true', async () => {
    await writeFragment(fragment);
    const result = await listFragments(ownerId, true);
    expect(result).toEqual([fragment]);
  });

  test('deleteFragment() removes metadata and data', async () => {
    await writeFragment(fragment);
    await writeFragmentData(ownerId, fragmentId, buffer);
    await deleteFragment(ownerId, fragmentId);

    const meta = await readFragment(ownerId, fragmentId);
    const data = await readFragmentData(ownerId, fragmentId);

    expect(meta).toBeUndefined();
    expect(data).toBeUndefined();
  });
});
