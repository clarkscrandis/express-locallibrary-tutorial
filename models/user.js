var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = 'users';

function Users() {
	this.first_name = 'defaultFirstName';
	this.family_name = 'defaultFamilyName';
}

function Users(input) {
	this.first_name = input.first_name;
	this.family_name = input.family_name;
}

Users.prototype.indexExists = function() {
//function indexExists() {
	return elasticClient.indices.exists({
        index: indexName
    });
}
//exports.indexExists = indexExists;

Users.prototype.initIndex = function() {
//function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
//exports.initIndex = initIndex;

Users.prototype.deleteIndex = function() {
//function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
//exports.deleteIndex = deleteIndex;

Users.prototype.initMapping = function() {
//function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: 'user',
        body: {
            properties: {
                title: { type: 'string' },
                suggest: {
                    type: 'completion',
                    analyzer: 'simple',
                    search_analyzer: 'simple',
                    payloads: true
                }
            }
        }
    });
}
//exports.initMapping = initMapping;

Users.prototype.addUser = function(user) {
//function addUser(user) {
    return elasticClient.index({
        index: indexName,
        type: 'user',
        body: {
            title: user.title,
            suggest: {
                input: user.title.split(' '),
                output: user.title,
                payload: user.metadata || {}
            }
        }
    });
}
//exports.addUser = addUser;

Users.prototype.getSuggestions = function(input) {
//function getSuggestions(input) {
    return elasticClient.suggest({
        index: indexName,
        type: 'user',
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: 'suggest',
                    fuzzy: true
                }
            }
        }
    })
}
//exports.getSuggestions = getSuggestions;

Users.prototype.save = function(input) {
//function save(input) {
	console.log('In the save operation')
	return false
}
//exports.save = save;

module.exports = Users;
