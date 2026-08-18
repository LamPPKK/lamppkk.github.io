#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "yaml"

root = File.expand_path("..", __dir__)
projects = YAML.load_file(File.join(root, "_data", "projects.yml"))
locales = { "en" => "", "vi" => "vi", "ja" => "ja" }

projects.each do |project|
  locales.each do |lang, prefix|
    directory = File.join(root, prefix, "projects", project.fetch("slug"))
    FileUtils.mkdir_p(directory)
    permalink_prefix = prefix.empty? ? "" : "/#{prefix}"
    front_matter = {
      "layout" => "project",
      "lang" => lang,
      "translation_key" => "project-#{project.fetch('id')}",
      "project_id" => project.fetch("id"),
      "title" => project.fetch("title").fetch(lang),
      "description" => project.fetch("challenge").fetch(lang),
      "permalink" => "#{permalink_prefix}/projects/#{project.fetch('slug')}/"
    }
    File.write(File.join(directory, "index.html"), "---\n#{front_matter.to_yaml.sub(/\A---\s*\n/, '')}---\n")
  end
end

puts "Generated #{projects.size * locales.size} project wrappers."
