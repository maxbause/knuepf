# frozen_string_literal: true

module Api
  module V1
    class HelloController < ApplicationController
      def show
        render json: { title: 'Knuepf API', message: 'Welcome to the Knuepf API!', version: VERSION }
      end
    end
  end
end
