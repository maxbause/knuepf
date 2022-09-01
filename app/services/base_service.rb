# frozen_string_literal: true

class BaseService
  def execute
    raise "#{self.class} doesn't implement .execute!"
  end
end
