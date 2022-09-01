# frozen_string_literal: true

module Users
  class UpdatePasswordService < BaseService
    def initialize(user:, current_password:, password:)
      super()

      @user = user
      @current_password = current_password
      @password = password
    end

    def execute
      throw Knuepf::Errors::Api::UnauthorizedError.new unless @user.authenticate_password(@current_password)

      @user.update!(password: @password)
      @user.logout!
      @user.reload
      @user
    end
  end
end
