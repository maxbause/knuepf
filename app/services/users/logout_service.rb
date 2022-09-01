# frozen_string_literal: true

module Users
  class LogoutService < BaseService
    def initialize(user:)
      super()

      @user = user
    end

    def execute
      @user.logout!
    end
  end
end
