# frozen_string_literal: true

module Knuepf
  class Jwt
    def self.encode(payload)
      JWT.encode payload, ENV.fetch('JWT_HMAC_SECRET', nil), 'HS256'
    end

    def self.decode(token)
      JWT.decode token, ENV.fetch('JWT_HMAC_SECRET', nil), true, { algorithm: 'HS256' }
    end
  end
end
