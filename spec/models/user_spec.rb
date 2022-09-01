# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#create' do
    let!(:user) { create(:user) }

    describe 'with valid attributes' do
      it 'to create' do
        expect(User.count).to eq(1)
        saved_user = User.find(user.id)
        expect(saved_user.username).to eq(user.username)
        expect(saved_user.password_digest).to be_truthy
        expect(saved_user.password_digest).to_not eq(user.password)
      end
    end

    describe 'with valid but duplicate username' do
      it 'to not create' do
        expect { create(:user, username: user.username) }.to raise_error(ActiveRecord::RecordInvalid, /username/i)
      end
    end

    describe 'with password that is too short' do
      it 'to not create' do
        expect { create(:user, password: '12') }.to raise_error(ActiveRecord::RecordInvalid, /password/i)
      end
    end

    describe 'with password that is too long' do
      it 'to not create' do
        expect do
          create(:user, password: Array.new(128) do
                                    'a'
                                  end.join)
        end.to raise_error(ActiveRecord::RecordInvalid, /password/i)
      end
    end

    describe 'with password that contains whitespace' do
      it 'to not create' do
        expect { create(:user, password: 'abcdefg ') }.to raise_error(ActiveRecord::RecordInvalid, /password/i)
      end
    end
  end

  describe '#login!' do
    it 'to create jwt' do
      user = create(:user)

      expect(user.jwt).to be_falsy
      expect(user.last_logged_in_at).to be_falsy

      jwt = user.login!
      expect(jwt).to be_truthy

      user.reload
      expect(user.last_logged_in_at).to be_a(Time)
      expect(user.jwt).to eq(jwt)
    end

    it 'to validate jwt' do
      user = create(:user, :with_valid_jwt)
      decoded_data = Knuepf::Jwt.decode(user.jwt)[0]

      expect(decoded_data['id']).to eq(user.id)
      expect(decoded_data['username']).to eq(user.username)
      expect(decoded_data['role']).to eq(user.role)

      expect(decoded_data['issued_at']).to be_a(Numeric)
    end
  end

  describe '#logout!' do
    it 'to delete current jwt' do
      user = create(:user, :with_valid_jwt)

      expect(user.jwt).to be_truthy

      user.logout!
      user.reload

      expect(user.jwt).to eq(nil)
    end
  end
end
