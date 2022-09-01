# frozen_string_literal: true

class Api::V1::UsersController < Api::V1::ApplicationController
  before_action :require_authorized_user, only: %i[show update_password delete_jwt]

  def show
    render_api @user
  end

  def create
    create_params = params.require(:user).permit(:username, :password)
    service = Users::CreateService.new(username: create_params[:username], password: create_params[:password])

    begin
      res = service.execute
      render_api res
    rescue ActiveRecord::RecordInvalid => e
      render_api_error e.record.errors.map(&:message), status: 400
    end
  end

  def create_jwt
    create_jwt_params = params.require(:user).permit(:username, :password)
    service = Users::LoginService.new(username: create_jwt_params[:username], password: create_jwt_params[:password])
    data = OpenStruct.new(id: 1, jwt: service.execute)
    render_api data, class: { OpenStruct: JwtSerializer }
  end

  def update_password
    update_password_params = params.require(:user).permit(:current_password, :password)
    service = Users::UpdatePasswordService.new(
      user: @user,
      current_password: update_password_params[:current_password],
      password: update_password_params[:password]
    )
    service.execute
    render :ok
  end

  def delete_jwt
    service = Users::LogoutService.new(
      user: @user
    )
    service.execute
    render :ok
  end
end
