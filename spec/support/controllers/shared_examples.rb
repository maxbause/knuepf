# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'to be an authorized route' do |http_verb, controller_method|
  def expect_unauthorized
    expect(response.status).to eq(403)
    expect(JSON.parse(response.body).dig('data', 'attributes', 'errors')).to eq(['error.api.unauthorized'])
  end

  def call_controller_method(verb, method)
    case verb
    when :get
      get method
    when :post
      post method
    when :put
      put method
    when :patch
      patch method
    when :delete
      delete method
    else
      throw "http verb '#{http_verb}' not known."
    end
  end

  describe 'with no token' do
    it 'to return unauthorized' do
      call_controller_method(http_verb, controller_method)

      expect_unauthorized
    end
  end

  describe 'with empty token' do
    it 'to return unauthorized' do
      request.headers['token'] = ''
      call_controller_method(http_verb, controller_method)

      expect_unauthorized
    end
  end

  describe 'with invalid token' do
    it 'to return unauthorized' do
      env_secret = ENV['JWT_HMAC_SECRET'].freeze
      ENV['JWT_HMAC_SECRET'] = 'foobar-foreign-secret'
      user = create(:user, :with_valid_jwt)
      ENV['JWT_HMAC_SECRET'] = env_secret

      request.headers['token'] = user.jwt
      call_controller_method(http_verb, controller_method)

      expect_unauthorized
    end
  end
end
