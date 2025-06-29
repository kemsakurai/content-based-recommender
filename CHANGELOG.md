# Changelog

## [1.6.0] - 2025-06-30

### Added
- **Full TypeScript support** with comprehensive type definitions
- **Japanese language support** using kuromoji morphological analyzer
- **Enhanced multilingual text processing** capabilities
- **Comprehensive unit tests** with better error handling
- **Modern build system** with ESLint v9
- **Package name change** to `ts-content-based-recommender` to avoid conflicts

### Changed
- **Updated all dependencies** to latest versions
- **Improved code organization** and documentation
- **Enhanced error handling** and validation
- **Repository URLs** updated to fork location

### Fixed
- **Performance improvements** in similarity calculations
- **Memory usage optimization** with better resource management
- **Build system** improvements for better development experience

### Migration from upstream
- This package is forked from [stanleyfok/content-based-recommender](https://github.com/stanleyfok/content-based-recommender)
- Maintains backward compatibility with original API
- Added new language support without breaking existing functionality

## Historical Changes (from upstream)

This package is based on the original work by Stanley Fok.
For historical changes before the fork, see: https://github.com/stanleyfok/content-based-recommender

### Original Features (inherited)
- Content-based recommendation using TF-IDF and cosine similarity
- Support for unigram, bigram, and trigram processing
- Configurable vector sizes and similarity thresholds
- Bidirectional training capabilities
- Export/import functionality for model persistence
