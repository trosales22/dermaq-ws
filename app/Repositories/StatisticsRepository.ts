import Database from "@ioc:Adonis/Lucid/Database";
import ClinicSession from "App/Models/ClinicSession";
import Product from "App/Models/Product";
import Reservation from "App/Models/Reservation";

export default class StatisticsRepository {
  constructor() {
  }

  async getOverallStats(){
    const clinicSessionsTable = ClinicSession.table
    const reservationsTable = Reservation.table
    const productsTable = Product.table

    return Database.rawQuery("SELECT \n" +
      `(SELECT COUNT(*) FROM ${clinicSessionsTable}) AS total_sessions,\n` +
      `(SELECT COUNT(*) FROM ${reservationsTable}) AS total_reservations,\n` +
      `(SELECT COUNT(*) FROM ${productsTable}) AS total_products`)
  }
}
