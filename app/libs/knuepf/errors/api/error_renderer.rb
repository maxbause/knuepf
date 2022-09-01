# frozen_string_literal: true

module Knuepf
  module Errors
    module Api
      class ErrorRenderer
        attr_accessor :errors, :errors_data, :id

        # we have to give this class an arbitrary id attribute in order to be correctly processed by jsonapi
        def initialize(api_errors, id: 1)
          @id = id
          @api_errors = api_errors
        end

        def render
          @errors = @api_errors.map(&:message)

          data = {}
          @api_errors.each do |error|
            data[error.message] = error.data if error&.data.present?
          end
          @errors_data = data

          self
        end
      end
    end
  end
end
