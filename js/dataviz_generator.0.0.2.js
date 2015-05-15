////////////////////////////////////////////////////||
// ROB KANDEL  										||
// kandelrob@gmail.com								||
// 													||
// created 04.08.15	| updated 05.15.15				||
// dataviz_generator.js								||
// version 0.0.2									||
////////////////////////////////////////////////////||

var dataviz = (function() {
    var _date_format_list = ['MMM DD, YYYY', 'MMMM DD, YYYY', 'MMM DD, YY', 'MMMM DD, YY', 'ddd MMM DD, YYYY', 'ddd MMMM DD, YYYY', 'ddd MMM DD, YY', 'ddd MMMM DD, YY', 'ddd MMM Do', 'ddd MMMM Do', 'MmM/D/YY', 'MmM/DD/YY', 'MmM/D/YYYY', 'MmM/DD/YYYY', 'MM/D/YY', 'MM/DD/YY', 'MM/D/YYYY', 'MM/DD/YYYY', 'MmM-D-YY', 'MmM-DD-YY', 'MmM-D-YYYY', 'MmM-DD-YYYY', 'MM-D-YY', 'MM-DD-YY', 'MM-D-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD'];
    var _time_format_list = ['hh:mm:ss A', 'hh:mm:ss', 'hh:mm:ss a', 'HH:MM:ss', 'hh:mm A', 'hh:mm a', 'hh:mm', 'HH:MM', 'HH:MM', 'hh:mm:ssA', 'hh:mm:ssa', 'hh:mma', 'hh:mmA'];
    var _number_list = ["All Rows", "1 Row", "2 Rows", "3 Rows", "4 Rows", "5 Rows", "6 Rows", "7 Rows", "8 Rows", "9 Rows", "10 Rows", "11 Rows", "12 Rows", "13 Rows", "14 Rows", "15 Rows", "16 Rows", "17 Rows", "18 Rows", "19 Rows", "20 Rows", "21 Rows", "22 Rows", "23 Rows", "24 Rows", "25 Rows", "26 Rows", "27 Rows", "28 Rows", "29 Rows", "30 Rows", "31 Rows", "32 Rows", "33 Rows", "34 Rows", "35 Rows", "36 Rows", "37 Rows", "38 Rows", "39 Rows", "40 Rows", "41 Rows", "42 Rows", "43 Rows", "44 Rows", "45 Rows", "46 Rows", "47 Rows", "48 Rows", "49 Rows", "50 Rows", "51 Rows", "52 Rows", "53 Rows", "54 Rows", "55 Rows", "56 Rows", "57 Rows", "58 Rows", "59 Rows", "60 Rows", "61 Rows", "62 Rows", "63 Rows", "64 Rows", "65 Rows", "66 Rows", "67 Rows", "68 Rows", "69 Rows", "70 Rows", "71 Rows", "72 Rows", "73 Rows", "74 Rows", "75 Rows", "76 Rows", "77 Rows", "78 Rows", "79 Rows", "80 Rows", "81 Rows", "82 Rows", "83 Rows", "84 Rows", "85 Rows", "86 Rows", "87 Rows", "88 Rows", "89 Rows", "90 Rows", "91 Rows", "92 Rows", "93 Rows", "94 Rows", "95 Rows", "96 Rows", "97 Rows", "98 Rows", "99 Rows", "100 Rows"];
    var _minutes_list = ['2 minutes', '3 minutes', '4 minutes', '5 minutes', '10 minutes', '15 minutes', '20 minutes', '25 minutes', '30 minutes', '35 minutes', '40 minutes', '45 minutes', '50 minutes', '55 minutes', '60 minutes', '120 minutes', '180 minutes', '240 minutes', '300 minnutes'];
    var _table_styles = _tablebuilder_styles;
    var _custom_styles = jQuery.extend(true, {}, _tablebuilder_styles, {});
    var _save_flag = false;
    var _tool_src = false;
    var _google_src = false;
    var _update_tool = false;
    var _update_src = false;
    var _updated_settings = {};
    var _version_num = '0.0.5';
    var _current_state = 'home';
    var _last_type;
    if ( ! window.console ) console = { log: function(){} };
    var method = {
        home: {
            init: function() {
            	window.onkeydown = function(e) {
    				if(e.keyCode == 32 && e.target == document.body) {
				        e.preventDefault();
				        return false;
				    }
				};
				jQuery('.menuButton').on('click', function() {
        			if (jQuery(this).hasClass('navIconActive')) { 
        				jQuery(this).removeClass('navIconActive');
	        			jQuery('#nav_list').removeClass('navListWrapperActive');
    	    		} else { 
        				jQuery(this).addClass('navIconActive');
        				jQuery('#nav_list').addClass('navListWrapperActive');
        			}
	        	});
                jQuery('.homeButtonData').each(function() {
                    jQuery(this).on('click', function() {
                    	method.home.to_data_setup();
                    	method.home.toggle_nav_buttons('data')
                    });
                });
                jQuery('.homeButtonDataStart').on('click', function() {
                    method.home.to_data_setup();
                    method.home.toggle_nav_buttons('data')
                });
                jQuery('.homeButtonDataDemo').on('click', function() {
                	method.home.to_data_setup();
                	jQuery('input[data-role="google_spreadsheet_url"]').val('https://docs.google.com/spreadsheets/d/17rvg3l7Yq6zaB7mgeMExbygNy0LkZYS7C6cpDTixNQo/pubhtml');
		        	jQuery('.googleCreate').addClass('googleCreateActive')
		        	jQuery('.toolTabActive').removeClass('toolTabActive');
                	jQuery('div[data-role="create_tab_google"]').addClass('toolTabActive');
                	jQuery('.createToolActive').removeClass('createTool').slideUp(150);
                	jQuery('div[data-role="create_tool_google"]').addClass('createToolActive').slideDown(150);
                    method.home.toggle_nav_buttons('data');
                });
                jQuery('.optionWrapper').find('.stateButton').each(function() {
                	jQuery(this).on('click', function() {
                		var _state = jQuery(this).attr('data-role').split('state_')[1];
                		method.home.toggle_nav_buttons(_state);
                		if (_state == 'data') {
                			method.home.to_data_setup();
                		} else if (_state == 'code') {
                			method.home.validate_src_test(true);
                		} else if (_state == 'theme') {
                			method.home.validate_src_test(false);
                		} else if (_state == 'help') {
                			method.home.to_help_setup();
                		}
                		_current_state = _state;
                	});
                });
            },
            to_data_setup: function() {
            	var _init = jQuery('*[data-role="data_wrapper"]').attr('data-init');
            	if (typeof(_init) === typeof(undefined) || _init === false) {
            		jQuery('*[data-role="google_spreadsheet_url"]').val('Paste published Google Spreadsheet URL here');
	            	_tool_src = '';
            		jQuery('*[data-role="google_spreadsheet_url"]').on('focus', function() {
            			if (jQuery(this).val() == 'Paste published Google Spreadsheet URL here') {
            				jQuery(this).val('') 
            			}
            		}).on('blur', function() {
            			if (jQuery(this).val() == '') {
            				jQuery(this).val('Paste published Google Spreadsheet URL here') 
            				_google_src = false;
            			}
             		}).on('keyup', function(event) {
                    	if (event.keyCode == 13) {
                        	jQuery('.googleCreate').click();
                    	}
                    	if (jQuery(this).val() != 'Paste published Google Spreadsheet URL here' && jQuery(this).val() != '') {
                    		if (!jQuery('.googleCreate').hasClass('googleCreateActive')) {
                    			jQuery('.googleCreate').addClass('googleCreateActive')
                    		}
                    	} else {
                    		if (jQuery('.googleCreate').hasClass('googleCreateActive')) {
                    			jQuery('.googleCreate').removeClass('googleCreateActive');
                    		}
                    	}
                	});
                	jQuery('.googleCreate').on('click', function() {
                		if (jQuery('*[data-role="google_spreadsheet_url"]').val().indexOf('docs.google.com/') != -1 || jQuery('*[data-role="google_spreadsheet_url"]').val().indexOf('spreadsheets.google.com/') != -1) {
        					_tool_src = jQuery('*[data-role="google_spreadsheet_url"]').val();
			        		_google_src = true;
			        		if (_update_tool) {
			        			if (typeof(_updated_settings) == 'string') {
				        			_updated_settings = JSON.parse(_updated_settings);
				        		}
			        			_updated_settings['src'] = jQuery('*[data-role="google_spreadsheet_url"]').val();
			        		}
			        		method.home.toggle_nav_buttons('code');
		        			method.home.to_tool_setup();
			        	} else {
			        		alert ('That is not a valid Google Spreadsheet URL')
			        	}
                	});
                	jQuery('.csvCreate').on('click', function() {
                		try {
							method.home.csv_to_json(JSON.parse(jQuery('.dragDropDataText').html()))
			        	} catch(err) {
			        		alert('Sorry, there is a problem with your CSV file')
			        	}
                		
                	});
                	jQuery('.updateCreate').on('click', function() {
                		jQuery('.containerUpdateModal').addClass('hiddenContainer');
                		var _data = JSON.parse(_updated_settings);
                		jQuery('div[data-role="create_tab_update"]').addClass('hiddenContainer');
						if(jQuery('#update_modal_existing_true').is(':checked')) {
							jQuery('div[data-role="create_tab_'+((typeof(_data['src']) == 'string') ? 'google' : 'csv')+'"]').click();
	                		if (typeof(_data['src']) == 'string') {
    	            			jQuery('input[data-role="google_spreadsheet_url"]').val(_data['src']);
        	        			jQuery('.googleCreate').addClass('googleCreateActive');
            	    		} else {
                				jQuery('.dragDropDataText').html(JSON.stringify(_data['src']['data']));
                				jQuery('.dragDropInfo').addClass('hiddenContainer');
                				jQuery('.csvCreate').removeClass('hiddenContainer');
                				jQuery('.switchCSV').removeClass('hiddenContainer');
	                		}
    	            		method.home.csv_to_json(_data);		
						} else {
							jQuery('div[data-role="create_tab_google"]').click();
							_update_src = true;
						}
                	});
                	jQuery('.toolTab').each(function() {
                		jQuery(this).on('click', function() {
                			jQuery('.toolTabActive').removeClass('toolTabActive');
                			jQuery(this).addClass('toolTabActive');
                			jQuery('.createToolActive').removeClass('createTool').slideUp(150);;
                			jQuery('div[data-role="create_tool_'+jQuery(this).attr('data-role').split('create_tab_')[1]+'"]').addClass('createToolActive').slideDown(150);
                		});
                	});
                	jQuery('.importFile').on('click', function() {
                		document.getElementById("import_file_select").click();
						document.getElementById("import_file_select").addEventListener('change', method.home.handle_file_selection, false);
                	});
                	jQuery('.switchCSV').on('click', function() {
                		jQuery('div[data-role="create_tool_csv"]').find('.dragDropInfo').removeClass('hiddenContainer');
			        	jQuery('div[data-role="create_tool_csv"]').find('.dragDropDataText').addClass('hiddenContainer');
			        	jQuery('.switchCSV').addClass('hiddenContainer');
			        	jQuery('.csvCreate').addClass('hiddenContainer');
                	});
                	document.getElementById('drag_drop_data_csv').addEventListener('dragover', method.home.handle_drag_over, false);
            		document.getElementById('drag_drop_data_csv').addEventListener('dragend', method.home.handle_drag_out, false);
            		document.getElementById('drag_drop_data_csv').addEventListener('dragleave', method.home.handle_drag_out, false);
            		document.getElementById('drag_drop_data_csv').addEventListener('drop', method.home.handle_file_selection, false);
            		document.getElementById('drag_drop_data_update').addEventListener('dragover', method.home.handle_drag_over, false);
            		document.getElementById('drag_drop_data_update').addEventListener('dragend', method.home.handle_drag_out, false);
            		document.getElementById('drag_drop_data_update').addEventListener('dragleave', method.home.handle_drag_out, false);
            		document.getElementById('drag_drop_data_update').addEventListener('drop', method.home.handle_file_selection_update, false);
            		jQuery('*[data-role="data_wrapper"]').attr('data-init', 'true');
            	}
            },
        	handle_drag_over: function(evt) {
            	jQuery('*[data-role="drag_drop_data_csv"]').addClass('dragDropDataOver');
            	jQuery('*[data-role="drag_drop_data_update"]').addClass('dragDropDataOver');
            	evt.stopPropagation();
	            evt.preventDefault();
    	    }, 
	        handle_drag_out: function(evt) {
    	        jQuery('*[data-role="drag_drop_data_csv"]').removeClass('dragDropDataOver');
    	        jQuery('*[data-role="drag_drop_data_update"]').removeClass('dragDropDataOver');
        	    evt.stopPropagation();
            	evt.preventDefault();
        	},         
	        handle_file_read_abort: function (evt) {
    	        alert("File read aborted.");
        	},
 
	        handle_file_read_error: function(evt) {
    	        var message;
        	    switch (evt.target.error.name) {
            	    case "NotFoundError":
                	    alert("The file could not be found!");
                    	break;
	                case "SecurityError":
    	                message = "A file security error occured. This can be due to:";
        	            message += "Accessing certain files deemed unsafe for Web applications.";
            	        message += "The file has changed on disk since the user selected it.";
                	    alert(message);
                    	break;
	                case "NotReadableError":
    	                alert("The file cannot be read. This can occur if the file is open in another application.");
        	            break;
                	case "EncodingError":
            	        alert("The length of the data URL for the file is too long.");
                    	break;
	                default:
    	                alert("File error code " + evt.target.error.name);
        	    }
        	},
	        start_file_read: function(fileObject) {
    	        var reader = new FileReader();
        	    if (fileObject.type.match('text/csv') || fileObject.name.substr(fileObject.name.length - 3) == 'csv' || fileObject.name == 'TableBuilder_config.json') {
            	    reader.onloadend = method.home.display_file_text; 
	            }
            	reader.onerror = method.home.handle_file_read_error;
	            if (fileObject) {
    	            reader.readAsText(fileObject);
        	    }
	        },
    	    handle_file_selection: function(evt) {
    	    	evt.stopPropagation();
			    evt.preventDefault();
        	    jQuery('*[data-role="drag_drop_data_csv"]').removeClass('dragDropDataOver');
        	    jQuery('*[data-role="drag_drop_data_update"]').removeClass('dragDropDataOver');
            	method.home.drag_drop_file(evt, false);
            	if (_update_tool) {
            		_update_src = true
            	}
	        }, 
	        handle_file_selection_update: function(evt) {
        	    jQuery('*[data-role="drag_drop_data_update"]').removeClass('dragDropDataOver');
        	    jQuery('*[data-role="drag_drop_data_csv"]').removeClass('dragDropDataOver');
        	    method.home.drag_drop_file(evt, true);
        	    _update_tool = true;
        	},
        	drag_drop_file: function(evt, bool) {
            	evt.stopPropagation();
	            evt.preventDefault();
    	        if (evt.type.toString().toLowerCase() == 'change') {
        	        var files = evt.target.files;
            	} else {
                	var files = evt.dataTransfer.files;
	            }
    	        if (!files) {
        	        alert("At least one selected file is invalid - do not select any folders.</p><p>Please reselect and try again.");
            	    return;
	            }
            	for (var i = 0, file; file = files[i]; i++) {
                	if (!file) {
                    	alert("Unable to access " + file.name);
	                    return false
    	            }
        	        if (file.size == 0) {
            	        alert(file.name.toUpperCase() + " is empty");
                	    return false
	                }
    	            if (file.size >= 1048576) {
        	            alert(file.name.toUpperCase() + " is too big. Files must be under 1MB");
            	        return false
                	}
                	if (bool) {
                		if (file.name != 'TableBuilder_config.json'){
    	    	            alert("Please upload TableBuilder_config.json or create a new table");
        	    	        return false
            	    	}
                	} else {
	    	            if (!file.type.match('text/csv') && file.name.indexOf('.csv') == -1){
    	    	            alert(file.name.toUpperCase() + " is not a csv, please only select a csv file");
        	    	        return false
            	    	}
            	    }
    	            method.home.start_file_read(file);
        	    }
	        },  
    	    display_file_text: function(evt) {
    	    	try {
    	    		if (!_update_tool || _update_src) {
		        		jQuery('div[data-role="create_tool_csv"]').find('.dragDropInfo').addClass('hiddenContainer');
			        	jQuery('div[data-role="create_tool_csv"]').find('.dragDropDataText').removeClass('hiddenContainer').html(JSON.stringify(method.parse_csv.init(evt.target.result)));
	        			jQuery('div[data-role="create_tool_csv"]').find('.csvCreate').removeClass('hiddenContainer');
	        			jQuery('.switchCSV').removeClass('hiddenContainer');
	        		} else {
	        			_updated_settings = evt.target.result;
	        			jQuery('div[data-role="create_tab_update"]').addClass('hiddenContainer');
	        			if (typeof(_updated_settings) == 'string') {
		        			_updated_settings = JSON.parse(_updated_settings);
		        		}
		        		if(typeof(_updated_settings.src) == 'string') {
		        			jQuery('input[data-role="google_spreadsheet_url"]').val(_updated_settings.src);
		        			jQuery('.googleCreate').addClass('googleCreateActive')
		        			jQuery('.toolTabActive').removeClass('toolTabActive');
                			jQuery('div[data-role="create_tab_google"]').addClass('toolTabActive');
                			jQuery('.createToolActive').removeClass('createTool').slideUp(150);;
                			jQuery('div[data-role="create_tool_google"]').addClass('createToolActive').slideDown(150);
		        		} else {
		        			jQuery('div[data-role="create_tool_csv"]').find('.dragDropInfo').addClass('hiddenContainer');
				        	jQuery('div[data-role="create_tool_csv"]').find('.dragDropDataText').removeClass('hiddenContainer');
		    		    	jQuery('div[data-role="create_tool_csv"]').find('.dragDropDataText').html(JSON.stringify(_updated_settings.src.data));
	    	    			jQuery('div[data-role="create_tool_csv"]').find('.csvCreate').removeClass('hiddenContainer');
	    	    			jQuery('.switchCSV').removeClass('hiddenContainer');
	    	    			jQuery('.toolTabActive').removeClass('toolTabActive');
                			jQuery('div[data-role="create_tab_csv"]').addClass('toolTabActive');
                			jQuery('.createToolActive').removeClass('createTool').slideUp(150);;
                			jQuery('div[data-role="create_tool_csv"]').addClass('createToolActive').slideDown(150);
		        		}
	        			//jQuery('.containerUpdateModal').removeClass('hiddenContainer');
	        		}
	        	} catch(err) {
		        	alert('Sorry, there is a problem with your '+((_update_tool) ? 'TableBuilder_config.json' : 'CSV')+' file')
		        	jQuery('div[data-role="create_tool_'+((_update_tool) ? 'update' : 'csv')+'"]').find('.csvCreate').addClass('hiddenContainer');
		        	jQuery('.switchCSV').addClass('hiddenContainer');
	        	}
	        },	
	        csv_to_json: function(a) {
	        	if (!_update_tool || _update_src) {
	        		_google_src = false;
		        	_tool_src = a;
		        	if (_update_src) {
		        		if (typeof(_updated_settings) == 'string') {
		        			_updated_settings = JSON.parse(_updated_settings);
		        		}
			        	_updated_settings['src'] = {data: a};
			        	if (jQuery.isEmptyObject(jQuery('#the_table_wrapper').data())) {
				        	_updated_settings['external_data'] = false;
				        } else {
				        	method.table.update_table_options({
                           		'external_data': false
                        	});
				        }
		        	}
        		} else {
        			if (typeof(_updated_settings) == 'string') {
		        		_updated_settings = JSON.parse(_updated_settings);
		        	}
		        	if (jQuery.isEmptyObject(jQuery('#the_table_wrapper').data())) {
				        _updated_settings['external_data'] = false;
				    } else {
				        method.table.update_table_options({
                           	'external_data': false
                        });
				    }
        			_tool_src = ((typeof(_updated_settings['src']) == 'string') ? _updated_settings['src'] : _updated_settings['src']['data']);
        			_update_src = true;
        		}
        		method.home.toggle_nav_buttons('code');
        		method.home.to_tool_setup();
        	},
        	validate_src_test: function(a) {
        		if (!_tool_src) {
        			method.home.toggle_nav_buttons('data');
        			method.home.to_data_setup();
        			alert('Please enter data to get started')
        		} else {
        			if (!a) {
        				method.home.toggle_nav_buttons('theme');
	        			method.home.to_theme_setup();
        			} else {
        				method.home.toggle_nav_buttons('code');
        				_update_src = true;
	        			method.home.to_tool_setup();
        			}
        		}
        	},
            to_tool_setup: function() {
            	jQuery('.containerEditorWrapper').removeClass('hiddenContainer');
            	jQuery('*[data-role="editor_buttons_style"]').addClass('hiddenContainer');
            	jQuery('*[data-role="options_holder_style"]').addClass('hiddenContainer');
            	jQuery('*[data-role="editor_buttons_table"]').removeClass('hiddenContainer');
            	jQuery('*[data-role="options_holder_table"]').removeClass('hiddenContainer');
            	var _flag = true;
            	jQuery('#the_table_wrapper').on('build_complete.dataviz.table_builder', function(e) {
            		for (i in e.relatedTarget._header_list) {
            			if (_flag) {
	            			jQuery('#tool_style_column_width').append('<option value="'+i+'">'+e.relatedTarget._header_list[i].replace(/--/g,	 ' ')+'</option>');
    	        			jQuery('#sort_type').append('<option value="'+i+'">'+e.relatedTarget._header_list[i].replace(/--/g, ' ')+'</option>');
        	    			jQuery('#sort_column').append('<option value="'+i+'">'+e.relatedTarget._header_list[i].replace(/--/g, ' ')+'</option>');
            				jQuery('#format_column_number').append('<option value="'+i+'">'+e.relatedTarget._header_list[i].replace(/--/g, ' ')+'</option>');
            			}
            		}
            		_flag = false;
				}).on('data_type.dataviz.table_builder', function(e) {
					_last_type = e.action.value.type
				});
            	if (jQuery.isEmptyObject(jQuery('#the_table_wrapper').data())) {
            		dataviz.tool_setup.init('table');
            		if (!_update_tool) {
		            	jQuery('#the_table_wrapper').table_builder({
							'src' : ((_google_src) ? _tool_src : {data: _tool_src}),
	                    	'external_data': ((_google_src) ? true : false)
						});	
					} else {
						if (typeof (_updated_settings) == 'string') {
							_updated_settings = JSON.parse(_updated_settings);
						}
						var _updated_styles = ('default_styles' in _updated_settings) ? _updated_settings.default_styles : '';
						delete _updated_settings.default_styles;
						method.table.update_options(_updated_settings);
						method.table.update_styles(_updated_styles);
						jQuery('#the_table_wrapper').table_builder(_updated_settings);
					}
					jQuery('div[data-role="create_tab_update"]').addClass('hiddenContainer');
				} else {
					method.table.update_table_options({
                    	'src': ((_google_src) ? _tool_src : {data: _tool_src}),
                    	'external_data': ((_google_src) ? true : false)
                    });
                    jQuery('#the_table_wrapper').table_builder('refresh_data');
                    _flag = true;
                    jQuery('#tool_style_column_width').empty().append('<option value="">Select Column</option>');
    	        	jQuery('#sort_type').empty().append('<option value="">Select Column</option>');
        	    	jQuery('#sort_column').empty().append('<option value="null">No column</option>');
            		jQuery('#format_column_number').empty();
				}
				var _init = jQuery('*[data-role="code_wrapper"]').attr('data-init');
            	if (typeof(_init) === typeof(undefined) || _init === false) {
					dataviz.table.text();
					dataviz.table.styles();
					jQuery('*[data-role="code_wrapper"]').attr('data-init', 'true');
            	}
            },
            to_theme_setup: function() {
            	jQuery('.containerEditorWrapper').removeClass('hiddenContainer');
            	jQuery('*[data-role="editor_buttons_style"]').removeClass('hiddenContainer');
            	jQuery('*[data-role="options_holder_style"]').removeClass('hiddenContainer');
            	jQuery('*[data-role="editor_buttons_table"]').addClass('hiddenContainer');
            	jQuery('*[data-role="options_holder_table"]').addClass('hiddenContainer');
            	if (jQuery.isEmptyObject(jQuery('#the_table_wrapper').data())) {	
					dataviz.tool_setup.init('table');
					if (!_update_tool) {
		            	jQuery('#the_table_wrapper').table_builder({
							'src' : ((_google_src) ? _tool_src : {data: _tool_src})
						});	
					} else {
						if (typeof(_updated_settings) == 'string') {
							_updated_settings = JSON.parse(_updated_settings);
						}
						jQuery('#the_table_wrapper').table_builder(_updated_settings)
						var _updated_styles = ('default_styles' in _updated_settings) ? _updated_settings.default_styles : '';
						delete _updated_settings.default_styles;
						method.table.update_options(_updated_settings);
						method.table.update_styles(_updated_styles);
					}
				} else {
					method.table.update_table_options({
                    	'src': ((_google_src) ? _tool_src : {data: _tool_src})
                    });
                    //jQuery('#the_table_wrapper').table_builder('refresh_data_source', true);
				}
            },
            to_help_setup: function() {
            	var _init = jQuery('*[data-role="help_wrapper"]').attr('data-init');
            	if (typeof(_init) === typeof(undefined) || _init === false) {
					dataviz.home.help_toggle();
					jQuery('*[data-role="help_wrapper"]').attr('data-init', 'true');
            	}	
            },
            help_toggle: function() {
            	jQuery('.containerFAQ').each(function() {
            		jQuery(this).on('click', function() {
	            		jQuery('.containerFAQActive').removeClass('containerFAQActive')
            			if(!jQuery(this).hasClass('containerFAQActive')) {
            				jQuery(this).addClass('containerFAQActive');
            			}
            		});
            	})
            },
            toggle_nav_buttons: function(a) {
            	(a == 'home') ? jQuery('*[data-role="state_home"]').addClass('hiddenContainer') : jQuery('*[data-role="state_home"]').removeClass('hiddenContainer');
            	if (a == 'home') { 
            		jQuery('#tbTest').table_builder({"src":"https://docs.google.com/spreadsheets/d/17rvg3l7Yq6zaB7mgeMExbygNy0LkZYS7C6cpDTixNQo/pubhtml?gid=0&single=true","external_data":true,"sort_column":"4","visible_rows": 5,"visible_row_options": [5,10,15,'all'],"table_source": 'https://www.mockaroo.com/', "table_source_link":'https://www.mockaroo.com/'})
            	} else if (jQuery('#tbTest').data('dataviz.table_builder')) {
            		jQuery('#tbTest').table_builder('destroy');
            	}
            	if (a != 'code' && a != 'theme') {
            		jQuery('.toolOptionsUnitWrapper').each(function() {
            			jQuery(this).addClass('toolOptionsUnitHidden');
            		});
            		jQuery('.editorButtonActive').removeClass('editorButtonActive');
            		jQuery('.tableBuilderHeaderWrapperFixed').addClass('hiddenContainer');
            	} else {
            		jQuery('.tableBuilderHeaderWrapper').removeClass('hiddenContainer');
            	}
            	jQuery('.stateButtonActive').removeClass('stateButtonActive');
            	jQuery('*[data-role="state_'+a+'"]').addClass('stateButtonActive');
            	var _counter = -(jQuery('*[data-role="state_'+a+'"]').attr('data-index'));
            	jQuery('section').each(function() {
            		jQuery(this).css({
            			'top': (((a == 'help') ? (_counter + 1) : _counter) * 100) + '%'
            		});
            		_counter ++;
            	})
            }
        },
        download: {
        	get_external: function(a,b,c) {
	        	jQuery.ajax({
					url: b[parseFloat(c)],
					dataType: 'text', //((b[parseFloat(c)].substr(0, 2) == 'js') ? "script" : 'text'),
					success: function(data) {
						a.file(b[parseFloat(c)], data);
						jQuery('.containerPreloaderModal .listExplainer').append('<li class="listItem"><span class="listItemSymb"><i class="fa fa-check-circle"></i></span>'+b[parseFloat(c)]+'</li>');
						(c < b.length-1) ? method.download.get_external(a,b,(c + 1)) : method.download.finished(a);
					},
					error: function(data) {
						jQuery('.containerPreloaderModal .listExplainer').append('<li class="listItem"><span class="listItemSymb" style="color:#a94442"><i class="fa fa-times-circle"></i></span>'+b[parseFloat(c)]+'</li>');
						(c < b.length-1) ? method.download.get_external(a,b,(c + 1)) : method.download.finished(a);
					}
				});
        	},
        	finished: function(a) {
        		a.file("TableBuilder.html", method.download.write_html());
        		var _js = method.table.output_custom_settings(true);
        		var _css = method.table.output_custom_styles(true);
        		var _output = JSON.parse(_js);
        		_output['default_styles'] = _css;
        		a.file("TableBuilder_config.json", JSON.stringify(_output, null, '').replace(/\[[^\]]*?\]/g, function(g0, g1) {return g0.replace(/\t/g, '').replace(/\n/g, '').replace(/\r/g, '');}));
				a.file("css/images/table_builder_preloader.gif", 'R0lGODlhgACAAKEAADR6tGyizJS63P///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBwADACwAAAAAgACAAAAC55yPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+f0uv2Oz+v3/L7/DxgoOEhYaHiImKi4yNjo+AgZKTlJWWl5iZmpucmJGQAAGio6Slpqeoo6KmD0mer6Cnu6WtQaa3uLOktUi9vrqzvE6zscCywkTJycy6rcnGochOw8DQANJE3dbP2DnZ287dPtPQzeIz7eW85zjn6rvsPeXtxJX29/j5+vv8/f7/8PMKDAgZUKAAAh+QQJBwAJACwAAAAAgACAAIM0erSUutzE2uzk7vTU4uxsosysyuTs8vTU5vT///8AAAAAAAAAAAAAAAAAAAAAAAAE/jDJSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ5nAgaio6SlpqeoqaqlBFIFALCxsrO0tba3uLMBrrm9vr+4u1GvwMXGucJQxADMzc7P0NHS09TNyU/L1drb3NHXTtnd4uPS303h5Onk5kzo6u/b7Evu8PXlvPb51PJK9Pr6/JL4+2cvIJKBBOEZPIIwobqFRho6XIdv4j+IRSRa7IaRiMaNbvEqgqzXccjHkftEonyociXFYS4VtozJcSbNkDBvvlSmcye2nuNKCjkJVGgQoj2NAkGqU+kPpjed+oBKU2oPqjGt8sDqUusOriu96hhAoGxZAQTQqk3Ldq3btnDfyo0b98Cnu3jz6t3Lt6/fExEAACH5BAkHAAMALAAAAACAAIAAAAL+nI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoGBQAoLjI2Oj4CBkp2ShglDiJmakZWVl0uQkaKtlJ9Cl6iko6ZIrauqkqxOo6O2pJezsJi4jL+6gLJNuL+/sTLExL7GN87Jrcs8ycahvN68wDTR1qvYOd/TrtPbut0x2OOZ5Tbl7rud4M7i6KjqMe7zh/U2/PiG+jv6+oX41/AAXSILjP4AyE9hTKYBjPYQyI7iTCoLjO4gt+jOY0uuAYzmMLkN5EsiCZzeQKlNRUqmAZzWUKmMxkoqB5zOYJnMJ0muDZy2cJoNXgAcwklATRYUaP5mrqlBPUqL6mUqVk9eqipCOW3uIqwiuyrFoBgA0hVhxZrWdBpH3XrqzUuHKr0q2L9S7erWuvtv3wttVfD4Gl6d1r1kgBACH5BAkHAAUALAAAAACAAIAAgjR6tJS63GyizEyKvLTO5P///wAAAAAAAAP+WLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKRQIAjo+QkZKTlJWWkQFKjZecnZ6VmUmbn6SllqFIo6arrKhHqqyxn65GsLK3p5q4u5e0jLzAk75EtsG8w0PFxrjIQsrLss1Bz9CtutXA0kDU2KXaP9zds9fit98+4eWc5z3p6rmi79Hk8qbsPO71kvc7+fqQ/HT4++coYI6BBA3iQPhP4Q2G+lwRIFhqAMR6EimSsqiXcdyCiR07cQy5jgFIkpZGogRlcmXKi/IyuqSkciamljYnwXwnMyekmj4B9AwKAKjPoUR3qkPq02hOpj6VloNq06lNqjalinNoQ2s3rjW8YgNLQ2w1sjPMQkMrQ+0ytjHcGoMLQ24wui/sZqMXFK8Lvcf4HhX8lPBVwzP9tgC8SzELxswQu3S8ArI5ySspq7A8Lx7RgkoSAAAh+QQJBwAKACwAAAAAgACAAIM0erSsyuTU5vRsosz09vzk7vRMiry0zuTc5vSUutz///8AAAAAAAAAAAAAAAAAAAAE/lDJSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjo+QkZJNAwCWl5iZmpucnZ6ZCVKVn6Slpp2hUaOnrK2eqVCrrrO0sE+ytLmntk64ur+vosDDn7yUxMibxky+ycTLS83OwNBK0tO61UnX2LXC3cjaSNzgrbYIAenq6+zt7u/w8ewH5OW7FAf2wwb1+qS2+fzp4icwG76CuQginAVw4SyFDlnZChCxFcSKpRpiNHVxY7AJ1xQ9lurnUaNITx1PapqoEiXJjSZbbnqJkaXMTSlvAoip01LOmzZ7YqJZkWfPnzKDCrVENKJRnUhbKl3a1OHTm1FVThVadeFVmVlPbu3ZFeHXlmFFjtVZtuBZlWlLUgi5lGldS29PxoU5967du3lF7q3Z129bgYE9Di5a+O5hf4k3LnbauO5jfZExTrZamarfzBU3e6VQAIGA06hPH0i9GnVr1axju5YNe3ZqAZftiTuSu9xuI73B/S4SvNtwIsWxHR+SfNpyIc2dPQ8SPdl0INXDfat7/UcEACH5BAkHAAUALAAAAACAAIAAgjR6tJS63GyizEyKvLTO5P///wAAAAAAAAP+WLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKRQIAjo+QkZKTlJWWkQEMBJecnZ6WA42fo6SXmQubpaqrjqGsr6SnCqmwtZeutrmUsgW0ur+tosDAvL7DubjHusXKv8nNtczQts/TrNLWsMLZq9jcqtXfo97io+HlneTontvr6Zru5u3xlur0lfP3k/b6kef9kPgBfJRvoCOBA/8ZRDiw4EJ4BicpHMgQoEOKECP6uwi7sGI/jv083pvYMaNGSCD1iaRHMqTJk45S3lsZr6XKlzBl0qPpzuZMnCd1xuO5zudOoBqFuiOKzuhQpBGVrmNazulSqAaloqMqzupUrA1hBgTbz+tWsh/FPuL6zWw5tt+0vkU7Uq44uNzsfsNrze1duvf0cuM7ze9ewPQEZyMMzfBgxPEUW2PczPFiyO4kT6OszPJkzOs0Q+N8zPNm0OhENyM9zPRo1OVUK2MNzPVq2OJkH6PtTPcw3r8SAAAh+QQJBwAJACwAAAAAgACAAIM0erSUutzU4uxsosysyuRMirzk7vSErtS0zuT///8AAAAAAAAAAAAAAAAAAAAAAAAE/jDJSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7V4MhLB4TC6bz+g0GSFFAN7wuHxOr9vv8kIbz+/773pRbn+EhXiBUIOGi4wAiE+KjZJ+j06Rk5h2lU2XmZ5xm0ydn6R7pKdvoUujqJOqSqytkqaynq9JsbWGt0gCB7+/AwfCxMPGxcjHysnMy8q/XtHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PU9A7qeARS5+X8F+PxN2jehn0A+AA9KIijBoEJNAR8aYpjAocQ5CS8WomhRI5yM/h79cAz5LyJJPCNPIjSpsk7KlndYwpRzgN9MiDdd2syJUSbPmgV50vGZ86XQVERvAm14VE7SmUsrNv34FGbUjiSrtrw6FWlXAFy/alUZdirIpmWnjj2Z9ujZo22PriUZl+dboXV5zg2Z9+bdnzu77vXYd+bfnIVnDtaYuOVhpYHVfm2s8jHUyE0XX6R80rJVzHIng7arWSLnk6Ufng7peetovaKDdm1N9nXO1ApXe6TN1vZN3Ad1a+RN17fi2ExnAxcoXONyf80lEudrHObzfNEfTidcveV1XdkVbmfcXeX3WuEPjt9cHjVyqcrfYw15XlZ6getNt88q/2t+1fvRCNdffF3dJ1AEACH5BAkHAAcALAAAAACAAIAAgjR6tJS63GyizNTi7EyKvLTO5ISu1P///wP+eLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987/9Ax8BALBqPyKRyyTwGgpECYEqtWq/YrHZrJUAhUq54TNZ6v45wec3entEMdXtOf8MVcrq+bL/n94Bud3GBhVx9cH+Gi1ODC4qMhYhokJGAk1+VlnuOeJuRmFCan3OdB6Oka6FBqKllpq2uYqtAsbJcsLeXubqcnba9V7Q/wMFWvMZswz7FyY2/zsrI0WTT1IfW11vZ2ljLPc3O3N1d4+RV5ucA3zzhyenn7DvuxvDk8qb5+vv8/f7/AAMKHEiwoMGDCBMqXMiwocOHECNKnHhHgDotTx5dzEL+wOLGKxk9fezicSSVkKdMVumo8iShlutKqkRJrxdLmDRhxtSZE+bNlj1hyjRp4GXLnzONqkRKVKnKoSODLoX6sahGnVQ3WhV5NOvFrSmx6gRbUxfTkWR1AvCqLq1PtufcCh3rdOTZqnVHwiUndyrdq3Nh9jV5V2vej3u7DbabWNtivX+5+hV8eGPja483Fv5a+eJlapkvbm7bWd3naKHVjY5b+txpZ6njvU4W23XksF1vl9U121jtbqv5tibXO9hvbcEVD+9WvNfxa8kdL9fWXNdzatExT79W/db1aNlBb6fWXdZ3Z+FRj49W3tX5ZOlhr3fWPtV7Y/Fpz09Wn9Qd/WD5+bafMf198p9NBW5yYC8JWrLgLQEaN2AwCQAAIfkECQcACgAsAAAAAIAAgACDNHq0tM7kbKLM3Ob0TIq81Ob0xNrslLrc9Pb8XJLE////AAAAAAAAAAAAAAAAAAAABP5QyUmrvTjrbZL/YCiOZGmGwqaubKsEQCzPdG3feE4Tbu+3MJ1wSMTxfshkJVhsOnNHpfTHfFqv0amWVb16i9mtONP9mqHjNPnM1oXV8HJ7HoPbJ3I6+30X5/VmfH1af4Bfg3GGeoKISoWKVo1pj5BNjJJUlXOYfpp7nFuUnkOghKOBpVOipzmpUqusNpeuKrCxNbRJtrcys7lrvE+/mcGWwz67xcc9yby+yxTNvNBAxcbUK9K32NnWYNy13kXgG9qsz9jmrOQa6qPo1O6j7MDibvQY8p74F/qV8ND8VeJnQaAigMsMKiK4xJ4QhMcUGmIYzeE9ihIkAsKY0SIajv4a9XB84dHIyJB0Tpa8AXEYyk0gV8pSKRNXzJozWv562YYmzhg6c/Fk4/NnUFpDzxTFedQVggJQCxiQaqCq1atYs2rdyjWr1AEjw4odS7as2bNoNQj4KeNARbYACKyF6xYP3Lhz2dbtCFfu3b0k++b9CTjpF79037JFrFex0cE4C98FALmmZMF/HTOtLPMyXM4rPT/ObPcu6JKiN5Pm+3l14MWnPabGGdvibJmMCWum7dqwl9yRd9es7fD2SuCWhcskbs94SeSdla9kLs65R+ihpZek7s26ReyotXvkbs27Q/CyxVskX8y8PfS21TtkH8y9OPjF5dujz8u+N/zN6XknDn+3+GcNgNUJ6A2BsRhYDILdKWgNg6w4GAyE5UlYDIWnWOgMh6N4yAuInogYC4btaRgMiZqYeA6LlbjICoyQyPgOjYrYOAqOhuioCYr1qThib3cB2Z+Qt/AIiI//KKkHk5U4SQeUB0k5B5WKWNkGloAYWSCSsUQAACH5BAkHAA8ALAAAAACAAIAAgzR6tKzG5NTi7GyizLzW7PT2/EyKvLTO5Nzm9ISu1KzK5NTm9MTa7FySxJS63P///wT+8MlJq704682a/2AojmRphsOmrmz7HEAsz3Rt33hOG27vtzCdcEjE8X7IZCVYbDpzR6X0x3xar9GpllW9eovZrTjT/Zqh4zT5zNaF1fByex6D2ydyOvt9F+f1Znx9Wn+AX4NxhnqCiEqFilaNaY+QTYySVJVzmH6ae5xblJ5DoISjgaVToqc5qVKrrDaXriqwsTW0Sba3MgYMCsDBwsPExcbHyMMCFLu8MQPOTg7M0ZbQ1UTTeNhF19w62hLNvAbe3zjhL+dC5us16eO35e7o1PQ37fcx8Po18/0z+AGckU9fAnsDAfxLKDAhgIL3Dm5zuHBgw4QQ6UkU51BhgAT+IBMMEElypMmSKE+qTMlypcsEBBAmzIUkXqxZNDHYjJXTx85TOHsu6QhAqIufo4Ia5dhxKZeOSpciHeV0xVRNUY1e1VS1FtSuG7ZWAqtBrKKsQs0qIruGIludRN9eUAsIbU+6gORawEvHbk6+dPQOdSt4osPChgf6pVlggYDHDAREniy5MuXLljNj3qy5MwLEoEOLHk26tOnTYzK6uwiwIkDW/Vz3g61Ptj7a92zfw01PNz3e7nyvltla9Trg7oyf26iOovJvyM8JX8cc8Jzn3KJ/m76cOEDs2JgTgAq+WnWi5aOJJ9/xfMf0ztY7b++9H3xe8hNy/+be4f1b+SmZ9l8s/WFE3wTjzedQgQMNyEqAxR3IlH8SPpCgfg6ewuB3FV4oYIXWtZHhKBDGNqInG9rXIXsL1qfPiZqUWBuMlaT44ooKJmTjPTRCImNuPSqyIz1BGvJjb0UCMmRyOGIIInpNfthiYg1GGeGUExqIpYUs6ugij1aa+OR7Yc44JoVbenill1RymGaXAy25TpJ6HBkcnXTIeU4EACH5BAkHAA0ALAAAAACAAIAAgzR6tKzG5NTm9GyizLzW7EyKvPT2/ISu1LTO5Nzm9MTa7FySxJS63P///wAAAAAAAAT+sMlJq704662W/2AojmRphsOmrmzbIEAsz3Rt33hOF27vtzCdcEjE8X7IZCVYbDpzR6X0x3xar9GpllW9eovZrTjT/Zqh4zT5zNaF1fByex6D2ydyOvt9F+f1Znx9Wn+AXwEHiYqLjI2Oj5CRjAQUhYZWBQOXdAyVm3San2ydeKJ7oaZfpBKWqUOorlarL7FembVXs624N7C8RLq/TrfCRcHFRb7IOMfLbsrONQee0TrQ1TLN2DXE29LU3jXX29rhMd3mMdOl6TPj2OsSBO0y6OnxtPQx79X48/r2zOHb5YxfNH/6AAQMNzAhAIPOEAKEuKxhQorIJNJb6M2iPoz+xTS247jNIz2QwkSmIwkP3MmEKs2x7OeyHcpfMcPNPFgz3U1eOb3tjNjT3E9cQbcNrVg03NFaSbEJGiSF4DKqaqwWm4oVidZiXcd8/cU1bI+xv8xuQYurrFouDt9OYVvLrdwNdGvdVZLXld29GPq6Auw14V/CFQwIEKCAsYLHkCNLnky5suXKjBMg3sy5s+fPoEOLHk169NNY5WSedpVa5+pUrYW+NhVb6WxRtaXe/pS72lJkvaP9LhY82u5NJlcev1R82fCUTb0tN9Qc2XOc0bdNBxTV93Y9yX3CpPBv43c64Y2On1B+5Pk56Z2ul2f4fZv40uc3aK9cv+BU9rGI0Z1wAZ6Bn3b68aeafw4VaMaAzlwHVHbYOPgFhM5Z6MWBFSZYH4MXeTgRiB+JaB6JL+mDoXUaXsFhNS1aseJWMT7xonEmuoeiTTn2pyKFMPa44I/slEgkfSMemY+R9MwojIRIAYmjkgq6tqN4VH6o5H+m1OiEk2R52cSNBQlp5ZYNminbleZEAAAh+QQJBwAOACwAAAAAgACAAIM0erSsxuTU5vRsoszs8vRMirzE2uzk7vSMstS0zuTc5vT09vxcksSUutz///8AAAAE/hCxSau9OOttg/uOwY1kuQ0DoK5s675wLLcN6CRzru9ykfLA4KwGwgmPSJUvyQwSP8amdLacWmHP23XbqnK52ej36h1bw+ZtOd1E2MRs5jqORNOlv3vSXdTL835CfFCBSHOFOoNaiEKAjIlvj0CHkjCKcJUyjpmWkZxUm58tl6IzoaUqpKgvlKiqqy6nrp6wLK2lr7Ursri0ugC3orm/vMK+usGfw7rFyse1yZzLtc3Sz7DRmdOw1drXq9mV26vd4t+o4ZLjqOXq56Xpj+ul7fLvovGM86L1+vef+RDt+9RP4D9OAQsN5FRQ4cFMCQMtzNRQ4sNKEf1MrFRR40VJ/hn1bJTUUeTHRyHvjHxUUuVJRinprGTUUuZLRDHjzERUU+fNQjnZ7CzUU+jPQEHTDA1UVOlRP0nNLPXTVOpTPVHHTNVTVevVOwUOCBBgQIGBs2jTql3Ltq3btwoI2FgwlizZt3jz6l1LVoGNv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPirl/s/AIGGsxXOllDn46T2nSf0aRhAxD9q/UW2shK317NxvYV3Mxkb0Wt+zfvNL6tDKdTXPlxM8mnLI/TXPrzMdGlTGdTXfv1L9nbfP/SXfzr0eGZbE9TXv14Ne33vN8SH8l67PWP3B+TX9B8K+nJonfeaP0FsR8XAdr3nxUFAnEgfMItOEWDPDxIBoU7WHgFhpAMmFuEHgYHm4ZTJKifhHiASAhsJvoXIjUqLoIehzmQOGGMmGBD4ww2pjgiin/gKBsAO8rQY5A/vsiNkCwWGcORTDjZiZLoSPkClElY6QKWR7RoIJBRMjmjmASS+WGSK8Km5ShgGrImC1we8eYKcQbhpYNtIjFnKnkKcWeFfQoRAQAh+QQJBwAQACwAAAAAgACAAIQ0erSsxuTU4uxsoszs8vTE2uzk7vRMiry0zuTc5vSMstSsyuTU5vT09vxcksSUutz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF/qDijGRpnmiqrmYAvVDBznS9DgOg73zv/8CgsPeAQRDDpHIpPOSY0OiwCENKr1idM8uNUl/Wrni4HZuB3+N53Suz2enw++yem+P2dT3fVRjlfFx7gVh4hGJPh1l+VYqCiY5SjGCRWIOVSpNqmFKQnJl/n1CXokCagKVCnqmmoaxkq689p7JDsbU6tLg/pLi6uz63vq7APL21v8U7wsjEygDHssnPzNLOytGv08rV2tfF2azbxd3i38DhqePA5ernu+ml67vt8u+48aLzuPX697X5Pu2r1U/gP1kBOQ2UVVDhwVcJMS181VDiQ1YRK01kVVHjxVQZI21M1VHkx1Ih/h2NLFVS5UlRKRWtFNVS5stPMQ/N/FRT501OOQnt5NRT6E9MQQMNxVRU6dFKSfksrdRU6tNIUfNMjVRV61VHWe1sddRV7FdFYeeMVVRW7dlDBwwImCugQN27dvPi3au3L9+/fgMLIGCkAQO6ghMDXqy4sYAERiJLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGNXRoVONmra8Gyfxo1Pt2neAH2XBo5QOGniEI2PRo5RuWjmrJyHho5SOmjqMK1/xi5Ku2fuQL13Bs+pwILz6NOrX8++vfv36gW8JZT2jaFnOtranx+oPhz+gej3XyP4QSPgGvfh13fgGQlis+AdAPLx4BgNgjOhGGsdcmEXFaKzIRcZEvLhIhHa4d8aIQZYIAAp5nHiGS3mMSIWMc7xohk1zjHjFTmyceMYPbKxoyQl2jhkFEGucSQUSZrxI4ZF6rhik2M82UeUbyzJBJViWAkilkJOCSYdWi7BJSJiEoiflySqqWCalBTIJo1jnlEmKG46COcmBd6ZxJmCyEUXY4Q6ZihjhOWpjHickQcVo5s5WgmkmkkKFqWZWeoIpphpChenl3l6CKiWidofqbOtCACqlJnKxwGsTuYqHyEAACH5BAkHAA4ALAAAAACAAIAAgzR6tKzG5NTm9GyizOzy9EyKvMTa7OTu9Iyy1LTO5Nzm9PT2/FySxJS63P///wAAAAT+ELFJq704622D+47BjWS5DQOgrmzrvnAstw3oJHOu73KR8sDgrAbCCY9IlS/JDBI/xqZ0tpxaYc/bdduqcrnZ6PfqHVvD5m053UTYxGzmOo5E06W/e9Jd1MvzfkJ8UIFIc4U6g1qIQoCMiW+PQIeSMIpwlTKOmZaRnFSbny2XojOhpSqkqC+UqKqrLqeunrAsraWvtSuyuLS6ALeiub+8wr66wZ/DusXKx7XJnMu1zdLPsNGZ07DV2ter2ZXbq93i36jhkuOo5ernpemP66Xt8u+i8YzzovX695/5EO371E/gP04BCw3kVFDhwUwJAy3M1FDiw0oR/UysVFHjRUn+GfVslNRR5MdHIe+MfFRS5UlGKemsZNRS5ktEMePMRFRT581COdnsLNRT6M9AQdMMDVRU6VE/Sc0s9dNU6lM9UcdM1VNV69U7BQ4IEGBAgYGzaNOqXcu2rdu3CgjYWDCWLNm3ePPqXUtWgY2/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPgzFhA21ZNDjSlU2jQ01ZNTzWk13jgy1ZNkDakW0jxA1ZNyfej31jBO5YOEjijY1LQs5YOUzmi50zgq5YOlDqia0Xwo5YO1Tuh737AW9YPFjyhc3fQU9YfZwC7EP/YhFfsHs28OsDvs9G//75SviZ9xd/aXT1hR3zZXXgV3cYCAaD7zm4BYLzSXgFhchYeAaEcWg4BYbQeCgFiNQACMBWdCj4YB8mitgGh2mouAWKdLjIBI342bgHjGkIyOMY+fm4CIBCEgJgkD4SaEaRQ/6CpIBKjsFklFw86R+VXExpopX6YbmFlkeCSWSRXlrBZX1lWiGmk2v+0iY0b9YS52lkmgjAnKvVaWIEACH5BAkHAA4ALAAAAACAAIAAgzR6tKzG5NTm9GyizOzy9EyKvMTa7OTu9Iyy1LTO5Nzm9PT2/FySxJS63P///wAAAAT+ELFJq704622D+47BjWS5DQOgrmzrvnAstw3oJHOu73KR8sDgrAbCCY9IlS/JDBI/xqZ0tpxaYc/bdduqcrnZ6PfqHVvD5m053UTYxGzmOo5E06W/e9Jd1MvzfkJ8UIFIc4U6g1qIQoCMiW+PQIeSMIpwlTKOmZaRnFSbny2XojOhpSqkqC+UqKqrLqeunrAsraWvtSuyuLS6ALeiub+8wr66wZ/DusXKx7XJnMu1zdLPsNGZ07DV2ter2ZXbq93i36jhkuOo5ernpemP66Xt8u+i8YzzovX695/5EO371E/gP04BCw3kVFDhwUwJAy3M1FDiw0oR/UysVFHjRUn+GfVslNRR5MdHIe+MfFRS5UlGKemsZNRS5ktEMePMRFRT581COdnsLNRT6M9AQdMMDVRU6VE/Sc0s9dNU6lM9UcdM1VNV69U7BQ4IEGBAgYGzaNOqXcu2rdu3CgjYWDCWLNm3ePPqXUtWgY2/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPgzFhA21ZNDjSlU2jQ01ZNTzWk13jgy1ZNkDakW0jxA1ZNyfej31jBO5YOEjijY1LQs5YOUzmi50zgq5YOlDqia0Xwo5YO1Tuh737AW9YPFjyhc3fQU9YfZwC7EP/YhFfsHs28OsDvs9G//75Svh29xd/aQj4FR35GbgIgAoSAmCCBhJoRoML/gKhgBKOQWGGXFzoH4dcbAggMCKOWOJ8HuoH4hYnWtjiLy9CE2MtM57W4IpX1LjajSMCoONrPJoYJIo/llLkbUPOd+RuScLYpIxP0hiljQriaMWSEGGZiZbHTblKBAAh+QQJBwAPACwAAAAAgACAAIM0erSsxuTU5vRsoszs8vTE2uxMiry0zuTk7vSMstSsyuTc5vT09vxcksSUutz///8E/jC1Sau9OOttw/tPwY1kuQ0DoK5s675wLLcO+Bxzru+ykfLA4KwGwgmPSJUvyQwSP8amdLacWmHP23XbqnK52ej36h1bw+ZtOd1M2MRs5jqORNOlv3vSXdTL835CfFCBSHOFOoNaiEKAjIlvj0CHkjCKcJUyjpmWkZxUm58tl6IzoaUqpKgvlKiqqy6nrp6wLK2lr7Ursri0ugC3orm/vMK+usGfw7rFyse1yZzLtc3Sz7DRmdOw1drXq9mV26vd4t+o4ZLjqOXq56Xpj+ul7fLvovGM86L1+vef+RDt+9RP4D9OAQsN5FRQ4cFMCQMtzNRQ4sNKEf1MrFRR40VJ/hn1bJTUUeTHRyHvjHxUUuVJRinprGTUUuZLRDHjzERUU+fNQjnZ7CzUU+jPQEHTDA1UVOlRP0nNLPXTVOpTPVHHTNVTVevVOwYQCBBQYEGBs2jTql3Ltq3btwsI2GAwlizZt3jz6l1LdoGNv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7dvzAgUCB9OvLjx48iTKy9+gDcmbM5/rTAQXTqw6tKp734ODvsv7bq5o/P+izw089C3W1eBvrt66+Bzi0fVfvx76/Xh5S+1H2D/T/9BTRRgJgOCVKAkB8KUICMLAtVgIQ9CFaEfE4JV4R0XxhEfbvPxd993GcbBG111FXDXXiimuNYCfv3m4oswxijjjDTWaOONOOao4448xhYBACH5BAkHAA4ALAAAAACAAIAAgzR6tKzG5NTm9GyizOzy9EyKvMTa7OTu9Iyy1LTO5Nzm9PT2/FySxJS63P///wAAAAT+ELFJq704622D+47BjWS5DQOgrmzrvnAstw3oJHOu73KR8sDgrAbCCY9IlS/JDBI/xqZ0tpxaYc/bdduqcrnZ6PfqHVvD5m053UTYxGzmOo5E06W/e9Jd1MvzfkJ8UIFIc4U6g1qIQoCMiW+PQIeSMIpwlTKOmZaRnFSbny2XojOhpSqkqC+UqKqrLqeunrAsraWvtSuyuLS6ALeiub+8wr66wZ/DusXKx7XJnMu1zdLPsNGZ07DV2ter2ZXbq93i36jhkuOo5ernpemP66Xt8u+i8YzzovX695/5EO371E/gP04BCw3kVFDhwUwJAy3M1FDiw0oR/UysVFHjRUn+GfVslNRR5MdHIe+MfFRS5UlGKemsZNRS5ktEMePMRFRT581COdnsLNRT6M9AQdMMDVRU6VE/Sc0s9dNU6lM9UcdM1VNV69U7BQ4IEGBAgYGzaNOqXcu2rdu3CgjYWDCWLNm3ePPqXUtWgY2/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KM7x4SNN3Vw1n+tKJBdO7Du2rnvvo4O/C/xusmjMo+MPTT3teBjH+9dhfzy0vPr38+/v///AAYZKOCABBZo4IEIJqjgggw26OCDEEYooXQRAAAh+QQJBwAOACwAAAAAgACAAIM0erSsxuTU5vRsoszs8vRMirzE2uzk7vSMstS0zuTc5vT09vxcksSUutz///8AAAAE/hCxSau9OOttg/uOwY1kuQ0DoK5s675wLLcN6CRzru9ykfLA4KwGwgmPSJUvyQwSP8amdLacWmHP23XbqnK52ej36h1bw+ZtOd1E2MRs5jqORNOlv3vSXdTL835CfFCBSHOFOoNaiEKAjIlvj0CHkjCKcJUyjpmWkZxUm58tl6IzoaUqpKgvlKiqqy6nrp6wLK2lr7Ursri0ugC3orm/vMK+usGfw7rFyse1yZzLtc3Sz7DRmdOw1drXq9mV26vd4t+o4ZLjqOXq56Xpj+ul7fLvovGM86L1+vef+RDt+9RP4D9OAQsN5FRQ4cFMCQMtzNRQ4sNKEf1MrFRR40VJ+hn1bJTUUeTHRyHvjHxUUuVJRinprGTUUuZLRDHjzERUU+fNQjnZ7CzUU+jPQEHTDA1UVOlRP0nNLPXTVOpTPVHHTNVTVevVOwUOCBBgQIGBs2jTql3Ltq3btwoI2FgwlizZt3jz6l1LVoGNv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDix9Pvrz58+jTq1/Pvr379/Djy59Pv779+/jz69//OwIAIfkECQcADQAsAAAAAIAAgACDNHq0lLrc1OLsbKLM5O70TIq8rMbkhK7U1Ob07PL0XJLEtM7kjLLU////AAAAAAAABP6QqUmrvTjrbU37YCiOZGme6ACsbOu+cCzPboDeeK43Ku3/QJltRyzmesGkcjY0Op8h5HJKbUKvRSl1G7Rivzgtd8wEm8PkNI1xbpvE6jjA667D5Wl2ff+548d6fHZ/f4GCbX6EVIYCB46PkJGSk5SVlpEBiYpLhgubcQWan0Gdo2mhpmSlqVyorFurr1OuspwhnrVLtLmkt7xKu78+scI+wcUyxMgzosvKyzDH0C7P0y3S1ivV2SvNyNvZ2Nng2d7F5NPi1ujT5sLsy+rT8Mvuv/TF8tD4xfa8/L/0OfPFDYa/XAB5CfxGsKCLg7US5lp4rqFDFhBlSaxF8Z3Fi+YAMr7aKKvjvY8XRbIi+crkP5QOVaZiycolQpgFZZqimcpmRJzcdI7iacqnxkODQGpD6kboJ0NMvzjdBDXqlamKqlp9gpWQ1q1GuhYCK1XpUrJXzQL4ilaHWDxs26IxG1duCrV17ZogIKCvX78L/gYGLLgw4cN9Byc27JeA3seQI0ueTLmy5cuYM2vezLmz58+gQ4seTbq06dOoU6tezbq169ewY8ueTbu27du4c+vezbu379/AgwsfTry48ePIkytfzry58+fQo0ufTr269evYs2vfzr279+/gw4sfT768+fPo04eIAAAh+QQJBwAOACwAAAAAgACAAIM0erSUutzU4uxsosysxuTk7vRMiryErtS0zuTU5vSsyuTs8vRcksSMstT///8AAAAE/rCxSau9OOttiftgKI5kaZ7oAKxs675wLM9ugN54rjsq7f9AmW1HLOZ6waRyNjQ6nyHkckptQq9FKXUbtGK/OC13zASbw+Q0rXFum8TqOMDrrsPlaXZ9/7njx3p8dn9/gYJtfoRUhodmiYpLjI1fj5BJkpNXlZZAmJlPm5w+np9GoaIzpKVEp6gxqqs6ra4vsLFotIu3mrm6u6C9U7a/b8GRIQUKysvMzc7P0NHSzQizxoYIxkoG1sHY2knc4EHf4z/i5qMh2ek06O0y5fAx7/O16/b03b3y+S77ufr5W1FvIACBAwsORDgQIC2G+RT6g2hPYj6K9hy6MpTggEeP9wMOhBwpsiTJkyZTolypMuWBABpRDSNGIqaomTRF2OSEMyeInZZ6+uRhsIVQn0AhHc2ZVNFSmk0JPSUWtdDQHVXxTP2VVc7WXV3jfL0VVs3YWGXzXJVVlMXZVWnJvC0VF9DaI21XzP1Ul8veTH23/J0U2NfdFHkPHr5RWNhiFAUESJ48GQFly5Uva87MWTJmz5snF3hMurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDix9Pvrz58+jTq1/Pvr379/Djy59Pv779+/hvRQAAIfkECQcACQAsAAAAAIAAgACDNHq0lLrc1Ob0bKLM5O70XJLErMbkjLLU7PL0////AAAAAAAAAAAAAAAAAAAAAAAABP7wlEmrvTjrbU36YCiOZGme6ACsbOu+cCzPboDeeK4nKu3/QJltRyzmesGkcjY0Op8h5HJKbUKvRSl1G7Rivzgtd8wEm8PkNO1wbpvE6jjA667D5Wl2ff+548d6fHZ/f4GCbX6EVIaHZomKS4yNX4+QSZKTV5WWQJiZT5ucPp6fRqGiM6SlRKeoMaqrOq2uL7CxaLSLt5q5urugvVO2v2/BkcROs8bDyCPKwczNUcZK0dJ91JfXO8+91tfdud/S4bTjzeWu58jpqOvE7aLvv/Gc87v1lve3+ZD7sf0U/VsVkNDAUgULbZOVLcjBTwnxPMwUUc7ESRXjXGyUUc3GQ7Qd8yw80rDTSFwl15y8EZLMR0EtAa1MkXLUzBMxubzkk3PLzj09fd0kEVTY0BJFjx11VlPlUhFJqz2F2jTV1GlVX10FEVXb1gQEBIgdS7as2bNo06otS+Cr27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0ueTLmy5cuYM2vezLmz58+gQ4seTbq06dOoU6tezbq169ewY8ueTbu27du4c+vezbu3iQgAIfkECQcABgAsAAAAAIAAgACCNHq0hK7UrMbkbKLMlLrcvNbs////AAAAA/5outz+MMpJq7046827/2AojmRpnmiqrmzrvnAsz3Rt33iu73zv74KAcEgsGo/IpLJY+E0GgKh0Sq1ar9gsleCUQLXgsBjL7UK+47Q6WzY70Ou4vO1mwOX4Mb2uuOf/bHwNfoCFW4J2hopWe3yEi4UBiAuPkH+NdZWWeJKTBpqbcZhuoKFqnZOlpmOoiKqrYa2Cr7Baso61gLeZuX+7pL15v2a0wVXDXcXGU8hOystRzT/P0NI+1MvWPdjG2jzcwd474L3iOuS55jnoteo47LDuN/Cr8jb0pvY1+KH6NPyb/M0AaEmgDIKQDHpayLChw4cQI0qcSLGixYsYM2rcyFSxo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUsWawIAIfkECQcACQAsAAAAAIAAgACDNHq0lLrcvNbsbKLMrMbk1OLsxNrshK7UrMrk////AAAAAAAAAAAAAAAAAAAAAAAABP4wyUmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2yxUZEOCweEwum8/ocUE6ALjf8Lh8Tq/b4wH2fc/v2/NRbX6DhHeAUIKFiosAh0+JjJF9jk6Qkpd1lE2WmJ1wmkycnp6gS6KjmAd6qKylSqeskaqBsaiuSbC1irNQBAe/BwPBw8LFxMfGycjLys0HAl3R0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wADChxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjxEgQ4ocSbKkyZMoU6pcydJiBAA7', {base64: true});
				if (JSZip.support.blob) {
					try {
        				var blob = a.generate({type:"blob"});
			        	saveAs(blob, "TableBuilder.zip");
					} catch(e) {
			        	alert('Oh No! Something went wrong, please try again!')
		    		}
				} else {
					alert('Sorry, you need to use a modern browser to download project')
				}
				jQuery('.containerPreloaderModal').addClass('hiddenContainer');
				jQuery('.containerDownloadProgress .listExplainer').empty();
        	},
        	write_html: function() {
        		var _html = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="utf-8" />\n\t<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />\n\t';
        		if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['responsive_table']) {
        			_html += '<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=1.0;">\n\t';
        		}
        		_html += '<title>'+((jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['table_title'] != null) ? (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['table_title'] + '| DataViz | Interactive Tools') : 'TableBuilder Generator | DataViz | Interactive Tools')+'</title>\n\t<meta name="referrer" content="always">\n\t<meta name="author" content="By Rob Kandel" />\n\t<link rel="stylesheet" type="text/css" href="css/table_builder.min.'+_version_num+'.css">\n\t'+((!jQuery.isEmptyObject(method.table.output_custom_styles(true))) ? method.table.output_css() : '')+'\n\t<script type="text/javascript" src="js/jquery-1.11.2.min.js"></script>\n\t<!--[if lt IE 9]> \n\t<script type="text/javascript" src="js/respond.js"></script>\n\t<![endif]-->\n\t<script type="text/javascript" src="js/jquery.table_builder.min.'+_version_num+'.js"></script>\n\t';
        		_html += '\n</head>\n<body>\n\t';
        		_html += method.table.output_javascript();
        		_html += '\n</body>\n</html>';
        		return _html;
        	}
        },
        parse_csv: {
        	init: function(a) {
            	var _regx = new RegExp("[^,]", "gi");
	            var _num_commas = a.replace(_regx, "").length;
    	        _regx = new RegExp("[^\t]", "gi");
        	    var _num_tabs = a.replace(_regx, "").length;
            	var _row_delimiter = "\n";
	            var _delimiter = ",";
    	        if (_num_tabs > _num_commas) {
        	        _delimiter = "\t"
            	};
	            _regx = new RegExp("^" + _row_delimiter + "+", "gi");
    	        a = a.replace(_regx, "");
        	    _regx = new RegExp(_row_delimiter + "+$", "gi");
	            a = a.replace(_regx, "");
            	return method.parse_csv.parse_csv(a, ",");
    	    }, 
	        parse_csv: function(a,b) {
    	        var _pattern = new RegExp(
        	    (
            	    "(\\" + b + "|\\r?\\n|\\r|^)" +
                	"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	                "([^\"\\" + b + "\\r\\n]*))"
    	        ),"gi");
        	    var _data_list = [[]];
            	var _matches = null;
	            while (_matches = _pattern.exec(a)){
    	            var _match_delimiter = _matches[1];
        	        if (_match_delimiter.length && _match_delimiter != b){
            	         _data_list.push([]);
                	}
	                if (_matches[2]){
    	                var _matched_value = _matches[2].replace(new RegExp( "\"\"", "g" ),"\"");
        	        } else {
            	         var _matched_value = _matches[3];
                	}
	                _data_list[_data_list.length - 1].push(_matched_value);
    	        }
        	    return method.parse_csv.remove_line_breaks(_data_list)
	        },      
	        remove_line_breaks: function(a) {
    	        for (var i = 0; i < a.length; i++){
        	        for (var d = 0; d < a[i].length; d++){
            	        a[i][d] = a[i][d].replace("\t", " ");
                	    a[i][d] = a[i][d].replace("\n", " ");
                    	a[i][d] = a[i][d].replace("\r", " ");
	                }
    	        }
        	    return a
	        }, 
        	convert_to_json: function(a) {
            	var _object_list = []
            	for (var i = 1; i < a.length; i++) {
                	var c = {}
	                for (var m in a[i]) {
    	                c[a[0][m]] = a[i][m]
        	        }
            	    _object_list.push(c)
	            }	
    	        return _object_list
        	}
        },
        tool_setup: {
            init: function(a) {
                (a == 'table') ? method.table.reset_table_options(): method.map.reset_map_options();
                method.tool_setup.option_buttons();
                method.tool_setup.input_setup();
            },
            option_buttons: function() {
                jQuery('.containerEditorButtons').find('.editorButton').each(function() {
                    jQuery(this).on('click', function() {
                        method.tool_setup.toggle_option_buttons(jQuery(this))
                    });
                });
                jQuery('.containerOptionsHolder').find('.toolOptionUnitTitleClose').each(function() {
                    jQuery(this).on('click', function() {
                        method.tool_setup.toggle_option_buttons(jQuery('*[data-role="' + jQuery(this).parent().attr('data-role').split('tool_option_unit_title_')[1] + '_options"]'))
                    });
                });
            },
            toggle_option_buttons: function(a) {
                if (jQuery('.editorButtonActive')[0]) {
                    jQuery('*[data-role="tool_options_unit_wrapper_' + jQuery('.editorButtonActive').attr('data-role').split('_options')[0] + '"]').addClass('toolOptionsUnitHidden');
                }
                if (a.hasClass('editorButtonActive')) {
                    a.removeClass('editorButtonActive');
                } else {
                    jQuery('.editorButtonActive').removeClass('editorButtonActive');
                    a.addClass('editorButtonActive');
                    jQuery('*[data-role="tool_options_unit_wrapper_' + a.attr('data-role').split('_options')[0] + '"]').removeClass('toolOptionsUnitHidden');
                }
            },
            input_setup: function() {
                jQuery('.containerOptionsHolder').find('input[type=text]').each(function() {
                    var _val = jQuery(this).val()
                    jQuery(this).on('focus', function() {
                        method.tool_setup.check_input(jQuery(this), 'focus', _val);
                    }).on('blur', function() {
                        method.tool_setup.check_input(jQuery(this), 'blur', _val);
                    });
                });
                jQuery('#title_subhead').on('focus', function() {
                    method.tool_setup.check_input(jQuery('#title_subhead'), 'focus', 'Insert text');
                }).on('blur', function() {
                    method.tool_setup.check_input(jQuery('#title_subhead'), 'blur', 'Insert text');
                });
            },
            check_input: function(a, b, c) {
                if (b == 'focus') {
                    if (a.val() == c) {
                        a.val('');
                    }
                } else {
                    if (a.val() == '') {
                        a.val(c);
                    }
                }
            }
        },
        table: {
            reset_table_options: function() {
                jQuery('#title_title').val('Insert a title');
                jQuery('#title_subhead').val('Insert text').html('Insert Text');
                jQuery('#title_source').val('Insert data source');
                jQuery('#title_source_link').val('Insert data source URL');
                jQuery('#title_credit').val('Insert a credit');
                jQuery('#fixed_header_true').prop("checked", true)
                jQuery('#repeat_header_rows').val('Insert number')
                jQuery('#rows_visible').val('Visible rows');
                jQuery('#number_rows option[value="10"]').prop("selected", true);
                jQuery('#number_rows option[value="25"]').prop("selected", true);
                jQuery('#number_rows option[value="50"]').prop("selected", true);
                jQuery('#number_rows option[value="100"]').prop("selected", true);
                jQuery('#number_rows option[value="1000000"]').prop("selected", true);
                jQuery('#search_field_true').prop("checked", true)
                jQuery('#search_field_text').val('Search table');
                jQuery('#search_button_text').val('Search');
                jQuery('#sortable_options_true').prop("checked", true)
                jQuery('#sort_order_desc').prop("checked", true)
                jQuery('#sort_type_options').val('');
                jQuery('#refresh_data_min').val('Insert a number of minutes');
                jQuery('#ranking_false').prop("checked", true)
                jQuery('#format_number_true').prop("checked", true)
                jQuery('#blank_data').val('-');
                jQuery('#decimal_places').val(2);
                jQuery('#zero_out_false').prop("checked", true)
                jQuery('#date_format').val('Choose a date format');
                jQuery('#time_format').val('Choose a time format');
                jQuery('#table_responsive_true').prop("checked", true);
                jQuery('#repeat_header_false').prop("checked", true);
                jQuery('#tool_style_table_font_family').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_size').val('14');
                jQuery('#tool_style_choice_table_font_color_input').val('333333');
                jQuery('#tool_style_table_link_font_family').val('"Helvetica Neue"');
                jQuery('#tool_style_choice_table_link_font_color_input').val('337ab7');
                jQuery('#tool_style_choice_table_link_font_color_input_hover').val('286090');
                jQuery('#tool_style_table_button_font').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_button_size').val('14');
                jQuery('#tool_style_choice_button_font_color_input').val('ffffff');
                jQuery('#tool_style_choice_button_background_color_input').val('337ab7');
                jQuery('#tool_style_choice_button_background_color_input_hover').val('286090');
                jQuery('#tool_style_choice_button_background_color_input_inactive').val('bbbbbb');
                jQuery('#tool_style_table_title_font').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_title_size').val('30');
                jQuery('#tool_style_choice_title_font_color_input').val('333333');
                jQuery('#tool_style_table_copyblock_font').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_copyblock_size').val('15');
                jQuery('#tool_style_choice_copyblock_font_color_input').val('444444');
                jQuery('#tool_style_table_source_font').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_source_size').val('12');
                jQuery('#tool_style_choice_source_font_color_input').val('777777');
                jQuery('#tool_style_table_search_font').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_search_size').val('14');
                jQuery('#tool_style_choice_search_background_color_input').val('f8f8f8');
                jQuery('#tool_style_choice_search_font_color_input').val('444444');
                jQuery('#tool_style_table_column_font').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_column_size').val('14');
                jQuery('#tool_style_choice_header_background_color_input').val('ffffff');
                jQuery('#tool_style_choice_column_font_color_input').val('444444');
                jQuery('#tool_style_choice_column_border_color_input').val('cccccc');
                jQuery('#tool_style_column_border_width').val('2');
                jQuery('#tool_style_choice_column_arrow_color_input').val('444444');
                jQuery('#tool_style_table_rows_font').val('"Helvetica Neue"');
                jQuery('#tool_style_table_font_rows_size').val('13');
                jQuery('#tool_style_choice_rows_even_background_color_input').val('f9f9f9');
                jQuery('#tool_style_choice_rows_odd_background_color_input').val('ffffff');
                jQuery('#tool_style_choice_rows_even_border_color_input').val('cccccc');
                jQuery('#tool_style_choice_rows_even_font_color_input').val('000000');
                jQuery('#tool_style_choice_rows_odd_font_color_input').val('000000');
            },
            update_options: function(a) {
                if ('table_title' in a) {
                    jQuery('#title_title').val(a.table_title);
                    jQuery('.toolOptionExtra_title').slideDown(150);
                    document.title = a.table_title + ' | DataViz | Interactive Tools';
                }
                if ('table_copyblock' in a) {
                    jQuery('#title_subhead').val(a.table_copyblock).html(a.table_copyblock);
                    jQuery('.toolOptionExtra_copyblock').slideDown(150);
                }
                if ('table_source' in a) {
                    jQuery('#title_source').val(a.table_source);
                    jQuery('#tool_option_subcat_source').slideDown(150);
                }
                if ('table_source_link' in a) {
                    jQuery('#tile_source_link').val(a.table_source_link);
                    jQuery('#tool_option_subcat_source').slideDown(150);
                }
                if ('table_credit' in a) {
                    jQuery('#title_credit').val(a.table_credit);
                    jQuery('#tool_option_subcat_source').slideDown(150);
                }
                if ('fixed_header' in a) {
                    if (a.fixed_header) {
                        jQuery('#fixed_header_true').prop("checked", true)
                    } else {
                        jQuery('#fixed_header_false').prop("checked", true)
                    }
                }
                if ('repeat_header' in a && a.repeat_header) {
                    jQuery('#repeat_header_true').prop("checked", true);
                    jQuery('.toolOptionExtra_repeat').slideDown(150);
                    jQuery('#repeat_header_rows').val(a.repeat_header)
                }
                if ('show_row_options' in a) {
                    if (!a.show_row_options) {
                    	jQuery('#number_rows option[value="-1"]').attr('selected', true);
                    	jQuery('#number_rows option[value="5"]').prop("selected", false);
                    	jQuery('#number_rows option[value="10"]').prop("selected", false);
                    	jQuery('#number_rows option[value="15"]').prop("selected", false);
                    	jQuery('#number_rows option[value="20"]').prop("selected", false);
                		jQuery('#number_rows option[value="25"]').prop("selected", false);
		                jQuery('#number_rows option[value="50"]').prop("selected", false);
        		        jQuery('#number_rows option[value="100"]').prop("selected", false);
                		jQuery('#number_rows option[value="1000000"]').prop("selected", false);
                    }
                }
                if ('visible_rows' in a) {
                    jQuery('#rows_visible').val(a.visible_rows + ' Rows');
                }
                if ('visible_row_options' in a) {
                	if(!jQuery('#number_rows option[value="-1"]').is(':checked')) {
	                    for (var i in a.visible_row_options) {
    	                    jQuery('#number_rows option[value="' + a.visible_row_options[i] + '"]').attr('selected', true);
        	            }
        	        }
                }
                if ('show_search' in a) {
                    if (a.show_search) {
                        jQuery('#search_field_true').prop("checked", true)
                    } else {
                        jQuery('#search_field_false').prop("checked", true);
                        jQuery('.toolOption_search').slideUp(150);
                    }
                }
                if ('search_input_text' in a) {
                    jQuery('#search_field_text').val(a.search_input_text);
                }
                if ('search_button_text' in a) {
                    jQuery('#search_button_text').val(a.search_button_text);
                }
                if ('sortable' in a) {
                    if (a.sortable) {
                        jQuery('#sortable_options_true').prop("checked", true)
                    } else {
                        jQuery('#sortable_options_false').prop("checked", true)
                    }
                }
                if ('sort_order' in a) {
                    if (a.sort_order) {
                        jQuery('#sort_order_desc').prop("checked", true)
                    } else {
                        jQuery('#sort_order_asc').prop("checked", true)
                    }
                }
                if ('refresh_data' in a) {
                    jQuery('#refresh_data_min').val(a.refresh_data);
                }
                if ('ranking' in a) {
                    if (a.ranking) {
                        jQuery('#ranking_true').prop("checked", true)
                    } else {
                        jQuery('#ranking_false').prop("checked", true)
                    }
                }
                if ('format_number' in a) {
                    if (a.format_number) {
                        jQuery('#format_number_true').prop("checked", true)
                    } else {
                        jQuery('#format_number_false').prop("checked", true)
                    }
                }
                if ('blank_data' in a) {
                    if (a.blank_data == '-') {
                        jQuery('#blank_data').val('dash');
                    } else if (a.blank_data == 'N/A') {
                        jQuery('#blank_data').val('N/A');
                    } else {
                        jQuery('#blank_data').val('');
                    }
                }
                if ('decimals' in a) {
                    jQuery('#decimal_places').val(a.decimals);
                }
                if ('zero_out' in a) {
                    if (a.zero_out) {
                        jQuery('#zero_out_true').prop("checked", true)
                    } else {
                        jQuery('#zero_out_false').prop("checked", true)
                    }
                }
                if ('date_format' in a) {
                    jQuery('#date_format').val(a.date_format);
                }
                if ('time_format' in a) {
                    jQuery('#time_format').val(a.time_format);
                }
                if ('responsive_table' in a) {
                    if (a['responsive_table']) {
                        jQuery('#table_responsive_true').prop("checked", true)
                    } else {
                        jQuery('#table_responsive_false').prop("checked", true)
                    }
                }
            },
            update_styles: function(a) {
            	for (i in a) {
            		var _temp = {}
            		_temp[a[i].name] = a[i].value;
            		method.table.update_style_settings(_temp);
            		jQuery('#'+ a[i].input).val(a[i].value.replace('#', '').replace('px', ''));
            		if (a[i].color != '') {
            			jQuery('#'+ a[i].color).css('background-color', a[i].value);
            		}
            	}
            },
            update_table_options: function(a) {
                jQuery('#the_table_wrapper').table_builder('update', a);
            },
            change_custom_styles: function(a, b) {
                if (a in _custom_styles) {

                } else {
                    _custom_styles[a] = {}
                }
                for (i in b) {
                    _custom_styles[a][i] = b[i]
                }
            },
            update_style_settings: function(a) {
            	for (s in a) {
	                _table_styles[s].value = a[s];
	                for (m in _table_styles[s].css) {
	                	if (typeof(_table_styles[s]['output']) == 'string') {
	                		jQuery('#custom_styelsheet').append(_table_styles[s].css[m] + '{'+_table_styles[s]['output']+':'+ a[s]+';}');
	                	} else {
	                		for (p in _table_styles[s]['output']) {
		                		jQuery('#custom_styelsheet').append(_table_styles[s].css[m] + '{'+_table_styles[s]['output']+':'+ a[s]+';}');
		                	}
	                	}
	                }
	            }
	            
            },
            text: function() {
                jQuery('#title_title').on('input', function() {
                    if (jQuery('#title_title').val() != '' && jQuery('#title_title').val() != 'Insert a title') {
                        method.table.update_table_options({
                            'table_title': jQuery('#title_title').val()
                        });
                        jQuery('#the_table_wrapper').table_builder('table_title', jQuery('#title_title').val());
                        jQuery('.toolOptionExtra_title').slideDown(150);
                        document.title = jQuery('#title_title').val() + ' | DataViz | Interactive Tools';
                        jQuery('.dropDownItem[data-value="title"]').removeClass('dropDownItemNotActive');
                    }
                    if (jQuery('#title_title').val() == '' || jQuery('#title_title').val() == 'Insert a title') {
                    	method.table.update_table_options({
                            'table_title': null
                        });
                        jQuery('#the_table_wrapper').table_builder('table_title');
                        jQuery('.toolOptionExtra_title').slideUp(150);
                        document.title = 'My Table | DataViz | Interactive Tools';
                        jQuery('.dropDownItem[data-value="title"]').addClass('dropDownItemNotActive');
                    }
                });
                jQuery('#title_subhead').on('input', function() {
                    if (jQuery('#title_subhead').val() != '' && jQuery('#title_subhead').val() != 'Insert text') {
                        method.table.update_table_options({
                            'table_copyblock': jQuery('#title_subhead').val()
                        });
                        jQuery('#the_table_wrapper').table_builder('table_copyblock', jQuery('#title_subhead').val());
                        jQuery('.dropDownItem[data-value="copyblock"]').removeClass('dropDownItemNotActive');
                        jQuery('.toolOptionExtra_copyblock').slideDown(150);
                    }
                    if (jQuery('#title_subhead').val() == '' || jQuery('#title_subhead').val() == 'Insert text') {
                    	method.table.update_table_options({
                            'table_copyblock': null
                        });
                        jQuery('#the_table_wrapper').table_builder('table_copyblock');
                        jQuery('#title_subhead').html('Insert text');
                        jQuery('.toolOptionExtra_copyblock').slideUp(150);
                        jQuery('.dropDownItem[data-value="copyblock"]').addClass('dropDownItemNotActive');
                    }
                });
                jQuery('#title_source').on('input', function() {
                    if (jQuery('#title_source').val() != '' && jQuery('#title_source').val() != 'Insert data source') {
                        method.table.update_table_options({
                            'table_source': jQuery('#title_source').val()
                        });
                        jQuery('#the_table_wrapper').table_builder('source_text', {text: jQuery('#title_source').val()});
                        jQuery('.toolOptionExtra_source').slideDown(150);
                        jQuery('.dropDownItem[data-value="source"]').removeClass('dropDownItemNotActive');
                    }
                    if (jQuery('#title_source').val() == '' || jQuery('#title_source').val() == 'Insert data source') {
                        method.table.update_table_options({
                            'table_source': null
                        });
                        jQuery('#the_table_wrapper').table_builder('source_text');
                        if (jQuery('#title_credit').val() == 'Insert data source') {
	                        jQuery('.toolOptionExtra_source').slideUp(150);
	                        jQuery('.dropDownItem[data-value="source"]').addClass('dropDownItemNotActive');
	                    }
                    }
                });
                jQuery('#title_source_link').on('input', function() {
                    if (jQuery('#title_source_link').val() != '' && jQuery('#title_source_link').val() != 'Insert data source URL') {
                        var _link = jQuery('#title_source_link').val();
                        if (_link.indexOf('http://') == -1) {
                            _link = 'http://' + _link;
                        }
                        method.table.update_table_options({
                            'table_source_link': _link
                        });
                        jQuery('#the_table_wrapper').table_builder('source_text', {text:jQuery('#title_source').val(),link: _link});
                    }
                    if (jQuery('#title_source_link').val() == '' || jQuery('#title_source_link').val() == 'Insert data source URL') {
                        method.table.update_table_options({
                            'table_source_link': null
                        });
                        jQuery('#the_table_wrapper').table_builder('source_text');
                    }
                });
                jQuery('#title_credit').on('input', function() {
                    if (jQuery('#title_credit').val() != '' && jQuery('#title_credit').val() != 'Insert a credit') {
                        method.table.update_table_options({
                            'table_credit': jQuery('#title_credit').val()
                        });
                        jQuery('#the_table_wrapper').table_builder('credit_text', jQuery('#title_credit').val());
                        jQuery('.toolOptionExtra_source').slideDown(150);
                        jQuery('.dropDownItem[data-value="source"]').removeClass('dropDownItemNotActive');
                    }
                    if (jQuery('#title_credit').val() == '' || jQuery('#title_credit').val() == 'Insert a credit') {
                        method.table.update_table_options({
                            'table_credit': null
                        });
                        jQuery('#the_table_wrapper').table_builder('credit_text');
                        if (jQuery('#title_source').val() == 'Insert data source'){
	                        jQuery('.toolOptionExtra_source').slideUp(150);
	                        jQuery('.dropDownItem[data-value="source"]').addClass('dropDownItemNotActive');
	                    }
                    }
                });
                method.table.structure();
            },
            structure: function() {
                jQuery("input[name='table_responsive']").on('click', function() {
                    method.table.update_table_options({
                        'responsive_table': jQuery('#table_responsive_true').is(':checked') ? true : false
                    });
                    if (jQuery('#table_responsive_false').is(':checked')) {
                        jQuery('.tableBuilderTableHeader').removeClass('tableBuilderResponsive').addClass('tableBuilderNotResponsive');
                        jQuery('.tableBuilderTableBody').removeClass('tableBuilderResponsive').addClass('tableBuilderBodyNotResponsive');
                        jQuery('.tableBuilderWrapper').addClass('tableBuilderWrapperNotResponsive');
                    } else {
                        jQuery('.tableBuilderTableHeader').removeClass('tableBuilderNotResponsive').addClass('tableBuilderResponsive');
                        jQuery('.tableBuilderTableBody').removeClass('tableBuilderBodyNotResponsive').addClass('tableBuilderResponsive');
                        jQuery('.tableBuilderWrapper').removeClass('tableBuilderWrapperNotResponsive');
                    }
                });
                jQuery("input[name='search_field']").on('click', function() {
                    if (!jQuery('#search_field_true').is(':checked')) {
                        method.table.update_table_options({
                            'show_search': false
                        });
                        if (jQuery('.tableBuilderSearchInput')[0]) {
                        	jQuery('.tableBuilderSearchInput').hide();
                        	if (!jQuery('.tableBuilderSearchView')[0] || jQuery('.tableBuilderSearchView').hasClass('tableBuilderSearchViewHidden') || !jQuery('.tableBuilderSearchView').is(':visible')) {
                        		jQuery('.tableBuilderSearchBar').addClass('tableBuilderSearchInputHidden');
                        		if(!jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.sortable) {
                        			jQuery('.tableBuilderSearchBar').addClass('tableBuilderSearchAllHidden');
                        		}
                        	}
                        }
                        jQuery('.toolOptionExtra_search').slideUp(150);
                        jQuery('.toolOption_search').slideUp(150);
                    } else {
                        method.table.update_table_options({
                            'show_search': true
                        });
                        if (jQuery('.tableBuilderSearchInput')[0]) {
                        	jQuery('.tableBuilderSearchInput').show();
                        	jQuery('.tableBuilderSearchBar').removeClass('tableBuilderSearchInputHidden').removeClass('tableBuilderSearchAllHidden');
                        } else {
                        	jQuery('#the_table_wrapper').table_builder('build_search', {input: jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.search_input_text, button: jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.search_button_text});
                        }
                        jQuery('.toolOptionExtra_search').slideDown(150);
                        jQuery('.toolOption_search').slideDown(150);
                    }
                });
                jQuery('#search_field_text').on('input', function() {
                    if (jQuery('#search_field_text').val() != '' && jQuery('#search_field_text') != 'Choose the search field text') {
                        method.table.update_table_options({
                            'search_input_text': jQuery('#search_field_text').val()
                        });
                        jQuery('#table_builder_search_input_field').val(jQuery('#search_field_text').val());
                    } else {
                        method.table.update_table_options({
                            'search_input_text': 'Search table'
                        });
                        jQuery('#table_builder_search_input_field').val('Search table');
                    }
                });
                jQuery('#search_button_text').on('input', function() {
                    if (jQuery('#search_button_text').val() != '' && jQuery('#search_button_text') != 'Choose the search button text') {
                        method.table.update_table_options({
                            'search_button_text': jQuery('#search_button_text').val()
                        });
                        jQuery('#table_builder_search_input_text').html(jQuery('#search_button_text').val());
                    } else {
                        method.table.update_table_options({
                            'search_button_text': 'Search'
                        });
                        jQuery('#table_builder_search_input_text').html('Search');
                    }
                });
                jQuery('#number_rows').on('change', function() {
                	if (jQuery(this).val() != -1) {
	                    method.table.update_table_options({
    	                    'visible_row_options': jQuery('#number_rows').val()
        	            });
        	            method.table.update_table_options({
                            'show_row_options': true
                        });
                        if (jQuery('.tableBuilderSearchView')[0]) {
                        	if (!jQuery('.tableBuilderSearchView').hasClass('tableBuilderSearchViewHidden')) {
	                        	jQuery('.tableBuilderSearchView').show();
    	                    	jQuery('.tableBuilderSearchBar').removeClass('tableBuilderSearchInputHidden').removeClass('tableBuilderSearchAllHidden');
    	                    }
    	                    jQuery('#the_table_wrapper').table_builder('build_row_options_dropdown', jQuery('#number_rows').val());
                        } else {
                        	jQuery('#the_table_wrapper').table_builder('build_row_options');
                        }
            	    } else {
            	    	method.table.update_table_options({
                            'show_row_options': false
                        });
                        if (jQuery('.tableBuilderSearchView')[0]) {
                        	jQuery('.tableBuilderSearchView').hide();
                        	if (!jQuery('.tableBuilderSearchInput')[0] || !jQuery('.tableBuilderSearchInput').is(':visible')) {
                        		jQuery('.tableBuilderSearchBar').addClass('tableBuilderSearchInputHidden');
                        		if(!jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.sortable) {
                        			jQuery('.tableBuilderSearchBar').addClass('tableBuilderSearchAllHidden');
                        		}
                        	}
                        }
            	    }
                });
                method.table.header();
            },
            header: function() {
            	jQuery('.containerToolWrapper').on("resize._tb_resize scroll._tb_scroll", function(e) {
            		if (jQuery('#fixed_header_true').is(':checked') && jQuery('.tableBuilderTableBody')[0]) {
	            		var _place_holder = jQuery('.tableBuilderTableBody').offset().top;
    	            	var _view_top = jQuery('.containerToolWrapper').scrollTop();
	    	            if (_view_top > _place_holder - 40) {
    	    	            jQuery('.tableBuilderTableHeaderWrapper').css({
        	    	            'height': jQuery('.tableBuilderHeaderWrapper').height()
            	    	    });
                	    	jQuery('.tableBuilderHeaderWrapper').addClass('tableBuilderHeaderWrapperFixed').css({
                    	    	'width': jQuery('.tableBuilderWrapper').width(),
	                        	'height': 'auto'
		                    });
    		            } else if (_view_top <= _place_holder) {
        		            jQuery('.tableBuilderHeaderWrapper').removeClass('tableBuilderHeaderWrapperFixed');
            		        jQuery('.tableBuilderHeaderWrapper').css({
                		        'width': '100%'
                    		});
		                    jQuery('.tableBuilderTableHeaderWrapper').css({
    		                    'height': 'auto'
        		            });
            		    }
                		if (_view_top > jQuery('.tableBuilderTableWrapper').height() + jQuery('.tableBuilderTableWrapper').offset().top - jQuery('.tableBuilderHeaderWrapper').height()) {
                    		jQuery('.tableBuilderHeaderWrapper').removeClass('tableBuilderHeaderWrapperFixed');
	                    	jQuery('.tableBuilderHeaderWrapper').css({
	    	                    'width': '100%'
    	    	            });
        	    	        jQuery('.tableBuilderTableHeaderWrapper').css({
            	    	        'height': 'auto'
                	    	});
                	    }
                	} else {
                		jQuery('.tableBuilderHeaderWrapper').removeClass('tableBuilderHeaderWrapperFixed');
            		    jQuery('.tableBuilderHeaderWrapper').css({
                		    'width': '100%'
                    	});
		                jQuery('.tableBuilderTableHeaderWrapper').css({
    		                'height': 'auto'
        		        });
                	}
            	});
                jQuery("input[name='fixed_header']").on('click', function() {
                    if (!jQuery('#fixed_header_true').is(':checked')) {
                        if (jQuery('.tableBuilderHeaderWrapper').hasClass('tableBuilderHeaderWrapperFixed')) {
                            jQuery('.tableBuilderHeaderWrapper').removeClass('tableBuilderHeaderWrapperFixed');
                        }
                        method.table.update_table_options({
                            'fixed_header': false
                        });
                    } else {
                        method.table.update_table_options({
                            'fixed_header': true
                        });
                    }
                });
                jQuery("input[name='repeat_header']").on('click', function() {
                    if (!jQuery('#repeat_header_true').is(':checked')) {
                        jQuery('.toolOptionExtra_repeat').slideUp(150);
                        method.table.update_table_options({
                            'repeat_header': false
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                    } else {
                        jQuery('.toolOptionExtra_repeat').slideDown(150);
                        if (!isNaN(jQuery('#repeat_header_rows').val()) && jQuery('#repeat_header_rows').val() > 0) {
                            method.table.update_table_options({
                                'repeat_header': jQuery('#repeat_header_rows').val()
                            });
                            jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
	                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                        }
                    }
                });
                jQuery('#repeat_header_rows').on('blur', function() {
                    if (!isNaN(jQuery('#repeat_header_rows').val()) && jQuery('#repeat_header_rows').val() > 0) {
                        method.table.update_table_options({
                            'repeat_header': jQuery('#repeat_header_rows').val()
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                    } else {
                        method.table.update_table_options({
                            'repeat_header': false
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                    }
                }).on('keyup', function(event) {
                    if (event.keyCode == 13) {
                        jQuery('#repeat_header_rows').blur()
                    }
                });
                jQuery("input[name='sortable_options']").click(function() {
                    if (!jQuery('#sortable_options_true').is(':checked')) {
                        method.table.update_table_options({
                            'sortable': false
                        });
                        jQuery('.tableBuilderHeaderTextValue').each(function() {
                        	jQuery(this).removeClass('tableBuilderHeaderSortable');
                        });
                        if(jQuery('.tableBuilderSortWrapper')[0]) {
                        	jQuery('.tableBuilderSortWrapper').addClass('tableBuilderSearchAllHidden');
                        	if (!jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.show_search && !(jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.show_row_options || jQuery('.tableBuilderSearchView').hasClass('tableBuilderSearchViewHidden'))) {
                        		jQuery('.tableBuilderSearchBar').addClass('tableBuilderSearchAllHidden');
                        	}
                        }
                    } else {
                        method.table.update_table_options({
                            'sortable': true
                        });
                        jQuery('.tableBuilderHeaderTextValue').each(function() {
                        	jQuery(this).addClass('tableBuilderHeaderSortable');
                        });
                        if(jQuery('.tableBuilderSortWrapper')[0]) {
                        	jQuery('.tableBuilderSortWrapper').removeClass('tableBuilderSearchAllHidden');
                        	jQuery('.tableBuilderSearchBar').removeClass('tableBuilderSearchAllHidden');
                        } else {
                        	if(!jQuery('.tableBuilderSearchBar')[0]) {
                        		jQuery('.tableBuilderTableWrapper').before('<div class="tableBuilderSearchBar' + ((!jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.show_search && !jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.show_row_options) ? ' tableBuilderSearchBarSortOnly' : '') + '"><div class="tableBuilderSearchBarInner"><div class="clearLeft"></div></div></div>');
                        	}
                        	jQuery('.tableBuilderSearchBarInner .clearLeft').after('<div class="tableBuilderSortWrapper' + ((!jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.show_search && !jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.show_row_options) ? ' tableBuilderSortWrapperOnly' : '') + '"><div class="buttonItem transitionAll tableBuilderDropDown tableBuilderSortToggleButton" id="toggle_sort_rows"><div class="tableBuilderSearchRowButtonText">Sort By</div><div class="tableBuilderCarrotDown"></div></div><ul id="toggle_visible_sort_list" class="transitionAll tableBuilderDropDownList tableBuilderSearchSortList"></ul></div>');
                        	var h = 0;
                        	jQuery('.tableBuilderTableHeaderWrapper').find('.tableBuilderHeaderText').each(function() {
	                        	jQuery('#toggle_visible_sort_list').append('<li class="buttonItem transitionAll tableBuilderDropDownListItem' + ((h == jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.sort_column) ? ' tableBuilderDropDownListItemActive' : '') + '" data-value="table_builder_header_' + h + '">' + jQuery('#the_table_wrapper').data()['dataviz.table_builder']._header_list[h].replace(/--/g, ' ') + '</li>');
	                        	h++;
	                        });
                        }
                    }
                });
                jQuery('#tool_style_column_width').on('change', function() {
                    if (jQuery(this).val() != '') {
                        jQuery('#tool_slider_wrapper').slideDown(150);
                        if (typeof(jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.column_width[parseFloat(jQuery('#tool_style_column_width').val())]) != 'undefined' && jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.column_width[parseFloat(jQuery('#tool_style_column_width').val())] != '') {
                            var _width = jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.column_width[parseFloat(jQuery('#tool_style_column_width').val())]
                        } else {
                            var _width = ((jQuery('.tableBuilderHeaderPos_' + jQuery('#tool_style_column_width').val()).width()) / (jQuery('.tableBuilderHeaderWrapper').width())) * 100
                        }
                        jQuery('#tool_slider_holder').slider('value', _width);
                    } else {
                        jQuery('#tool_slider_wrapper').slideUp(150);
                    }
                });
                jQuery('#tool_slider_holder').slider({
                    slide: function(event, ui) {
                        jQuery('.tableBuilderHeader .tableBuilderHeaderPos_' + jQuery('#tool_style_column_width').val()).css({
                            'width': ui.value + '%'
                        });
                        jQuery('.tableBuilderBodyWrapper .tableSortRow .tableRowInfoPos_' + jQuery('#tool_style_column_width').val()).css({
                            'width': ui.value + '%'
                        });
                        if (ui.value == 0) {
                            jQuery('.tableBuilderHeader .tableBuilderHeaderPos_' + jQuery('#tool_style_column_width').val()).addClass('tableBuilderHeaderHidden');
                            jQuery('.tableBuilderBodyWrapper .tableSortRow .tableRowInfoPos_' + jQuery('#tool_style_column_width').val()).addClass('tableRowInfoDataHidden');
                        } else {
                            jQuery('.tableBuilderHeader .tableBuilderHeaderPos_' + jQuery('#tool_style_column_width').val()).removeClass('tableBuilderHeaderHidden');
                            jQuery('.tableBuilderBodyWrapper .tableSortRow .tableRowInfoPos_' + jQuery('#tool_style_column_width').val()).removeClass('tableRowInfoDataHidden');
                        }
                        var _current_width = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['column_width'];
                        if (_current_width.length == 0) {
                            for (var i = 0; i < jQuery('#tool_style_column_width').children().length - 1; i++) {
                                _current_width.push('')
                            }
                        }
                        _current_width[jQuery('#tool_style_column_width').val()] = ui.value;
                        method.table.update_table_options({
                            'column_width': _current_width
                        });
                    }
                });
                method.table.format()
            },
            format: function() {
                jQuery("input[name='format_number']").click(function() {
                    if (!jQuery('#format_number_true').is(':checked')) {
                        method.table.update_table_options({
                            'format_number': false
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                        jQuery('.toolOptionExtra_format').slideDown(150);
                    } else {
                        method.table.update_table_options({
                            'format_number': true,
                            'format_column': []
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                        jQuery('.toolOptionExtra_format').slideUp(150);
                    }
                });
                jQuery('#format_column_number').on('change', function() {
                    method.table.update_table_options({
                        'format_column': jQuery('#format_column_number').val()
                    });
                    jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                    jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                });
                jQuery('#decimal_places').on('change', function() {
                    if (jQuery('#decimal_places').val() == 0) {
                        jQuery('.toolOptionExtra_decimals').slideUp(150);
                    } else {
                        jQuery('.toolOptionExtra_decimals').slideDown(150);
                    }
                    method.table.update_table_options({
                        'decimals': jQuery('#decimal_places').val()
                    });
                    jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                    jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                });
                jQuery("input[name='zero_out']").click(function() {
                    method.table.update_table_options({
                        'zero_out': jQuery('#zero_out_true').is(':checked') ? true : false
                    });
                    jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                    jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                });
                jQuery('#date_format').autocomplete({
                    source: _date_format_list,
                    minLength: 0,
                    select: function(event, ui) {
                        method.table.update_table_options({
                            'date_format': ui.item.value
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                    }
                }).bind('focus', function() {
                    jQuery(this).val('').autocomplete("search")
                });
                jQuery('#time_format').autocomplete({
                    source: _time_format_list,
                    minLength: 0,
                    select: function(event, ui) {
                        method.table.update_table_options({
                            'time_format': ui.item.value
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                        jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                    }
                }).bind('focus', function() {
                    jQuery(this).val('').autocomplete("search")
                });
                jQuery('#blank_data').on('change', function() {
                    method.table.update_table_options({
                        'blank_data': jQuery('#blank_data').val()
                    });
                    jQuery('#the_table_wrapper').table_builder('clear_table_rows', true);
                    jQuery('#the_table_wrapper').table_builder('add_table_rows', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.pagination, jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.visible_rows);
                });
                jQuery('#sort_type').on('change', function() {
                    jQuery('#sort_type_options').unbind('change');
                    if (jQuery(this).val() != '') {
                    	jQuery('#tool_dataType_wrapper').slideDown(150);
                    	jQuery('#the_table_wrapper').table_builder('check_data_type', jQuery('#the_table_wrapper').data()['dataviz.table_builder']._data[0].data[jQuery('#sort_type').val()], jQuery('#sort_type').val())
                        jQuery('#sort_type_options').val(_last_type).on('change', function() {
                            var _current_sort = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_types'];
                            if (_current_sort.length == 0) {
                                for (var i = 0; i < jQuery('#sort_type').children().length - 1; i++) {
                                    _current_sort.push('')
                                }
                            }
                            _current_sort[jQuery('#sort_type').val()] = jQuery('#sort_type_options').val();
                            method.table.update_table_options({
                                'sort_types': _current_sort
                            });
                        });
                    } else {
                        jQuery('#sort_type_options').val('');
                        jQuery('#tool_dataType_wrapper').slideUp(150);
                    }
                });
                method.table.interactive();
            },
            interactive: function() {
                jQuery('#rows_visible').autocomplete({
                    source: _number_list,
                    minLength: 0,
                    select: function(event, ui) {
                        var _value = (ui.item.value == 'All Rows') ? 1000000 : parseFloat(ui.item.value);
                        method.table.update_table_options({
                            'visible_rows': _value
                        });
                        jQuery('#the_table_wrapper').table_builder('visible_rows', _value);
                        if (_value < jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_data'].length) {
                            if (jQuery('.tableBuilderSearchView')[0]) {
                                jQuery('.tableBuilderSearchView').removeClass('tableBuilderSearchViewHidden');
                            } else {
                                jQuery('#the_table_wrapper').table_builder('build_row_options');
                            }

                        } else {
                            if (jQuery('.tableBuilderSearchView')[0]) {
                                jQuery('.tableBuilderSearchView').addClass('tableBuilderSearchViewHidden');
                                if (!jQuery('.tableBuilderSearchInput').is(':visible')) {
                                	jQuery('.tableBuilderSearchBar').addClass('tableBuilderSearchInputHidden');
                        			if(jQuery('#the_table_wrapper').data()['dataviz.table_builder']._settings.sortable) {
                        				jQuery('.tableBuilderSearchBar').addClass('tableBuilderSearchAllHidden');
                        			}
                                } 
                            }
                        }
                    }
                }).bind('focus', function() {
                    jQuery(this).val('').autocomplete("search")
                });
                jQuery('#sort_column').on('change', function() {
                    if (jQuery('#sort_column').val() != 'null' && jQuery('#sort_column').val() != null) {
                        method.table.update_table_options({
                            'sort_column': jQuery('#sort_column').val()
                        });
                        if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['ranking']) {
                            method.table.update_table_options({
                           	 	'ranking_set': false
                        	});
                        }
                        jQuery('#the_table_wrapper').table_builder('sort', jQuery('#sort_column').val());
                        jQuery('.tableBuilderDropDownListItemActive').removeClass('tableBuilderDropDownListItemActive');
                        jQuery('*[data-value="table_builder_header_' + jQuery('#sort_column').val() + '"]').addClass('tableBuilderDropDownListItemActive');
                    } else {
                        if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['ranking']) {
                            method.table.update_table_options({
                           	 	'ranking_set': false
                        	});
                        }
                        method.table.update_table_options({
                            'sort_column': null
                        });
                        jQuery('#the_table_wrapper').table_builder('clear_search');
                        jQuery('.tableBuilderHeaderSortableActive').removeClass('tableBuilderHeaderSortableDesc').removeClass('tableBuilderHeaderSortableAsc');
                        jQuery('#toggle_visible_sort_list .tableBuilderDropDownListItemActive').removeClass('tableBuilderDropDownListItemActive');
                    }
                });
                jQuery("input[name='sort_order']").click(function() {
                    var _order = (jQuery("#sort_order_asc").is(':checked')) ? 'asc' : 'desc'
                    method.table.update_table_options({
                        'sort_order': _order,
                        'sort_default' : _order
                    });
                    if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['ranking']) {
                        method.table.update_table_options({
                        	'ranking_set': false
                        });
                    }
                    if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_order'] != _order) {
                        jQuery('#the_table_wrapper').table_builder('sort', jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_column']);
                    }
                });
                jQuery("input[name='ranking']").click(function() {
                    method.table.update_table_options({
                        'ranking': jQuery('#ranking_true').is(':checked') ? true : false
                    });
                    var _column = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_column'];
                    if (!jQuery('#ranking_true').is(':checked')) {
                        if (_column !== null) {
                            _column--;
                            method.table.update_table_options({
                                'sort_column': _column
                            });
                        }
                        if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_header_list'][0] == '#') {
                        	jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_header_list'].shift();
                        }
                        if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_types'].length > 0) {
                            _current = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_types'];
                            _current.shift();
                            method.table.update_table_options({
                                'sort_types': _current
                            });
                        }
                        method.table.update_table_options({
                        	'ranking_set': false
                        });
                        jQuery('#tool_style_column_width').find('option').each(function() {
                            if (jQuery(this).val() != '') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) - 1))
                            }
                        });
                        jQuery('#tool_style_column_width option:nth-child(2)').remove();
                        jQuery('#sort_column option:nth-child(2)').remove();
                        jQuery('#sort_column').find('option').each(function() {
                            if (jQuery(this).val() != 'null') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) - 1))
                            }
                        });
                        jQuery('#format_column_number option:nth-child(1)').remove();
                        jQuery('#format_column_number').find('option').each(function() {
                            if (jQuery(this).val() != '') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) - 1))
                            }
                        });
                        jQuery('#sort_type').find('option').each(function() {
                            if (jQuery(this).val() != '') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) - 1))
                            }
                        });
                        if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['format_column'].length > 0) {
                            method.table.update_table_options({
                                'format_column': jQuery('#format_column_number').val()
                            });
                        }
                        jQuery('#sort_type option:nth-child(2)').remove();
                    } else {
                        if (_column !== null) {
                            _column++;
                            method.table.update_table_options({
                                'sort_column': _column
                            });
                        }
                        if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_types'].length > 0) {
                            _current = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['sort_types'];
                            _current.splice(0, 0, "");
                            method.table.update_table_options({
                                'sort_types': _current
                            });
                        }
                        jQuery('#tool_style_column_width').find('option').each(function() {
                            if (jQuery(this).val() != '') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) + 1))
                            }
                        });
                        jQuery('#tool_style_column_width option:nth-child(1)').after(jQuery("<option></option>").attr("value", 0).text('#'));
                        jQuery('#sort_column').find('option').each(function() {
                            if (jQuery(this).val() != 'null') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) + 1))
                            }
                        });
                        jQuery('#sort_column option:nth-child(1)').after(jQuery("<option></option>").attr("value", 0).text('#'));
                        jQuery('#format_column_number').find('option').each(function() {
                            if (jQuery(this).val() != '') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) + 1))
                            }
                        });
                        jQuery('#format_column_number option:nth-child(1)').before(jQuery("<option></option>").attr("value", 0).text('#'));
                        jQuery('#sort_type').find('option').each(function() {
                            if (jQuery(this).val() != '') {
                                jQuery(this).attr('value', (parseFloat(jQuery(this).val()) + 1))
                            }
                        });
                        jQuery('#sort_type option:nth-child(1)').after(jQuery("<option></option>").attr("value", 0).text('#'));
                        if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['format_column'].length > 0) {
                            method.table.update_table_options({
                                'format_column': jQuery('#format_column_number').val()
                            });
                        }
                        method.table.update_table_options({
                        	'ranking_set': true
                        });
                    }
                    jQuery('#the_table_wrapper').table_builder('refresh_data');
                })
                jQuery('#refresh_data_min').autocomplete({
                    source: _minutes_list,
                    minLength: 0,
                    select: function(event, ui) {
                        var _value = parseFloat(ui.item.value)
                        method.table.update_table_options({
                            'refresh_data': _value
                        });
                        jQuery('#the_table_wrapper').table_builder('refresh_data');
                    }
                }).bind('focus', function() {
                    jQuery(this).val('').autocomplete("search")
                }).on('blur', function() {
                    if (jQuery('#refresh_data_min').val() == '' || jQuery('#refresh_data_min').val() == 'Insert a number of minutes') {
                        method.table.update_table_options({
                            'refresh_data': -1
                        });
                    }
                });
                method.table.saves();
            },
            saves: function() {
            	jQuery('*[data-role="tool_save_download"]').on('click', function() {
            		jQuery('.containerPreloaderModal').removeClass('hiddenContainer');
            		method.tool_setup.toggle_option_buttons(jQuery('*[data-role="save_options"]'))
            		var zip = new JSZip();
            		method.download.get_external(zip, ['css/table_builder.'+_version_num+'.css','css/table_builder.min.'+_version_num+'.css', 'js/jquery-1.11.2.min.js', 'js/respond.js', 'js/jquery.table_builder.'+_version_num+'.js', 'js/jquery.table_builder.min.'+_version_num+'.js'], 0)
            	});
            	jQuery('*[data-role="tool_save_embed"]').on('click', function() {
            		jQuery('.containerSaveModal').removeClass('hiddenContainer');
            		method.tool_setup.toggle_option_buttons(jQuery('*[data-role="save_options"]'))
            		jQuery('*[data-role="embed_output"]').val('<link rel="stylesheet" type="text/css" href="css/table_builder.min.'+_version_num+'.css">\n'+((jQuery.isEmptyObject(method.table.output_custom_styles(true))) ? '' : (method.table.output_css()+'\n\t'))+'<script type="text/javascript" src="js/jquery.table_builder.min.'+_version_num+'.js"></script>\n'+method.table.output_javascript());
            		jQuery('*[data-role="javascript_output"]').val('jQuery("#'+jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['random_id']+'").table_builder(' + method.table.output_custom_settings(false) + ');');
            		jQuery('*[data-role="style_output"]').val(method.table.output_custom_styles(false));
            	});
            	jQuery('.toolOptionUnitTitleClose').on('click', function() {
            		jQuery('.containerSaveModal').addClass('hiddenContainer');
            	});
            	jQuery('*[data-role="save_tab_embed"]').on('click', function() {
            		jQuery('.modalTabActive').removeClass('modalTabActive');
            		jQuery(this).addClass('modalTabActive');
            		jQuery('*[data-role="embed_output"]').removeClass('hiddenContainer');
            		jQuery('*[data-role="javascript_output"]').addClass('hiddenContainer');
            		jQuery('*[data-role="style_output"]').addClass('hiddenContainer');
            	});
            	jQuery('*[data-role="save_tab_javascript"]').on('click', function() {
            		jQuery('.modalTabActive').removeClass('modalTabActive');
            		jQuery(this).addClass('modalTabActive');
            		jQuery('*[data-role="embed_output"]').addClass('hiddenContainer');
            		jQuery('*[data-role="javascript_output"]').removeClass('hiddenContainer');
            		jQuery('*[data-role="style_output"]').addClass('hiddenContainer');
            	});
            	jQuery('*[data-role="save_tab_style"]').on('click', function() {
            		jQuery('.modalTabActive').removeClass('modalTabActive');
            		jQuery(this).addClass('modalTabActive');
            		jQuery('*[data-role="javascript_output"]').addClass('hiddenContainer');
            		jQuery('*[data-role="javascript_output"]').addClass('hiddenContainer');
            		jQuery('*[data-role="style_output"]').removeClass('hiddenContainer');
            	});
            	var a = document.getElementById("embed_output");
            	a.onfocus = function() {
                	a.select();
	                a.onmouseup = function() {
    	                a.onmouseup = null;
    	                jQuery('#embed_output').scrollTop(0);
        	            return false
            	    }
            	}
            	var b = document.getElementById("javascript_output");
            	b.onfocus = function() {
                	b.select();
	                b.onmouseup = function() {
    	                b.onmouseup = null;
    	                jQuery('#javascript_output').scrollTop(0);
        	            return false
            	    }
            	}
            	var c = document.getElementById("style_output");
            	c.onfocus = function() {
                	c.select();
	                c.onmouseup = function() {
    	                c.onmouseup = null;
        	            return false
            	    }
            	}
            },
            styles: function() {
            	jQuery('.dropDownText').on('click', function() {
            		(jQuery('#menu_dropdown_text').hasClass('dropDownMenuActive')) ? jQuery('#menu_dropdown_text').removeClass('dropDownMenuActive') : jQuery('#menu_dropdown_text').addClass('dropDownMenuActive');
            	});
            	jQuery('#menu_dropdown_text').find('.dropDownItem').each(function() {
            		jQuery(this).on('click', function() {
            			if (!jQuery(this).hasClass('dropDownItemNotActive')) {
            				jQuery('.dropDownItemActive').removeClass('dropDownItemActive');
            				jQuery(this).addClass('dropDownItemActive');
            				jQuery('.toolOptionSubCatActive').slideUp(150).removeClass('toolOptionSubCatActive');
            				jQuery('.toolOptionTextStyle_'+jQuery(this).attr('data-value')).addClass('toolOptionSubCatActive').slideDown(150);
            				jQuery('.dropDownText').html(jQuery(this).html());
            				jQuery('#menu_dropdown_text').removeClass('dropDownMenuActive');
            			}
            		});
            	});
                jQuery('#tool_style_table_font_family').on('change', function() {
                    method.table.update_style_settings({
                        'body-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_size').on('change', function() {
                    method.table.update_style_settings({
                        'body-font-size': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_table_link_font_family').on('change', function() {
                    method.table.update_style_settings({
                        'body-link-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_button_font').on('change', function() {
                    method.table.update_style_settings({
                        'button-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_button_size').on('change', function() {
                    method.table.update_style_settings({
                        'button-font-size': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_table_title_font').on('change', function() {
                    method.table.update_style_settings({
                        'title-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_title_size').on('change', function() {
                    method.table.update_style_settings({
                        'title-font-size': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_table_copyblock_font').on('change', function() {
                    method.table.update_style_settings({
                        'copyblock-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_copyblock_size').on('change', function() {
                    method.table.update_style_settings({
                        'copyblock-font-size': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_table_source_font').on('change', function() {
                    method.table.update_style_settings({
                        'source-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_source_size').on('change', function() {
                    method.table.update_style_settings({
                        'source-font-size': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_table_search_font').on('change', function() {
                    method.table.update_style_settings({
                        'search-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_search_size').on('change', function() {
                    method.table.update_style_settings({
                        'search-font-size': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_table_column_font').on('change', function() {
                    method.table.update_style_settings({
                        'column-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_column_size').on('change', function() {
                    method.table.update_style_settings({
                        'column-font-size': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_column_border_width').on('change', function() {
                    method.table.update_style_settings({
                        'column-border-width': (jQuery(this).val() + 'px')
                    });
                });
                jQuery('#tool_style_table_rows_font').on('change', function() {
                    method.table.update_style_settings({
                        'rows-font-family': jQuery(this).val()
                    });
                });
                jQuery('#tool_style_table_font_rows_size').on('change', function() {
                    method.table.update_style_settings({
                        'rows-font-size': (jQuery(this).val() + 'px')
                    });
                });
                method.table.color_changes();
            },
            color_changes: function() {
                var _color_parent;
                jQuery('.toolStyleChoiceColorSelector').ColorPicker({
                    color: '#' + jQuery(this).find('.toolStyleChoiceColorInput').val(),
                    onSubmit: function(hsb, hex, rgb, el) {
                        jQuery(el).val(hex);
                        jQuery(el).ColorPickerHide();
                    },
                    onBeforeShow: function() {
                        jQuery(this).ColorPickerSetColor('#' + jQuery(this).find('.toolStyleChoiceColorInput').val());
                        _color_parent = jQuery(this);
                    },
                    onHide: function(colpkr) {
                        if (_color_parent.attr('id') == 'tool_style_choice_column_arrow_color') {
                            method.table.update_style_settings({
                                'column-arrow-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_table_font_color') {
                            method.table.update_style_settings({
                                'body-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_table_link_font_color') {
                            method.table.update_style_settings({
                                'body-link-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_table_link_font_color_hover') {
                            method.table.update_style_settings({
                                'body-link-font-color-hover': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_font_color') {
                            method.table.update_style_settings({
                                'button-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_background_color') {
                            method.table.update_style_settings({
                                'button-background-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_background_color_hover') {
                            method.table.update_style_settings({
                                'button-background-color-hover': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_background_color_inactive') {
                            method.table.update_style_settings({
                                'button-background-color-inactive': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_title_color') {
                            method.table.update_style_settings({
                                'title-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_copyblock_color') {
                            method.table.update_style_settings({
                                'copyblock-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_source_color') {
                            method.table.update_style_settings({
                                'source-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_search_font_color') {
                            method.table.update_style_settings({
                                'search-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_search_background_color') {
                            method.table.update_style_settings({
                                'search-background-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_search_input_color') {
                            method.table.update_style_settings({
                                'search-background-input-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_column_font_color') {
                            method.table.update_style_settings({
                                'column-font-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_headers_background_color') {
                            method.table.update_style_settings({
                                'column-background-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_column_border_color') {
                            method.table.update_style_settings({
                                'column-border-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_column_arrow_color') {
                            method.table.update_style_settings({
                                'column-arrow-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_even_font_color') {
                            method.table.update_style_settings({
                                'rows-font-even-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_odd_font_color') {
                            method.table.update_style_settings({
                                'rows-font-odd-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_even_background_color') {
                            method.table.update_style_settings({
                                'rows-background-even-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_odd_background_color') {
                            method.table.update_style_settings({
                                'rows-background-odd-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_even_border_color') {
                            method.table.update_style_settings({
                                'rows-border-color': '#' + _color_parent.find('.toolStyleChoiceColorInput').val()
                            });
                        }
                    },
                    onChange: function(hsb, hex, rgb) {
                        _color_parent.find('.toolStyleChoiceColor').css({
                            'background-color': '#' + hex
                        });
                        _color_parent.find('.toolStyleChoiceColorInput').val(hex)
                        if (_color_parent.attr('id') == 'tool_style_choice_table_font_color') {
                            jQuery('.tableBuilderWrapper').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_table_link_font_color') {
                            jQuery('.tableBuilderWrapper a').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_table_link_font_color_hover') {
                            jQuery('.tableBuilderWrapper a').mouseover(function() {
                                jQuery(this).css({
                                    'color': '#' + hex
                                });
                            }).mouseout(function() {
                                jQuery(this).css({
                                    'color': _table_styles['body-link-font-color']['value']
                                });;
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_font_color') {
                            jQuery('.tableBuilderWrapper .buttonItem').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_background_color') {
                            jQuery('.tableBuilderWrapper .buttonItem').css({
                                'background-color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_background_color_hover') {
                            jQuery('.tableBuilderWrapper .buttonItem').mouseover(function() {
                                jQuery(this).css({
                                    'background-color': '#' + hex
                                });
                            }).mouseout(function() {
                                jQuery(this).css({
                                    'background-color': _table_styles['button-background-color']['value']
                                });
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_button_background_color_inactive') {
                            jQuery('.tableBuilderNotActiveBTN').css({
                                'background-color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_title_color') {
                            jQuery('.tableBuilderTitleWrapper').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_copyblock_color') {
                            jQuery('.tableBuilderSubheadWrapper').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_search_font_color') {
                            jQuery('.tableBuilderSearchBar').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_search_background_color') {
                            jQuery('.tableBuilderSearchBar').css({
                                'background-color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_column_font_color') {
                            jQuery('.tableBuilderHeaderTextValue').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_headers_background_color') {
                            jQuery('.tableBuilderHeader').css({
                                'background-color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_column_border_color') {
                            jQuery('.tableBuilderHeaderWrapper').css({
                                'borderColor': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_even_font_color') {
                            jQuery('.tableSortEven .tableRowInfo').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_even_background_color') {
                            jQuery('.tableSortEven').css({
                                'background-color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_even_border_color') {
                            jQuery('.tableSortEven').css({
                                'border-color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_odd_font_color') {
                            jQuery('.tableSortOdd .tableRowInfo').css({
                                'color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_rows_odd_background_color') {
                            jQuery('.tableSortOdd').css({
                                'background-color': '#' + hex
                            });
                        }
                        if (_color_parent.attr('id') == 'tool_style_choice_column_arrow_color') {
                            jQuery('#custom_styelsheet').append('.tableBuilderHeaderSortable:before{border-top-color:#' + hex + '}.tableBuilderHeaderSortable:after{border-bottom-color:#' + hex + '}.tableBuilderHeaderSortableDesc:before{border-top-color:#' + hex + '}.tableBuilderHeaderSortableAsc:after{border-bottom-color:#' + hex + '}');
                        }
                    }
                }).bind('click', function() {
                    jQuery(this).ColorPickerSetColor('#' + jQuery(this).find('.toolStyleChoiceColorInput').val());
                });
            },
            output_custom_settings: function(a) {
                var _updates = {}
                for (i in jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_defaults']) {
                    if (jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_defaults'][i] != jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings'][i]) {
                        if (jQuery.type(jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_defaults'][i]) != 'array') {
                            _updates[i] = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings'][i]
                        }
                        if (jQuery.type(jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_defaults'][i]) == 'array') {
                            if (!method.table.test_array(jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_defaults'][i], jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings'][i])) {
                                _updates[i] = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings'][i]
                            }
                        }
                    }
                }
                if (!a) {
            	    delete _updates['random_id'];
            	}
                var _settings = JSON.stringify(_updates, null, '')
                return _settings.replace(/\[[^\]]*?\]/g, function(g0, g1) {
                    return g0.replace(/\t/g, '').replace(/\n/g, '').replace(/\r/g, '');
                });
            },
            output_custom_styles: function(a) {
                //var _styles = JSON.stringify(_custom_styles, null, '').replace(/\\"/g, "'").replace(/\"/g, "").replace(/:{/g, '{').replace(/},/g, '} ').replace(/,/g, ';');
                //return _styles.substring(1, _styles.length-1);
                var _styles = [], _the_style = '';
                for (i in _tablebuilder_styles) {
                	if (_table_styles[i].value != _custom_styles[i].value) {
                		if (a) {
                			_tablebuilder_styles[i].name = i;
                		}
                		_styles.push(_tablebuilder_styles[i]);
                	}
                }
                if (a) {
                	return _styles
                }	
                for (s in _styles) {
                	for (m in _styles[s].css) {
	                	if (typeof(_styles[s]['output']) == 'string') {
	                		_the_style += _styles[s].css[m] + '{'+_styles[s]['output']+':'+ _styles[s].value+';}';
	                	} else {
	                		for (p in _styles[s]['output']) {
		                		_the_style += _styles[s].css[m] + '{'+_styles[s]['output']+':'+ _styles[s].value+';}';
		                	}
	                	}
	                }
                }
                return _the_style;
            },
            test_array: function(a, b) {
                if (a.length == 0 && b.length == 0) {
                    return true
                }
                if (a.length != b.length) {
                    return false
                }
                for (var i = 0; i < a.length; i++) {
                    if (a[i] != b[i]) {
                        return false
                    }
                }
                return true
            },
            output_javascript: function() {
            	var _id = jQuery('#the_table_wrapper').data()['dataviz.table_builder']['_settings']['random_id'];
            	var _js = "<div id='"+_id+"'>&nbsp;</div>\n";
            	_js += '<script type="text/javascript">\njQuery(document).ready(function() {\n\tjQuery("#'+_id+'").table_builder(';
            	_js += method.table.output_custom_settings(false) +');\n})\n</';
            	_js += 'script>'
            	return _js;
            },
            output_css: function() {
            	var _css = "<style text='text/css'>\n";
            	_css += method.table.output_custom_styles(false) +'\n</';
            	_css += 'style>';
            	return _css;
            }
        }
    }
    return method;
})();