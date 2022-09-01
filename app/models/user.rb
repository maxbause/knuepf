# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  enum :role, %i[user admin]

  validates :username,
            presence: { message: Knuepf::Errors::Api::Entities::UserError.new('is_blank', 'username') },
            format: { with: /^([a-z0-9_üäö]{3,24})$/i, multiline: true,
                      message: Knuepf::Errors::Api::Entities::UserError.new('not_matches_pattern', 'username') },
            uniqueness: { case_sensitive: false,
                          message: Knuepf::Errors::Api::Entities::UserError.new('already_taken', 'username') }
  validate :validates_password, if: :password_digest_changed?

  def login!
    jwt = Knuepf::Jwt.encode({ id: id, username: username, role: role, issued_at: Time.now.to_i })
    update!(jwt: jwt, last_logged_in_at: Time.current)

    jwt
  end

  def logout!
    update!(jwt: nil)
  end

  private

  def validates_password
    if password.blank?
      return errors.add(:password, Knuepf::Errors::Api::Entities::UserError.new('is_blank', 'password'))
    end

    if password.match?(/\s/i)
      errors.add(:password, Knuepf::Errors::Api::Entities::UserError.new('includes_whitespace', 'password'))
    end

    return unless password.length < 5 || password.length > 128

    errors.add(:password, Knuepf::Errors::Api::Entities::UserError.new('out_of_range', 'password'))
  end
end
