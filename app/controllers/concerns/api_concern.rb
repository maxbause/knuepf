# frozen_string_literal: true

module ApiConcern
  extend ActiveSupport::Concern

  def render_api(data, rest = {})
    render jsonapi: data, **rest
  end

  def render_api_error(errors = nil, status: nil)
    raise "can't render errors without 'errors'" if errors.blank?
    raise "'errors' attribute must be an array!" unless errors.is_a?(Array)

    severest_error_status = 0
    errors = errors.each do |error|
      if error.is_a?(Knuepf::Errors::Api::BaseError) && (error.http_status.to_i > severest_error_status)
        severest_error_status = error.http_status.to_i
      end
    end

    severest_error_status = 500 if severest_error_status.zero?
    render jsonapi: Knuepf::Errors::Api::ErrorRenderer.new(errors).render,
           status: status.presence || severest_error_status
  end
end
