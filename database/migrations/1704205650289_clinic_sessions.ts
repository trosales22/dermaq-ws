import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClinicSessionsSchema extends BaseSchema {
  protected tableName = 'clinic_sessions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique().index()
      table.string('refno').nullable().index()
      table.integer('max_slots').defaultTo(0).index()
      table.string('session_date').notNullable().index()
      table.string('start_time').notNullable().index()
      table.string('end_time').notNullable().index()
      table.string('status').notNullable().defaultTo('open').index()
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).nullable()
      table.index(['created_at', 'updated_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
