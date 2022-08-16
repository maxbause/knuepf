# frozen_string_literal: true

# rubocop:disable Rails/ApplicationController
class FrontendController < ActionController::Base
  def show
    render file: 'public/frontend/index.html'
  end
end
# rubocop:enable Rails/ApplicationController
