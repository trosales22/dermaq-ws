import admin from 'firebase-admin';

interface ISaveQueueNumber {
  cs_refno: string;
  reservation_refno: string;
  queue_no: string;
  customer_id: string;
  customer_name: string;
  status: string;
}

interface IUpdateQueueStatus {
  cs_refno: string;
  queue_no: string;
  status: string;
}

export default class FirebaseHelper {
  constructor() {
  }

  public static async saveQueueNumber(payload: ISaveQueueNumber){
    const path = `queues/${payload.cs_refno}`
    const sessionQueueRef = admin.database().ref(path)

    return await sessionQueueRef.child(payload.queue_no).set({
      reservation_refno: payload.reservation_refno,
      customer_id: payload.customer_id,
      customer_name: payload.customer_name,
      status: payload.status,
      created_at: admin.database.ServerValue.TIMESTAMP
    })
  }

  public static async updateQueueStatus(payload: IUpdateQueueStatus) {
    const path = `queues/${payload.cs_refno}/${payload.queue_no}`;
    const sessionQueueRef = admin.database().ref(path);

    return await sessionQueueRef.update({
      status: payload.status
    });
  }
}
