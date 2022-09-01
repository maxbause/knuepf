# frozen_string_literal: true

module Users
  class CreateService < BaseService
    def initialize(username:, password:, role: :user)
      super()

      @username = username
      @password = password
      @role = role
    end

    def execute
      User.create!(username: @username, password: @password, role: @role)
    end
  end
end
