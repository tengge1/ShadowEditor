using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// MongoDB帮助类
    /// </summary>
    /// <see cref="http://mongodb.github.io/mongo-csharp-driver/2.5/"/>
    /// <seealso cref="http://mongodb.github.io/mongo-csharp-driver/2.5/apidocs"/>
    public class MongoHelper
    {
        public readonly string connectionString;
        public readonly string dbName;

        private MongoClient client;
        private IMongoDatabase db;

        /// <summary>
        /// 构造函数
        /// </summary>
        public MongoHelper()
        {
            connectionString = ConfigurationManager.AppSettings["mongo_connection"];
            dbName = ConfigurationManager.AppSettings["mongo_dbName"];
            client = new MongoClient(connectionString);
            db = client.GetDatabase(dbName);
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="connectionString">连接字符串</param>
        /// <param name="dbName">数据库名称</param>
        public MongoHelper(string connectionString, string dbName)
        {
            this.connectionString = connectionString;
            this.dbName = dbName;
            client = new MongoClient(connectionString);
            db = client.GetDatabase(dbName);
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="dbName">数据库名称</param>
        public MongoHelper(string dbName)
        {
            connectionString = ConfigurationManager.AppSettings["mongo_connection"];
            this.dbName = dbName;
            client = new MongoClient(connectionString);
            db = client.GetDatabase(dbName);
        }

        /// <summary>
        /// 列出所有数据集
        /// </summary>
        /// <returns>数据集游标</returns>
        public IAsyncCursor<BsonDocument> ListCollections()
        {
            return db.ListCollections();
        }

        /// <summary>
        /// 获取某个数据集
        /// </summary>
        /// <param name="name">数据集名称</param>
        /// <returns>数据集游标</returns>
        public IMongoCollection<BsonDocument> GetCollection(string name)
        {
            return db.GetCollection<BsonDocument>(name);
        }

        /// <summary>
        /// 删除某个数据集
        /// </summary>
        /// <param name="name">数据集名称</param>
        public void DropCollection(string name)
        {
            db.DropCollection(name);
        }

        /// <summary>
        /// 插入一条数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="document">数据</param>
        public void InsertOne(string collectionName, BsonDocument document)
        {
            GetCollection(collectionName).InsertOne(document);
        }

        /// <summary>
        /// 插入多条数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="documents">文档列表</param>
        public void InsertMany(string collectionName, IEnumerable<BsonDocument> documents)
        {
            GetCollection(collectionName).InsertMany(documents);
        }

        /// <summary>
        /// 获取文档数量
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <returns>数量</returns>
        public long Count(string collectionName)
        {
            return GetCollection(collectionName).Count(new BsonDocument());
        }

        /// <summary>
        /// 获取数据集中满足条件的数据数量
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="filter">过滤器</param>
        /// <returns>数量</returns>
        public long Count(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            return GetCollection(collectionName).Count(filter);
        }

        /// <summary>
        /// 获取第一条满足条件的数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="filter">过滤器</param>
        /// <returns>数据</returns>
        public BsonDocument FindOne(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            return GetCollection(collectionName).Find(filter).FirstOrDefault();
        }

        /// <summary>
        /// 获取所有满足条件的数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="filter">过滤条件</param>
        /// <returns>数据列表</returns>
        public IFindFluent<BsonDocument, BsonDocument> FindMany(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            return GetCollection(collectionName).Find(filter);
        }

        /// <summary>
        /// 获取数据集中所有数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <returns>数据列表</returns>
        public IFindFluent<BsonDocument, BsonDocument> FindAll(string collectionName)
        {
            return GetCollection(collectionName).Find(new BsonDocument());
        }

        /// <summary>
        /// 更新满足条件的第一条数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="filter">过滤条件</param>
        /// <param name="update">更新内容</param>
        /// <returns>更新结果</returns>
        public UpdateResult UpdateOne(string collectionName, FilterDefinition<BsonDocument> filter, UpdateDefinition<BsonDocument> update)
        {
            return GetCollection(collectionName).UpdateOne(filter, update);
        }

        /// <summary>
        /// 更新所有满足条件的所有数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="filter">过滤条件</param>
        /// <param name="update">更新内容</param>
        /// <returns>更新结果</returns>
        public UpdateResult UpdateMany(string collectionName, FilterDefinition<BsonDocument> filter, UpdateDefinition<BsonDocument> update)
        {
            return GetCollection(collectionName).UpdateMany(filter, update);
        }

        /// <summary>
        /// 更新数据集中所有数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="update">更新内容</param>
        /// <returns>更新结果</returns>
        public UpdateResult UpdateAll(string collectionName, UpdateDefinition<BsonDocument> update)
        {
            return GetCollection(collectionName).UpdateMany(new BsonDocument(), update);
        }

        /// <summary>
        /// 删除数据集中满足条件的第一条数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="filter">过滤条件</param>
        /// <returns>删除结果</returns>
        public DeleteResult DeleteOne(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            return GetCollection(collectionName).DeleteOne(filter);
        }

        /// <summary>
        /// 删除数据集中满足条件的所有数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <param name="filter">过滤条件</param>
        /// <returns>删除结果</returns>
        public DeleteResult DeleteMany(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            return GetCollection(collectionName).DeleteMany(filter);
        }

        /// <summary>
        /// 删除数据集中所有数据
        /// </summary>
        /// <param name="collectionName">数据集名称</param>
        /// <returns>删除结果</returns>
        public DeleteResult DeleteAll(string collectionName)
        {
            return GetCollection(collectionName).DeleteMany(new BsonDocument());
        }
    }
}