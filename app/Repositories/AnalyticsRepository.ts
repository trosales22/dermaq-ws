import Database from "@ioc:Adonis/Lucid/Database";
import ClinicSession from "App/Models/ClinicSession";
import Reservation from "App/Models/Reservation";

export default class AnalyticsRepository {
  constructor() {
  }

  async getMonthlyReservationStats(payload: any) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (payload.year) {
      conditions.push("YEAR(created_at) = ?");
      values.push(payload.year);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    return Database.rawQuery(
        `SELECT
            MONTH(created_at) AS month,
            SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_count,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_count,
            SUM(CASE WHEN status = 'unattended' THEN 1 ELSE 0 END) AS unattended_count
        FROM ${Reservation.table}
        ${whereClause}
        GROUP BY MONTH(created_at)`,
        values
    ).then(res => {
      return res[0];
    }).catch(err => {
      return err.message;
    });
  }

  async getReservationCountPerSession() {
    return Database.rawQuery(
        `SELECT
            B.title AS session_title,
            COUNT(A.id) AS reservation_count
        FROM ${Reservation.table} A
        JOIN ${ClinicSession.table} B ON A.clinic_session_id = B.uuid
        GROUP BY B.title
        ORDER BY reservation_count DESC
        `
    ).then(res => {
      return res[0];
    }).catch(err => {
      return err.message;
    });
  }
}
