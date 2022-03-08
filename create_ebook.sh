# markdown_github -> gfm
# --css styles.css
# --standalone \
# --top-level-division=chapter \
# --epub-chapter-level 2 \
pandoc -f gfm \
    -t epub \
    --table-of-contents \
    --shift-heading-level-by -1 \
    --metadata title="Học Three.js cơ bản" \
    --metadata-file metadata.yaml \
    README.md \
    -o "hoc three.js.epub"
