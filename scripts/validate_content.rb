#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "yaml"

ROOT = File.expand_path("..", __dir__)
LANGUAGES = %w[en vi ja zh].freeze
errors = []

load_yaml = ->(name) { YAML.load_file(File.join(ROOT, "_data", name)) }
profile = load_yaml.call("profile.yml")
experience = load_yaml.call("experience.yml")
projects = load_yaml.call("projects.yml")
credentials = load_yaml.call("credentials.yml")
credential_evidence = load_yaml.call("credential_evidence.yml")
skills = load_yaml.call("skills.yml")
locales = load_yaml.call("locales.yml")

https_url = ->(value) { value.to_s.match?(%r{\Ahttps://[^\s]+\z}) }

flatten_locale = lambda do |value, prefix = nil, result = {}|
  if value.is_a?(Hash)
    value.each do |key, child|
      path = [prefix, key].compact.join(".")
      flatten_locale.call(child, path, result)
    end
  else
    result[prefix] = value
  end
  result
end

localized = lambda do |record, field, context|
  value = record[field]
  errors << "#{context}: #{field} must contain #{LANGUAGES.join('/')}" unless value.is_a?(Hash)
  LANGUAGES.each { |lang| errors << "#{context}: missing #{field}.#{lang}" if !value.is_a?(Hash) || value[lang].to_s.strip.empty? }
end

errors << "profile name is not canonical" unless profile["name"] == "Nguyễn Đức Tùng Lâm (Liam)"
email_pattern = /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/
profile_emails = profile.fetch("emails", [])
errors << "profile: exactly two contact emails are required" unless profile_emails.size == 2
profile_emails.each { |email| errors << "profile: invalid contact email #{email}" unless email.to_s.match?(email_pattern) }
errors << "profile: primary email must be included in contact emails" unless profile_emails.include?(profile["email"])
errors << "profile: invalid mobile number" unless profile["phone"].to_s.match?(/\A\+84 \d{3} \d{3} \d{3}\z/)
LANGUAGES.each { |lang| errors << "missing locale #{lang}" unless locales.key?(lang) }
english_locale = flatten_locale.call(locales.fetch("en", {}))
LANGUAGES.each do |lang|
  locale = flatten_locale.call(locales.fetch(lang, {}))
  (english_locale.keys - locale.keys).each { |path| errors << "locale #{lang}: missing #{path}" }
  (locale.keys - english_locale.keys).each { |path| errors << "locale #{lang}: unexpected #{path}" }
  locale.each { |path, value| errors << "locale #{lang}: empty #{path}" if value.to_s.strip.empty? }
end
%w[display_name headline location].each { |field| localized.call(profile, field, "profile") }
%w[about services principles].each do |field|
  localized.call(profile, field, "profile")
  LANGUAGES.each { |lang| errors << "profile: empty #{field}.#{lang}" if profile.dig(field, lang).to_a.empty? }
end
profile.fetch("education", []).each do |item|
  context = "education #{item['id']}"
  localized.call(item, "degree", context)
  errors << "#{context}: missing official school URL" unless https_url.call(item["school_url"])
end
errors << "profile: education must not be empty" if profile.fetch("education", []).empty?
profile.fetch("languages", []).each do |item|
  localized.call(item, "name", "language #{item['id']}")
  localized.call(item, "level", "language #{item['id']}")
end
profile.fetch("name_formats", {}).each do |format, item|
  localized.call(item, "usage", "name format #{format}")
end
profile.fetch("chinese_characters", []).each do |item|
  localized.call(item, "meaning", "Chinese character #{item['character']}")
end

experience_keys = experience.map { |item| [item["employer"].to_s.downcase, item.dig("role", "en").to_s.downcase, item["start_date"]] }
errors << "duplicate experience record" unless experience_keys.uniq.size == experience_keys.size
experience.each do |item|
  context = "experience #{item['id']}"
  %w[role employment_type summary location].each { |field| localized.call(item, field, context) }
  errors << "#{context}: missing official organization URL" unless https_url.call(item["organization_url"])
  item.fetch("unit_links", []).each do |link|
    errors << "#{context}: unit link is missing a label" if link["label"].to_s.strip.empty?
    errors << "#{context}: invalid unit URL" unless https_url.call(link["url"])
  end
end

%w[id slug].each do |field|
  values = projects.map { |project| project[field] }
  errors << "duplicate project #{field}" unless values.uniq.size == values.size
end
experience_ids = experience.map { |item| item["id"] }
allowed_link_types = %w[github live website customer_website app_store google_play].freeze
allowed_sources = %w[cv professional-portfolio github linkedin].freeze
projects.each do |project|
  context = "project #{project['id']}"
  %w[title role challenge contribution].each { |field| localized.call(project, field, context) }
  if project["period"].is_a?(Hash)
    localized.call(project, "period", context)
    reference_dates = project.dig("period", "en").to_s.scan(/\d{4}(?:-\d{2})?/)
    LANGUAGES.each do |lang|
      translated_dates = project.dig("period", lang).to_s.scan(/\d{4}(?:-\d{2})?/)
      errors << "#{context}: period.#{lang} changes the source dates" unless translated_dates == reference_dates
    end
  end
  project.fetch("experience_ids", []).each { |id| errors << "#{context}: unknown experience #{id}" unless experience_ids.include?(id) }
  project.fetch("source", []).each { |source| errors << "#{context}: unsupported source #{source}" unless allowed_sources.include?(source) }
  project.fetch("links", []).each do |link|
    errors << "#{context}: unsupported link type #{link['type']}" unless allowed_link_types.include?(link["type"])
    errors << "#{context}: invalid external URL" unless https_url.call(link["url"])
  end
  if project["privacy"] == "private-anonymized" && !project.fetch("links", []).empty?
    errors << "#{context}: private case study must not expose external links"
  elsif project["privacy"] != "private-anonymized" && project.fetch("links", []).empty?
    errors << "#{context}: public case study must expose a verified external link"
  end
  LANGUAGES.each do |lang|
    prefix = lang == "en" ? "" : "#{lang}/"
    wrapper = File.join(ROOT, prefix, "projects", project["slug"], "index.html")
    errors << "#{context}: missing #{lang} wrapper" unless File.file?(wrapper)
  end
end

credential_keys = credentials.map { |item| [item.dig("title", "en").to_s.downcase, item["issuer"].to_s.downcase, item["credential_id"].to_s.downcase] }
errors << "duplicate credential" unless credential_keys.uniq.size == credential_keys.size
credentials.each { |item| localized.call(item, "title", "credential #{item['id']}") }
credential_ids = credentials.map { |item| item["id"] }
credential_evidence.each do |id, evidence|
  errors << "credential evidence #{id}: unknown credential" unless credential_ids.include?(id)
  errors << "credential evidence #{id}: invalid credential URL" unless https_url.call(evidence["credential_url"])
  if evidence.key?("image_url")
    errors << "credential evidence #{id}: invalid image URL" unless https_url.call(evidence["image_url"])
  end
end
errors << "credential evidence must not be empty" if credential_evidence.empty?

skills.each do |group|
  context = "skill group #{group['id']}"
  localized.call(group, "name", context)
  localized.call(group, "items", context)
  counts = LANGUAGES.map { |lang| group.dig("items", lang).to_a.size }
  errors << "#{context}: localized skill lists differ in length" unless counts.uniq.size == 1
end
skill_aliases = skills.flat_map { |group| group.dig("items", "en").to_a }.map { |item| item.downcase.strip }
errors << "duplicate normalized skill" unless skill_aliases.uniq.size == skill_aliases.size

repo_file = File.join(ROOT, "_data", "github_repositories.json")
if File.file?(repo_file)
  repos = JSON.parse(File.read(repo_file))
  errors << "duplicate GitHub repository" unless repos.map { |repo| repo["name"].downcase }.uniq.size == repos.size
  snapshot_urls = repos.map { |repo| repo["html_url"].to_s.sub(%r{/$}, "").downcase }
  projects.each do |project|
    project.fetch("links", []).select { |link| link["type"] == "github" }.each do |link|
      url = link["url"].to_s.sub(%r{/$}, "").downcase
      errors << "project #{project['id']}: GitHub link is absent from repository snapshot" unless snapshot_urls.include?(url)
    end
  end
else
  errors << "missing GitHub repository snapshot"
end

text_extensions = %w[.html .md .yml .yaml .json .js .css .rb]
legacy_domain = ["devfuse", "me"].join(".")
Dir.glob(File.join(ROOT, "**", "*"), File::FNM_DOTMATCH).each do |path|
  next unless File.file?(path) && text_extensions.include?(File.extname(path))
  next if path.include?("/.git/") || path.include?("/_site/") || path.include?("/vendor/")

  errors << "legacy domain remains in #{path.delete_prefix(ROOT + '/')}" if File.read(path).include?(legacy_domain)
end
errors << "CNAME must not exist" if File.exist?(File.join(ROOT, "CNAME"))
errors << "language order must be EN/VI/JP/CN" unless load_yaml.call("language_order.yml") == LANGUAGES

if errors.empty?
  puts "Content validation passed: #{experience.size} roles, #{projects.size} projects, #{credentials.size} credentials."
else
  warn errors.map { |error| "- #{error}" }.join("\n")
  exit 1
end
