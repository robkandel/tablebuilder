////////////////////////////////////////////////////||
// ROB KANDEL  										||
// kandelrob@gmail.com								||
// 													||
// created 05.18.15	| updated 05.18.15				||
// dataviz_wiki.js									||
// version 0.0.2									||
////////////////////////////////////////////////////||


var dataviz_wiki = (function() {
	if ( ! window.console ) console = { log: function(){} };
	var _current_state = 'home';
    var _last_type;
	var method = {
		init: function() {
			window.onkeydown = function(e) {
    			if(e.keyCode == 32 && e.target == document.body) {
				    e.preventDefault();
				    return false;
				}
			};
			method.check_query();
			jQuery('.menuButton').on('click', function() {
        		if (jQuery(this).hasClass('navIconActive')) { 
        			jQuery(this).removeClass('navIconActive');
	        		jQuery('#nav_list').removeClass('navListWrapperActive');
    	    	} else { 
        			jQuery(this).addClass('navIconActive');
        			jQuery('#nav_list').addClass('navListWrapperActive');
        		}
	        });
            jQuery('.optionWrapper').find('.stateButton').each(function() {
                jQuery(this).on('click', function() {
                	var _state = jQuery(this).attr('data-role').split('state_')[1];
                	method.toggle_nav_buttons(_state);
                	_current_state = _state;
                });
            });
            
            jQuery('.optionWrapper').find('.link').each(function() {
            	jQuery(this).on('click', function() {
    	        	method.toggle_rail_nav(jQuery(this).attr('data-role').split('_'));
    	        });
            	
            });
            jQuery('.leftRailOptions').find('.sectionCategory').each(function() {
            	jQuery(this).on('click', function() {
    	        	method.toggle_rail_nav(jQuery(this).attr('data-role').split('_'));
    	        });
            	
            });
            jQuery('.rightRail').find('.link').each(function() {
            	jQuery(this).on('click', function() {
    	        	method.toggle_rail_nav(jQuery(this).attr('data-role').split('_'));
    	        });
            	
            });
		},
		toggle_nav_buttons: function(a) {
            jQuery('.stateButtonActive').removeClass('stateButtonActive');
            jQuery('*[data-role="state_'+a+'"]').addClass('stateButtonActive');
            if (a == 'home') {
            	method.toggle_rail_nav(jQuery('div[data-role="home"]').attr('data-role').split('_'));
            } else if (a == 'dev') {
            	method.toggle_rail_nav(jQuery('div[data-role="dev_options"]').attr('data-role').split('_'));
            } else if (a == 'change') {
            	method.toggle_rail_nav(jQuery('div[data-role="change_log"]').attr('data-role').split('_'));
            }
        },
        check_query: function() {
        	method.toggle_rail_nav(((window.location.hash) ? (window.location.hash.split(':')): ['home', '']));
        },
        toggle_rail_nav: function(a) {
        	var _section = a[0].replace(/#/g, ''), _cat = ((a.length > 1) ? a[1] : '');
        	jQuery('.stateButtonActive').removeClass('stateButtonActive');
        	jQuery('.sectionHighlight').removeClass('sectionHighlight');
        	jQuery('.infoContainerActive').removeClass('infoContainerActive');
        	if (jQuery('div[data-name="'+_section+((_cat != '') ? ('_' + _cat) : '')+'"]')[0]) {
    	    	jQuery('div[data-role="state_'+_section+'"]').addClass('stateButtonActive');
	        	jQuery('div[data-role="'+_section+((_cat != '') ? ('_' + _cat) : '')+'"]').addClass('sectionHighlight');
	        	jQuery('div[data-name="'+_section+((_cat != '') ? ('_' + _cat) : '')+'"]').addClass('infoContainerActive');
    	    	window.location.hash = _section + ((_cat != '') ? (':'+_cat) : '');
    	    } else {
    	    	jQuery('div[data-name="preloader"]').addClass('infoContainerActive');
    	    }
        }
	};
	return method;
})();