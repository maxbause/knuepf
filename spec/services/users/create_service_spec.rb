# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::CreateService do
  describe 'with valid and not already taken credentials' do
    it 'to create user' do
      service = Users::CreateService.new(username: 'test_user', password: 'testPassword1234')
      user = service.execute
      expect(User.count).to eq(1)

      db_user = User.find(user.id)
      expect(db_user.username).to eq(user.username)
      expect(db_user.role).to eq('user')
    end
  end

  describe 'with valid and already taken credentials' do
    it 'to not create user' do
      user = create(:user)
      service = Users::CreateService.new(username: user.username, password: 'testPassword1234')

      expect do
        service.execute
      end.to raise_error(ActiveRecord::RecordInvalid)
      expect(User.count).to eq(1)
    end
  end
end
