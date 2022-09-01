# frozen_string_literal: true

module Knuepf
  module Errors
    module Api
      class UnauthorizedError < BaseError
        def initialize(message: nil)
          data = nil
          data = { message: message } if message.present?

          super('unauthorized', http_status: 403, data: data)
        end
      end
    end
  end
end
