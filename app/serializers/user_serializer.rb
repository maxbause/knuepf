# frozen_string_literal: true

class UserSerializer < JSONAPI::Serializable::Resource
  type 'users'

  attributes :username, :role, :banned, :ban_message, :last_logged_in_at, :created_at, :updated_at
end
