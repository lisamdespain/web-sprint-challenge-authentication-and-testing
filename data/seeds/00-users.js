/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'Lisa', password: 'password1'},
    {id: 2, username: 'Ian', password: 'password2'},
    {id: 3, username: 'Nicole', password: 'password3'},
    {id: 4, username: 'Nathan', password: 'password4'},
  ]);
};
