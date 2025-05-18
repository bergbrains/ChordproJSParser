# Changelog

## [Unreleased] - Full ChordPro Specification Support

### Added
- Complete support for all ChordPro directives according to the specification
- Support for directive attributes in HTML-like format
- Support for conditional directives with selectors
- Support for all meta-data directives:
  - `sorttitle`, `composer`, `lyricist`, `copyright`, `album`, `year`, `time`, `tempo`, `duration`, `capo`, `meta`
- Support for all formatting directives:
  - `comment_italic`, `comment_box`, `highlight`, `image`
- Support for all environment directives:
  - `start_of_verse`/`end_of_verse`, `start_of_bridge`/`end_of_bridge`, `start_of_tab`/`end_of_tab`, `start_of_grid`/`end_of_grid`
  - Support for section labels
  - Support for chorus references
- Support for delegated environment directives:
  - `start_of_abc`/`end_of_abc`, `start_of_ly`/`end_of_ly`, `start_of_svg`/`end_of_svg`, `start_of_textblock`/`end_of_textblock`
- Support for chord diagrams:
  - `define`, `chord`
- Support for transposition:
  - `transpose` directive
  - Integration with the transpose plugin
- Support for font, size, and color directives
- Support for output-related directives:
  - `new_page`, `new_physical_page`, `column_break`, `pagetype`, `diagrams`, `grid`, `no_grid`, `titles`, `columns`
- Support for custom extensions with the `x_` prefix

### Changed
- Updated the parser to handle all directives according to the specification
- Updated the renderer to properly render all directives
- Updated the transpose plugin to integrate with the parser and renderer
- Updated the CSS styles to support all the new elements
- Updated the documentation to include all supported directives

### Fixed
- Fixed duplicate CSS styles
- Fixed handling of directive attributes
- Fixed integration between the parser, renderer, and plugins