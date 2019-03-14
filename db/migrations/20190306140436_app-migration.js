exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("subscribers", function(table) {
      table.increments("id");
      table.string("user_id").notNullable();
      table.string("user_name").notNullable();
      table.string("email").notNullable();
      table.string("Fname").notNullable();
      table.string("Lname").notNullable();
      table.string("Residential_address").notNullable();
      table.string("Residential_features").notNullable();
      table.string("Residential_Image").notNullable();
      table.string("Call_Number").notNullable();
      table.string("Call_Number_whatsapp").notNullable();
      table.string("NRC_Number").notNullable();
      table.string("Coordinates").notNullable();
      table.string("Profile_pic").notNullable();
      table.string("Messages_id").notNullable();
      table.string("Subscription_id").notNullable();
      table.string("Purchases_id").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("nonsubscribers", function(table) {
      table.increments("id");
      table.string("user_name").notNullable();
      table.string("user_id").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("messages", function(table) {
      table.increments("id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.string("msg").notNullable();
      table
        .integer("from_user_id")
        .references("id")
        .inTable("subscribers");
      table
        .integer("to_user_id")
        .references("id")
        .inTable("subscribers");
    })
    .createTable("subscriptions", function(table) {
      table.increments("id");
      table
        .integer("user_id")
        .references("id")
        .inTable("subscribers");
      table.string("week").notNullable();
      table.string("month").notNullable();
      table.integer("number_of_weeks").notNullable();
      table.integer("number_of_months").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("payment_details", function(table) {
      table.increments("id");
      table
        .integer("user_id")
        .references("id")
        .inTable("subscribers");
      table.string("Card_number").notNullable();
      table.string("Card_exp").notNullable();
      table.string("Card_name").notNullable();
      table.string("Card_cvv").notNullable();
      table.string("Mobile_Money_Number").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("messages")
    .dropTable("subscriptions")
    .dropTable("nonsubscribers")
    .dropTable("payment_details")
    .dropTable("subscribers");
};
