import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductsSchema extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique().index()
      table.string('code').index()
      table.string('name').index()
      table.string('description', 500).nullable()
      table.string('photo_url', 500).nullable()
      table.json('photo_gallery').nullable()
      table.integer('quantity').defaultTo(0).index()
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true })
      table.index(['created_at', 'updated_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
