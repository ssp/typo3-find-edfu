plugin.tx_find {
	settings {
		connection {
			host = 127.0.0.1
			port = 8080
			path = /solr/edfu
		}
		queryFields {
			10 {
				extended = 1
				id = transliteration
				type = Text
			}
		}
		additionalFilters {
			1 = -typ:wb_berlin
			2 = -typ:stelle
		}
		sort {
			1 {
				id = default
				sortCriteria = sort asc
			}
		}
		standardFields {
			title = transliteration
			snippet = uebersetzung
		}
		facets {
			10 {
				id = typ
				excludeOwnFilter = 1
				type = Tabs
				hidden = 1
				selectedByDefault {
					formular = 1
				}
				facetQuery {
					10 {
						id = formular
						query = typ:formular
					}
					20 {
						id = gott
						query = typ:gott
					}
					30 {
						id = ort
						query = typ:ort
					}
					40 {
						id = wort
						query = typ:wort
					}
					50 {
						id = all
						query = typ:formular OR typ:gott OR typ:ort OR typ:wort
					}
				}
			}
			20 {
				id = band
				field = band
				sortOrder = index
				displayDefault = 8
			}
		}
		highlight {
			fields.1 = *
			useQueryTerms = 1
			useFacetTerms = 0
		}

		CSSPaths.50 = EXT:find/Projects/edfu/Resources/edfu.css
		JSPaths.50 = EXT:find/Projects/edfu/Resources/edfu.js

		languageRootPath = EXT:find/Projects/edfu/Language/
	}
	view {
		templateRootPath = EXT:find/Projects/edfu/Templates/
		partialRootPath = EXT:find/Projects/edfu/Partials/
	}
}
