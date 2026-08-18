#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "net/http"
require "uri"

USER = "lamppkk"
OUTPUT = File.expand_path("../_data/github_repositories.json", __dir__)
FIELDS = %w[name html_url description language fork archived stargazers_count forks_count updated_at].freeze
MAX_ATTEMPTS = 3

def clean(value)
  return value unless value.is_a?(String)

  value.encode("UTF-8", invalid: :replace, undef: :replace, replace: "")
       .gsub(/[<>&]/, "<" => "‹", ">" => "›", "&" => "and")
       .gsub(/[\x00-\x08\x0B\x0C\x0E-\x1F]/, " ")
       .strip
end

def fetch(uri, request)
  (1..MAX_ATTEMPTS).each do |attempt|
    begin
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true, open_timeout: 10, read_timeout: 30) do |http|
        http.request(request)
      end
      return response if response.is_a?(Net::HTTPSuccess)

      retryable = response.code.to_i == 429 || response.code.to_i >= 500
      raise "GitHub API failed: #{response.code} #{response.message}" unless retryable && attempt < MAX_ATTEMPTS
    rescue Net::OpenTimeout, Net::ReadTimeout, EOFError, Errno::ECONNRESET, SocketError => error
      raise "GitHub API request failed after #{attempt} attempts: #{error.message}" if attempt >= MAX_ATTEMPTS
    end
    sleep attempt
  end

  raise "GitHub API request failed after #{MAX_ATTEMPTS} attempts"
end

repositories = []
page = 1
loop do
  uri = URI("https://api.github.com/users/#{USER}/repos?per_page=100&sort=updated&page=#{page}")
  request = Net::HTTP::Get.new(uri)
  request["Accept"] = "application/vnd.github+json"
  request["User-Agent"] = "#{USER}-portfolio-repository-sync"
  request["X-GitHub-Api-Version"] = "2022-11-28"
  token = ENV["GITHUB_TOKEN"]
  request["Authorization"] = "Bearer #{token}" unless token.to_s.empty?
  response = fetch(uri, request)
  abort "GitHub API failed: #{response.code} #{response.message}" unless response.is_a?(Net::HTTPSuccess)

  batch = JSON.parse(response.body)
  repositories.concat(batch.map { |repo| FIELDS.to_h { |field| [field, clean(repo[field])] } })
  break if batch.size < 100

  page += 1
end

repositories.sort_by! { |repo| repo.fetch("updated_at", "") }.reverse!
File.write(OUTPUT, JSON.pretty_generate(repositories) + "\n")
puts "Synced #{repositories.size} public repositories for #{USER}."
