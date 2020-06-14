/** create user */
db.createUser({
  user: "peci-admin",
  pwd: "peci-12345",
  roles: [
    { role: "readWrite", db: "pecidb" },
    { role: "dbAdmin", db: "pecidb" }
  ]
});

/** create the collections */
db.createCollection("records");

/** create indexes */
//db.records.createIndex({ name: 1 }, { name: "name_index", unique: true });
