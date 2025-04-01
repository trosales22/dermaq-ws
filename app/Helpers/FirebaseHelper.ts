import admin from 'firebase-admin';

interface ISaveQueueNumber {
  cs_refno: string;
  queue_no: string;
  customer_id: string;
  status: string;
}

export default class FirebaseHelper {
  constructor() {
  }

  public static async saveQueueNumber(payload: ISaveQueueNumber){
    const path = `queues/${payload.cs_refno}`
    const sessionQueueRef = admin.database().ref(path)

    return await sessionQueueRef.child(payload.queue_no).set({
      customer_id: payload.customer_id,
      status: payload.status,
      created_at: admin.database.ServerValue.TIMESTAMP
    })
  }
}
