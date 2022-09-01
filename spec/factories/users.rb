# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence :username do |n|
      "freddie_#{n}"
    end
    password { 'foobar1234' }
    role { :user }

    trait :with_valid_jwt do
      after(:create, &:login!)
    end
  end
end
