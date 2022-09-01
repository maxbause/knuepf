# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FrontendController, type: :controller do
  shared_examples :to_return_html_file do
    it 'to return html file' do
      body = subject.body
      expect(body.include?('<html')).to eq(true)
      expect(body.include?('</html>')).to eq(true)
    end
  end

  describe 'GET show' do
    subject { get :show }
    include_examples :to_return_html_file
  end
end
