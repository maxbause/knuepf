# frozen_string_literal: true

module Knuepf
  module Errors
    module Api
      class BaseError < Errors::BaseError
        attr_reader :http_status, :data

        def initialize(error_id, http_status: nil, data: nil)
          super("api.#{error_id}")

          @http_status = http_status
          @data = data
        end
      end
    end
  end
end
