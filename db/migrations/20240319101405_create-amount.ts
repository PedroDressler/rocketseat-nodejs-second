import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.decimal('value', 10, 2).notNullable().alter()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('value')
    table.dropColumn('created_at')
  })
}
