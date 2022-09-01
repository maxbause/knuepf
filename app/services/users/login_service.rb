# frozen_string_literal: true

module Users
  class LoginService < BaseService
    def initialize(username:, password:)
      super()

      @username = username.presence || ''
      @password = password.presence || ''
    end

    def execute
      @username = @username.strip
      @password = @password.strip

      raise Knuepf::Errors::Api::UnauthorizedError if @username.blank? || @password.blank?

      user = User.find_by(username: @username)
      raise Knuepf::Errors::Api::UnauthorizedError if user.blank?

      user = user.authenticate_password(@password)
      raise Knuepf::Errors::Api::UnauthorizedError unless user

      if user.banned?
        message = user.ban_message.presence || 'error.api.banned'
        raise Knuepf::Errors::Api::UnauthorizedError.new(message: message)
      end

      user.login!
    end
  end
end
