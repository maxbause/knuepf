# frozen_string_literal: true

class Api::V1::ApplicationController < ApplicationController
  include ApiConcern

  rescue_from StandardError, with: :handle_uncaught_error
  rescue_from Knuepf::Errors::Api::BaseError, with: :handle_uncaught_api_error
  rescue_from ActionController::ParameterMissing, with: :handle_uncaught_parameter_missing_error
  rescue_from ActiveRecord::RecordInvalid, with: :handle_uncaught_record_invalid_error

  def require_authorized_user
    token = request.headers['token']
    return render_unauthorized if token.blank?

    begin
      raw_user = Knuepf::Jwt.decode(token)[0]
      @user = User.find_by(id: raw_user['id'], jwt: token)

      return render_unauthorized if @user.blank?

      @user
    rescue StandardError
      render_unauthorized
    end
  end

  private

  def handle_uncaught_api_error(error)
    render_api_error [error], status: error.http_status.presence || 500
  end

  def handle_uncaught_parameter_missing_error(_error)
    render_api_error [Knuepf::Errors::Api::ParameterMissingError.new]
  end

  def handle_uncaught_record_invalid_error(error)
    errors = error.record.errors.map(&:message)

    render_api_error errors
  end

  def handle_uncaught_error(error)
    logger.debug("Uncaught API error (500): #{error}")

    render_api_error [Knuepf::Errors::Api::UnexpectedError.new]
  end

  def render_unauthorized
    render_api_error [Knuepf::Errors::Api::UnauthorizedError.new]
  end
end
