# frozen_string_literal: true

module Knuepf
  module Errors
    module Api
      module Entities
        class UserError < BaseError
          def initialize(error_id, attribute = nil, http_status: nil)
            super('user', error_id, attribute, http_status: http_status.presence || 400)
          end
        end
      end
    end
  end
end
