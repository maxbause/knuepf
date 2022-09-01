# frozen_string_literal: true

class Knuepf::Errors::Api::ErrorRendererSerializer < JSONAPI::Serializable::Resource
  type 'errors'
  attributes :errors, :errors_data
end
