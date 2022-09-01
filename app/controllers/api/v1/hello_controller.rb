# frozen_string_literal: true

class Api::V1::HelloController < ApplicationController
  def show
    render json: { title: 'Knuepf API', message: 'Welcome to the Knuepf API!', version: VERSION }
  end
end
