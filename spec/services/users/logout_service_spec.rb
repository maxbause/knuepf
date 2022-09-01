# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::LogoutService do
  let!(:user) { create(:user, :with_valid_jwt) }
  let!(:other_user) { create(:user, :with_valid_jwt) }

  describe 'with valid user' do
    it 'to log out user and revoke jwt' do
      expect(user.jwt.starts_with?('ey')).to eq(true)

      Users::LogoutService.new(user: user).execute

      user.reload
      expect(user.jwt).to eq(nil)
    end

    it 'to not log out other users' do
      other_jwt = other_user.jwt
      other_jwt.freeze

      Users::LogoutService.new(user: user).execute

      other_user.reload
      expect(other_user.jwt).to eq(other_jwt)
    end
  end
end
