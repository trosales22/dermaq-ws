import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ReservationsSchema extends BaseSchema {
  protected tableName = 'reservations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique().index()
      table.string('refno').nullable().index()
      table.uuid('clinic_session_id').notNullable().index()
      table.uuid('customer_id').notNullable().index()
      table.string('status').notNullable().defaultTo('pending').index()
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).nullable()
      table.index(['created_at', 'updated_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
