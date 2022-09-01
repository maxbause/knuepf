# frozen_string_literal: true

class JwtSerializer < JSONAPI::Serializable::Resource
  type 'jwt'

  attributes :jwt
end
