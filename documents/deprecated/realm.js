import Realm from "realm";

class WorkoutSchema extends Realm.Object {
  static schema = {
    name: "Workout",
    properties: {
      _id: "objectId",
      name: "string",
      days_worked: "array",
      exercises: { type: "list", objectType: "Exercise" }
    },
    primaryKey: "_id",
  }
}