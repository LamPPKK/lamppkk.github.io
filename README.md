# Nguyễn Đức Tùng Lâm — portfolio

Trilingual professional portfolio published at <https://lamppkk.github.io/>.

The site is built with Jekyll and the Oinam remote theme pinned to commit
`7fd9e58cef66870615a2670abbed5a826d0b4808`. Content is stored once in `_data`
and rendered in English, Vietnamese, and Japanese.

## Local development

```sh
bundle install
bundle exec ruby scripts/validate_content.rb
bundle exec jekyll serve
```

The canonical routes are `/`, `/experience/`, `/projects/`, `/credentials/`, and
`/open-source/`. Vietnamese routes live below `/vi/`; Japanese routes live below
`/ja/`.

## Content sources

- LinkedIn snapshot: professional timeline, education, services, languages, and credentials.
- CV: responsibilities, technologies, and private project summaries.
- GitHub: public repository metadata, refreshed by `scripts/sync_github_repos.rb`.

Private engagements are anonymized. The build never signs in to LinkedIn and stores
no LinkedIn cookie or token. GitHub Pages deploys from `master` through GitHub Actions.

## Refreshing the CV

The accessible DOCX is regenerated from the reference template and the canonical
records in `_data`. Use Python 3 with `python-docx`, then render the DOCX to PDF with
the document renderer used by this workspace:

```sh
python3 scripts/build_cv.py /path/to/reference-template.docx assets/cv/Nguyen-Duc-Tung-Lam-CV.docx
python3 /path/to/render_docx.py assets/cv/Nguyen-Duc-Tung-Lam-CV.docx --output_dir /tmp/cv-render --emit_pdf
cp /tmp/cv-render/Nguyen-Duc-Tung-Lam-CV.pdf assets/cv/Nguyen-Duc-Tung-Lam-CV.pdf
```

Inspect every rendered page before publishing. The generator resets document-owner
and template-history metadata, adds semantic heading/list styles, and keeps the PDF
to three complete pages without a trailing blank page.
