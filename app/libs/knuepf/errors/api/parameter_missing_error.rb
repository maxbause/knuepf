# frozen_string_literal: true

module Knuepf
  module Errors
    module Api
      class ParameterMissingError < BaseError
        def initialize
          super('parameter_missing', http_status: 400)
        end
      end
    end
  end
end
