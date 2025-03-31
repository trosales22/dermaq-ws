import JSONAPISerializer from "json-api-serializer";

export default class JSONSerializerHelper {
  constructor() {
  }

  public static serialize(resourceKey, meta, transformed, isForAddress: boolean = false) {
    let serializer = new JSONAPISerializer

    let toBeSerialized: any = {
      id: 'id'
    }

    if(isForAddress){
      toBeSerialized = {
        id: 'code'
      }
    }

    if (meta) {
      let topLevelMeta = {
        topLevelMeta: () => {
          return {
            pagination: {
              total: meta.total,
              per_page: meta.per_page,
              current_page: meta.current_page,
              total_pages: meta.last_page
            }
          };
        },
      };

      toBeSerialized = Object.assign(toBeSerialized, topLevelMeta, null)
    }

    serializer.register(resourceKey, toBeSerialized)
    return serializer.serialize(resourceKey, transformed)
  }
}
