# frozen_string_literal: true

module Knuepf
  module Errors
    module Api
      class UnexpectedError < BaseError
        def initialize
          super('unexpected', http_status: 500)
        end
      end
    end
  end
end
