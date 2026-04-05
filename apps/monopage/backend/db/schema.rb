# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_05_073501) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "analytics_logs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "link_id"
    t.bigint "profile_id", null: false
    t.string "referrer"
    t.datetime "updated_at", null: false
    t.string "user_agent"
    t.string "visitor_ip"
    t.index ["link_id"], name: "index_analytics_logs_on_link_id"
    t.index ["profile_id"], name: "index_analytics_logs_on_profile_id"
  end

  create_table "links", force: :cascade do |t|
    t.integer "clicks_count", default: 0
    t.datetime "created_at", null: false
    t.string "icon_type"
    t.integer "position"
    t.bigint "profile_id", null: false
    t.string "title"
    t.datetime "updated_at", null: false
    t.string "url"
    t.index ["profile_id"], name: "index_links_on_profile_id"
  end

  create_table "posts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "data", default: {}
    t.string "external_id"
    t.string "media_type"
    t.integer "position"
    t.datetime "published_at"
    t.bigint "social_account_id", null: false
    t.datetime "updated_at", null: false
    t.index ["social_account_id"], name: "index_posts_on_social_account_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.jsonb "ai_metadata", default: {}
    t.string "avatar_url"
    t.text "bio"
    t.datetime "created_at", null: false
    t.jsonb "theme_config", default: {}
    t.jsonb "theme_settings"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.string "username"
    t.integer "views_count", default: 0
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "social_accounts", force: :cascade do |t|
    t.string "access_token"
    t.datetime "created_at", null: false
    t.datetime "expires_at"
    t.jsonb "metadata"
    t.bigint "profile_id", null: false
    t.string "provider"
    t.string "refresh_token"
    t.integer "status", default: 0
    t.string "uid"
    t.datetime "updated_at", null: false
    t.index ["profile_id"], name: "index_social_accounts_on_profile_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.jsonb "notification_settings", default: {}
    t.string "password_digest"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "analytics_logs", "links"
  add_foreign_key "analytics_logs", "profiles"
  add_foreign_key "links", "profiles"
  add_foreign_key "posts", "social_accounts"
  add_foreign_key "profiles", "users"
  add_foreign_key "social_accounts", "profiles"
end
