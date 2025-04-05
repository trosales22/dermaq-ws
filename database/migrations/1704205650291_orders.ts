import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrdersSchema extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique().index()
      table.string('refno').nullable().index()
      table.uuid('customer_id').notNullable().index()
      table.decimal('total_amount', 10, 2).defaultTo(0).nullable()
      table.uuid('assisted_by_id').nullable().index()
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).nullable()
      table.index(['created_at', 'updated_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
