import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrderProductsSchema extends BaseSchema {
  protected tableName = 'order_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique().index()
      table.uuid('order_id').notNullable().index()
      table.uuid('product_id').notNullable().index()
      table.integer('quantity').defaultTo(0)
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).nullable()
      table.index(['created_at', 'updated_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
