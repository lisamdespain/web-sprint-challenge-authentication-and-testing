const db = require('../../data/dbConfig')

function findById(id){
    return db('users').where({id}).first();
}

function add(user) {
    return db('users').insert(user)
    .then(([id]) =>{
        findById(id).select('id', 'username');
    })
}

module.exports = {
    findById,
    add
}