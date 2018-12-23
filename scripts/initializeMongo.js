use serverDB;

db.getCollection('ids').createIndex({ type: 1 }, { unique: true });
try {
    db.getCollection('ids').insertOne({
        lastId: 0,
        type: 'card',
        createdAt: new Date(),
    });
} catch (error) {
    print('Already initialized id');
}