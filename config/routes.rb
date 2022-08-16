# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api do
    namespace :v1 do
      get '/', to: 'hello#show'
    end
  end

  get '/', to: 'frontend#show', via: [:get]
  get '*path', to: 'frontend#show', via: [:get]
end
