import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id')
    table.string('title').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.decimal('amount', 10, 2).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
