# frozen_string_literal: true

module Knuepf
  module Errors
    class BaseError < StandardError
      attr_reader :error_id

      def initialize(error_id)
        super()
        @error_id = error_id
      end

      def message
        "error.#{@error_id}"
      end
    end
  end
end
