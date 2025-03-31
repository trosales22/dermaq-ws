import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ApiTokensSchema extends BaseSchema {
  protected tableName = 'api_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().index()
      table.integer('user_id').notNullable().index()
      table.string('name').notNullable()
      table.string('type').notNullable().index()
      table.string('token').notNullable().unique().index()
      table.timestamp('expires_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.index(['created_at', 'expires_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
