# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::HelloController, type: :controller do
  shared_examples :to_return_json do
    it 'to return json' do
      expect(subject.content_type).to eq('application/json; charset=utf-8')
    end
  end

  shared_examples :to_return_basic_api_information do
    it 'to return basic api information' do
      json = JSON.parse(subject.body)
      expect(json.keys.include?('title')).to eq(true)
      expect(json.keys.include?('message')).to eq(true)
      expect(json.keys.include?('version')).to eq(true)
      expect(json['version']).to eq(VERSION)
    end
  end

  describe 'GET show' do
    subject { get :show }
    include_examples :to_return_json
    include_examples :to_return_basic_api_information
  end
end
