const db = require('../../data/dbConfig')

function findById(id){
    return db('users').where({id}).first();
}

function findBy(input){
    return db('users').where(input).first();
}

async function add(user) {
    return db('users').insert(user).then(([id]) => findById(id))

}

module.exports = {
    findById,
    add, 
    findBy
}