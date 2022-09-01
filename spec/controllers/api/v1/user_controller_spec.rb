# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe 'POST create' do
    describe 'with valid and not taken credentials' do
      let!(:response) { post :create, params: { user: { username: 'test_user', password: 'test1234' } } }

      it 'to create user' do
        expect(User.count).to eq(1)

        user = User.last
        expect(user.username).to eq('test_user')
      end

      it 'to return user' do
        body = JSON.parse(response.body)
        user = body.dig('data', 'attributes')

        expect(body.dig('data', 'id').to_i).to eq(1)
        expect(user['username']).to eq('test_user')
      end

      it 'to not include password in the response' do
        user = JSON.parse(response.body).dig('data', 'attributes')

        expect(user.keys.exclude?('password')).to eq(true)
        expect(user.keys.exclude?('password_digest')).to eq(true)
        expect(response.body.exclude?('test1234')).to eq(true)
      end
    end

    describe 'with valid and already taken credentials' do
      let!(:response) do
        create(:user, username: 'test_user')
        post :create, params: { user: { username: 'test_user', password: 'test1234' } }
      end

      it 'to not create user' do
        expect(User.count).to eq(1)
        expect(response.status).to eq(400)

        body = JSON.parse(response.body)
        expect(body.dig('data', 'attributes', 'errors')).to eq(['error.api.entity.user.username.already_taken'])
      end
    end
  end

  describe 'POST create_jwt' do
    it 'to successfully login with correct credentials' do
      create(:user, username: 'test_user', password: 'test1234')

      post :create_jwt, params: { user: { username: 'test_user', password: 'test1234' } }
      expect(response.status).to eq(200)

      jwt = JSON.parse(response.body).dig('data', 'attributes', 'jwt')
      expect(jwt.starts_with?('ey')).to eq(true)
    end

    it 'to not login without any users present' do
      post :create_jwt, params: { user: { username: 'test_user', password: 'test1234' } }
      expect(response.status).to eq(403)

      errors = JSON.parse(response.body).dig('data', 'attributes', 'errors')
      expect(errors).to eq(['error.api.unauthorized'])
    end

    it 'to not login with empty params' do
      post :create_jwt, params: { user: { username: '', password: '' } }
      expect(response.status).to eq(403)

      errors = JSON.parse(response.body).dig('data', 'attributes', 'errors')
      expect(errors).to eq(['error.api.unauthorized'])
    end

    it 'to not login with invalid credentials' do
      create(:user, username: 'test_user', password: 'test1234')
      post :create_jwt, params: { user: { username: 'test_user', password: 'test12345' } }
      expect(response.status).to eq(403)

      errors = JSON.parse(response.body).dig('data', 'attributes', 'errors')
      expect(errors).to eq(['error.api.unauthorized'])
    end

    it 'to return error message for banned user and prevent login' do
      create(:user, username: 'test_user', password: 'test1234', banned: true)
      post :create_jwt, params: { user: { username: 'test_user', password: 'test1234' } }
      expect(response.status).to eq(403)

      body = JSON.parse(response.body)
      expect(response.body.exclude?('jwt')).to eq(true)
      errors = body.dig('data', 'attributes', 'errors')
      errors_data = body.dig('data', 'attributes', 'errors_data')
      expect(errors).to eq(['error.api.unauthorized'])
      expect(errors_data.dig('error.api.unauthorized', 'message')).to eq('error.api.banned')
    end
  end

  describe 'GET show' do
    include_examples 'to be an authorized route', :get, :show

    it 'to return filtered user from passed token header' do
      user = create(:user, :with_valid_jwt)
      10.times do
        create(:user, :with_valid_jwt)
      end
      request.headers['token'] = user.jwt
      get :show

      expect(response.status).to eq(200)

      body = JSON.parse(response.body)
      response_user = body.dig('data', 'attributes')
      expect(body.dig('data', 'id').to_i).to eq(user.id)
      expect(response_user['username']).to eq(user.username)
      expect(response_user['password']).to be_falsy
      expect(response_user['password_digest']).to be_falsy
      expect(response_user['jwt']).to be_falsy
    end
  end

  describe 'PATCH update_password' do
    include_examples 'to be an authorized route', :patch, :update_password
    let!(:user) { create(:user, :with_valid_jwt, password: 'test1234') }

    describe 'with invalid current password' do
      it 'to reject update request' do
        patch :update_password, params: { user: { current_password: 'test123', password: 'newPassword1234' } }

        expect(response.status).to eq(403)
        expect(JSON.parse(response.body).dig('data', 'attributes', 'errors')).to eq(['error.api.unauthorized'])
      end
    end

    describe 'with valid current password' do
      describe 'and invalid new password' do
        it 'to reject update request' do
          request.headers['token'] = user.jwt
          patch :update_password, params: { user: { current_password: 'test1234', password: 'inv' } }

          expect(response.status).to eq(400)
          expect(JSON.parse(response.body).dig('data', 'attributes',
                                               'errors')).to eq(['error.api.entity.user.password.out_of_range'])
        end
      end

      describe 'and valid new password' do
        it 'to update password' do
          request.headers['token'] = user.jwt
          patch :update_password, params: { user: { current_password: 'test1234', password: 'newPassword1234' } }

          user.reload
          expect(user.authenticate_password('test1234')).to eq(false)
          expect(user.authenticate_password('newPassword1234')).to be_truthy
        end

        it 'to invalidate current token' do
          request.headers['token'] = user.jwt
          patch :update_password, params: { user: { current_password: 'test1234', password: 'newPassword1234' } }

          expect(response.status).to eq(200)
          expect(response.body.strip).to eq('')

          request.headers['token'] = user.jwt
          get :show

          expect(response.status).to eq(403)
        end
      end
    end
  end

  describe 'DELETE jwt' do
    include_examples 'to be an authorized route', :patch, :delete_jwt
    let!(:user) { create(:user, :with_valid_jwt, password: 'test1234') }

    describe 'with valid user' do
      it 'to delete jwt and thus logout user' do
        request.headers['token'] = user.jwt
        get :show
        expect(response.status).to eq(200)

        delete :delete_jwt
        expect(response.status).to eq(200)

        get :show
        expect(response.status).to eq(403)
      end
    end
  end
end
