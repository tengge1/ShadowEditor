import Config from './Config';

/**
 * MongoHelper
 */
class MongoHelper {

    constructor() {
        this.connectionString = Config.mongoConnection;
        this.dbName = Config.mongoDbName;
        this.client = require('mongodb').MongoClient;
    }

    /**
     * 内部调用，创建mongoDB链接
     */
    _connect() {
        return new Promise((resolve, reject) => {
            this.client.connect(this.connectionString, function (err, db) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                resolve(db);
            });
        });
    }

    /**
     * 创建数据集
     * @param {*} collectionName 数据集名称
     */
    createCollection(collectionName) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).createCollection(collectionName, function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    db.close();
                    resolve();
                });
            });
        });
    }

    /**
     * 插入一条数据
     * @param {*} collectionName 数据集名称
     * @param {*} obj 可序列化对象
     */
    insertOne(collectionName, obj) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).insertOne(obj, function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    db.close();
                    resolve();
                });
            });
        });
    }

    /**
     * 插入多条数据
     * @param {*} collectionName 数据集名称
     * @param {*} list 可序列话对象列表
     */
    insertMany(collectionName, list) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).insertMany(list, function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    db.close();
                    resolve();
                });
            });
        });
    }

    /**
     * 根据条件查询数据
     * @param {*} collectionName 数据集名称
     * @param {*} query 查询条件，例如：{ name: 'user' }
     */
    find(collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).find(query).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    db.close();
                    resolve(result);
                });
            });
        });
    }

    /**
     * 更新一条数据
     * @param {*} collectionName 数据集名称
     * @param {*} query 查询条件，例如：{ 'name': '菜鸟教程' }
     * @param {*} update 更新内容，例如：{ $set: { 'url': 'http://www.runoob.com' } }
     */
    updateOne(collectionName, query, update) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).updateOne(query, update, function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    db.close();
                    resolve(res);
                });
            });
        });
    }

    /**
     * 更新多条数据
     * @param {*} collectionName 数据集名称
     * @param {*} query 查询条件，例如：{ 'name': '菜鸟教程' }
     * @param {*} updates 更新内容，例如：{ $set: { 'url': 'http://www.runoob.com' } }
     */
    updateMany(collectionName, query, updates) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).updateMany(query, updates, function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    db.close();
                    resolve(res);
                });
            });
        });
    }

    /**
     * 删除一条数据
     * @param {*} collectionName 数据集名称
     * @param {*} query 条件
     */
    deleteOne(collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).deleteOne(query, function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    db.close();
                    resolve(res);
                });
            });
        });
    }

    /**
     * 删除多条数据
     * @param {*} collectionName 数据集名称
     * @param {*} query 条件
     */
    deleteMany(collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).deleteMany(query, function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    db.close();
                    resolve(res);
                });
            });
        });
    }

    /**
     * 删除数据集
     * @param {*} collectionName 数据集名称
     */
    drop(collectionName) {
        return new Promise((resolve, reject) => {
            this._connect().then((db) => {
                db.db(this.dbName).collection(collectionName).drop(function (err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    db.close();
                    resolve(res);
                });
            });
        });
    }

}

export default MongoHelper;