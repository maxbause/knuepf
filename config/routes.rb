# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api do
    namespace :v1 do
      get '/', to: 'hello#show'

      resources :users, only: [:create]
      get '/users/me', to: 'users#show'
      post '/users/jwt', to: 'users#create_jwt'
      delete '/users/jwt', to: 'users#delete_jwt'
      patch '/users/password', to: 'users#update_password'
    end

    get '*path', to: proc { [404, {}, ['']] }
  end

  get '/', to: 'frontend#show', via: [:get]
  get '*path', to: 'frontend#show', via: [:get]
end
