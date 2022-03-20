# markdown_github -> gfm
# --css styles.css
# --standalone \
# --top-level-division=chapter \
# --epub-chapter-level 2 \
# --no-highlight \
# -f gfm \
# TODO: Remove thẻ style ở file HTML
pandoc -t epub \
    --css css/epub.css \
    --table-of-contents \
    --shift-heading-level-by -1 \
    --metadata-file metadata.yaml \
    README.md \
    -o "hoc three.js co ban.epub"
