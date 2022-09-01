# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::LoginService do
  let!(:user) { create(:user, username: 'freddie', password: 'test1234') }
  let!(:other_user) { create(:user, :with_valid_jwt, password: 'test1234') }
  let!(:banned_user) do
    create(:user, username: 'banned_user', password: 'test1234', banned: true, ban_message: 'Custom ban message')
  end

  describe 'with valid credentials' do
    it 'to generate jwt and thus login user' do
      service = Users::LoginService.new(username: 'freddie', password: 'test1234')
      jwt = service.execute

      expect(jwt.starts_with?('ey')).to eq(true)

      user.reload
      other_user.reload
      expect(user.jwt).to eq(jwt)
      expect(other_user.jwt).to_not eq(jwt)
    end
  end

  describe 'with invalid credentials' do
    it 'to do nothing' do
      service = Users::LoginService.new(username: 'foo', password: 'bar1234')
      expect { service.execute }.to raise_error(Knuepf::Errors::Api::UnauthorizedError)
    end

    describe 'but banned user' do
      it 'to prevent login' do
        service = Users::LoginService.new(username: 'banned_user', password: 'bar1234')
        expect { service.execute }.to raise_error(Knuepf::Errors::Api::UnauthorizedError)
      end
    end
  end

  describe 'with valid username but invalid password' do
    it 'to do nothing' do
      service = Users::LoginService.new(username: 'freddie', password: 'bar1234')
      expect { service.execute }.to raise_error(Knuepf::Errors::Api::UnauthorizedError)
    end

    it 'to not revoke active jwt' do
      current_jwt = user.login!
      current_jwt.freeze

      service = Users::LoginService.new(username: 'freddie', password: 'bar1234')
      expect { service.execute }.to raise_error(Knuepf::Errors::Api::UnauthorizedError)

      user.reload
      expect(user.jwt).to eq(current_jwt)
    end
  end
end
