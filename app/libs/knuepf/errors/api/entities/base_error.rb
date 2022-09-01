# frozen_string_literal: true

module Knuepf
  module Errors
    module Api
      module Entities
        class BaseError < Api::BaseError
          attr_reader :entity_name, :attribute

          def initialize(entity_name, error_id, attribute = nil, http_status: nil)
            @entity_name = entity_name
            @attribute = attribute
            @error_id = error_id

            attribute_addition = ''
            attribute_addition = ".#{@attribute}" if @attribute.present?
            msg = "#{@entity_name}#{attribute_addition}.#{@error_id}"

            super("entity.#{msg}", http_status: http_status)
          end
        end
      end
    end
  end
end
