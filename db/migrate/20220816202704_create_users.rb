# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :password_digest, null: false
      t.string :jwt
      t.integer :role, null: false, default: 0
      t.boolean :banned, null: false, default: false
      t.text :ban_message
      t.timestamp :last_logged_in_at
      t.timestamps
    end

    add_index :users, :username, unique: true
  end
end
