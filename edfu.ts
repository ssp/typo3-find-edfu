# »find« extension configuration for the Edfu index.
#
# 2013 Sven-S. Porst, SUB Göttingen <porst@sub.uni-goettingen.de>
#
plugin.tx_find {
	# Paths for own templates and partials.
	# Most of them use symlinks to point back to the standard files provided by the extension.
	view {
		templateRootPath = EXT:find/Projects/edfu/Templates/
		partialRootPath = EXT:find/Projects/edfu/Partials/
	}

	settings {
		# Connection setup for the Solr index.
		# Needs to be adapted / overwritten for the final configuration.
		connection {
			host = 127.0.0.1
			port = 8080
			path = /solr/edfu

			# Use a long 10 second timeout for Solr queries.
			timeout = 10
		}

		# Add a filter query to not return documents of type »gott« or »ort«
		# This will removed when project members log in with their account.
		# (See the note at the end of the configuration file for details.)
		additionalFilters {
			3 = -typ:gott
			4 = -typ:ort
		}

		# Query field configuration
		queryFields {
			# Main query field, suppress typ »wb_berlin« and »stelle« documents.
			0 {
				query = %s -typ:wb_berlin -typ:stelle
				noescape = 1
			}
			# Second query field for transliteration. Search with/out suffix
			# can be toggled with a checkbox.
			10 {
				id = translit
				type = Text
				query = transliteration:%s -typ:wb_berlin -typ:stelle
				queryAlternate.1 = transliteration_nosuffix:%s -typ:wb_berlin -typ:stelle
				noescape = 1
			}
			# Hidden search field for szene ID. Used when clicking on a scene
			# in the temple map.
			30 {
				id = szene
				hidden = 1
				query = szene_uid:%s -typ:wb_berlin -typ:stelle
				type = Text
			}
			# Hidden search field for text type. Used when clicking a text type
			# to find all formular records of that type.
			40 {
				id = texttyp
				hidden = 1
				query = texttyp:%s
				phrase = 1
				type = Text
			}
			# Hidden search field for place name. Used when clicking a place name
			# to find all documents associated with that name.
			50 {
				id = ort
				hidden = 1
				query = ort:%s
				phrase = 1
				type = Text
			}
			# Hidden search field for localisation. Used when clicking a localisation
			# to find all documents associated with it.
			60 {
				id = lokalisation
				hidden = 1
				query = lokalisation:%s
				phrase = 1
				type = Text
			}
		}

		# Set up the correspondence between data fields and query field IDs.
		# Used for creating the links.
		queryFieldForDataField {
			texttyp = texttyp
			ort = ort
			lokalisation = lokalisation
		}

		# Sort by the sort field in the documents.
		# These have differing content depending on their type.
		sort {
			1 {
				id = default
				sortCriteria = sort asc
			}
		}

		# Fields to use for displaying the result list.
		standardFields {
			title = transliteration
			snippet = uebersetzung
		}

		# Facet configuration.
		facets {
			# The typ facet is used for the tabs at the top.
			# It comes with explicit facet queries for the types we want to display.
			# Only the two types we want to display by default are configured here.
			# The remaining types only appear for logged in users and are configured
			# at the end of the file.
			10 {
				id = typ
				excludeOwnFilter = 1
				type = Tabs
				hidden = 1
				# Show »formular« type by default
				selectedByDefault {
					formular = 1
				}
				facetQuery {
					10 {
						id = formular
						query = typ:formular
					}
					20 {
						id = wort
						query = typ:wort
					}
				}
			}
			# There are 8 Chassinat volumes, show all of them.
			20 {
				id = band
				field = band
				sortOrder = index
				displayDefault = 8
			}
			# In case documents on other temples than Edfu are included,
			# add a facet with the temple name.
			30 {
				id = tempel
				field = tempel
				fetchMinimum = 1
			}
		}

		# Configure the fields to highlight.
		highlight {
			default {
				fields {
					f1 = transliteration_highlight
					f2 = uebersetzung
					f3 = texttyp
					f4 = eponym
					f5 = beziehung
					f6 = ort
					f7 = weiteres
					f8 = anmerkung
				}
				# Use a really large fragsize as we have to operate on the results with
				# regular expressions which only works reliably if we are guaranteed to
				# have all opening and closing transliteration brackets in our
				# highlight string
				fragsize = 5000
				useQueryTerms = 0
				useFacetTerms = 0
				alternateFields {
					transliteration = transliteration_highlight
					bandseitezeile = bandseitezeile_highlight
				}
			}
			detail {
				f51 = literatur
				f52 = ortsbeschreibung
				f53 = funktion
				f54 = stelle_anmerkung
				f55 = lemma
			}
		}

		# Configure custom CSS, JavaScript and localisation resources.
		CSSPaths.50 = EXT:find/Projects/edfu/Resources/edfu.css
		JSPaths.50 = EXT:find/Projects/edfu/Resources/edfu.js

		languageRootPath = EXT:find/Projects/edfu/Language/
	}
}


# The default configuration does not show the »gott« and »ort« type records.
# These are only configured for logged in project members.
# TODO: set the number in the [usergroup = 1] line to the id of the Edfu
# frontend user group.
[usergroup = 1]
plugin.tx_find.settings {
	facets.10.facetQuery {
		30 {
			id = gott
			query = typ:gott
		}
		40 {
			id = ort
			query = typ:ort
		}
	}
	additionalFilters {
		3 >
		4 >
	}
}
[global]