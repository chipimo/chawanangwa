exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("users", function(table) {
      table.increments("id");
      table.string("user_id").notNullable();
      table.string("user_name").notNullable();
      table.string("email").notNullable();
      table.string("Fname").notNullable();
      table.string("Lname").notNullable();
      table.string("Password").notNullable();
      table.string("Residential_address").notNullable();
      table.string("Residential_features").notNullable();
      table.string("Residential_Image").notNullable();
      table.string("Call_Number").notNullable();
      table.string("Call_Number_whatsapp").notNullable();
      table.string("NRC_Number").notNullable();
      table.jsonb("Location").notNullable();
      table.jsonb("Profile_pic").notNullable();
      table.jsonb("Messages").notNullable();
      table.jsonb("Subscriptions").notNullable();
      table.jsonb("Purchases").notNullable();
      table.boolean("isSubscriber").notNullable();
      table.string("SubscriptionPlan").notNullable();  
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
    // .createTable("messages", function(table) {
    //   table.increments("id");
    //   table.timestamp("created_at").defaultTo(knex.fn.now());
    //   table.timestamp("updated_at").defaultTo(knex.fn.now());
    //   table.string("msg").notNullable();
    //   table
    //     .integer("from_user_id")
    //     .references("id")
    //     .inTable("subscribers");
    //   table
    //     .integer("to_user_id")
    //     .references("id")
    //     .inTable("subscribers");
    // })
    .createTable("subscriptions", function(table) {
      table.increments("id");
      table.jsonb("contener").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("products", function(table) {
      table.increments("id");
      table.string("product_id").notNullable();
      table.string("name").notNullable();
      table.text("description").notNullable();
      table.string("product_price_default").notNullable();
      table.string("product_price_discount").notNullable();
      table.text("image").notNullable();
      table.string("public_id").notNullable();
      table.string("format").notNullable();
      table.text("ImgUrl").notNullable();
      table.text("secure_url").notNullable();
      table.boolean("is_subscribable").notNullable();
      table.boolean("is_active").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    // .createTable("payment_details", function(table) {
    //   table.increments("id");
    //   table
    //     .integer("user_id")
    //     .references("id")
    //     .inTable("subscribers");
    //   table.string("Card_number").notNullable();
    //   table.string("Card_exp").notNullable();
    //   table.string("Card_name").notNullable();
    //   table.string("Card_cvv").notNullable();
    //   table.string("Mobile_Money_Number").notNullable();
    //   table.timestamp("created_at").defaultTo(knex.fn.now());
    //   table.timestamp("updated_at").defaultTo(knex.fn.now());
    // });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("subscriptions")
    .dropTable("nonsubscribers")
    .dropTable("products")
    .dropTable("users");
};
