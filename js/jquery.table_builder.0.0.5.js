////////////////////////////////////////////////////||
// ROB KANDEL  										||
// kandelrob@gmail.com								||
// 													||
// created 04.02.15	| updated 05.24.15				||
// jquery.table_builder.js							||
// version 0.0.5									||
////////////////////////////////////////////////////||

;(function(jQuery, window, document, undefined) {

    function tb(element, options) {
        this._element = jQuery(element);
        this._settings = jQuery.extend({}, tb._defaults, options);
        this._defaults = jQuery.extend(true, {}, tb._defaults);
        this.setup();
    };

    tb._name = 'table_builder_widget';
    tb._version = '0.0.5';

    tb._defaults = {
        random_id: null,
        src: null,
        external_data: false,
        responsive_table: true,
        table_class: null,
        table_title: null,
        table_copyblock: null,
        table_credit: null,
        table_source: null,
        table_source_link: null,
        fixed_header: true,
        repeat_header: false,
        show_search: true,
        search_input_text: 'Search table',
        search_button_text: 'Search',
        show_row_options: true,
        visible_row_options: [10, 25, 50, 100, 1000000],
        visible_rows: 25,
        sortable: true,
        sort_column: null,
        sort_order: 'desc',
        sort_types: [],
        column_width: [],
        ranking: false,
        bold_sort: true,
        format_number: true,
        format_column: [],
        blank_data: '-',
        decimals: 2,
        zero_out: false,
        date_format: 'MMMM DD, YYYY',
        time_format: 'hh:mm A',
        refresh_data: 0,
        row_classes: {},
        column_classes: {}
    };

    tb.prototype.setup = function() {
        this.trigger('initialize');
        if (this._settings.src == null && !this._element.is('table')) {
            alert('Please enter table data');
            this.trigger('failed', {
                action: {
                    name: 'initialize',
                    error: {
                        message: 'table source not provided'
                    }
                }
            });
            return false
        }
        this.check_css_sheet();
    }
    tb.prototype.check_css_sheet = function() {
    	if (!jQuery("link[href='https://raw.githubusercontent.com/robkandel/tablebuilder/gh-pages/css/table_builder.min."+tb._version+".css']").length) {
    		jQuery('<link href="https://raw.githubusercontent.com/robkandel/tablebuilder/gh-pages/css/table_builder.min./table_builder.min.'+tb._version+'.css" rel="stylesheet">').appendTo("head");
    	}
    	this.init();
    }
    tb.prototype.init = function() {
    	var _self = this;
        this.trigger('building_table');
        var tableWrapper = document.createElement('div');
        if (this._element.is('table')) {
            this._element.parent().append(tableWrapper).addClass('tableBuilderNewParent');
            this._element.addClass('tableBuilderLegacy');
            this._element = this._element.parent();
        } else {
            this._element.append(tableWrapper);
        }
        jQuery(tableWrapper).addClass('tableBuilderWrapper').attr('id', _self.generate_random_id());
        if (this._settings.table_class != null) {
            jQuery(tableWrapper).addClass(this._settings.table_class);
        };
        jQuery(tableWrapper).addClass(((this._settings.responsive_table) ? 'tableBuilderWrapperResponsive' : 'tableBuilderWrapperNotResponsive'));
        if (this._settings.table_title != null && this._settings.table_title != '') {
            this.table_title(this._settings.table_title);
        }
        if (this._settings.table_copyblock != null && this._settings.table_copyblock != '') {
            this.table_copyblock(this._settings.table_copyblock);
        }
        if (this._settings.show_search || this._settings.show_row_options) {
            this.search_wrapper();
        }
        if (this._settings.sortable) {
            this._settings.sort_default = this._settings.sort_order.toLowerCase();
            this.build_small_sorter();
        }
        this.build_preloader();
        if (!this._element.is('table') && (this._settings.external_data || typeof(this._settings.src) == 'string')) {
            this._settings.external_data = true;
            this.get_google_data(this._settings.src);
        } else if (this._element.find('.tableBuilderLegacy')[0]) {
            this.parse_existing_table();
        } else {
            this.parse_data(this._settings.src);
        }
        this.clear_all(this._element.find('.tableBuilderWrapper'));
    }
    tb.prototype.search_wrapper = function() {
        var _search = '<div class="tableBuilderSearchBar' + ((!this._settings.show_search && !this._settings.show_row_options) ? ' tableBuilderSearchBarSortOnly' : '') + '"><div class="tableBuilderSearchBarInner"></div></div>';
        (this._element.find('.tableBuilderTableWrapper')[0]) ? ((this._element.find('#table_builder_sort_wrapper')[0]) ? this._element.find('#table_builder_sort_wrapper').before(_search) : this._element.find('#table_builder_table_wrapper').before(_search)) : this._element.find('.tableBuilderWrapper').append(_search);
        if (this._settings.show_search) {
            this.build_search({
                input: this._settings.search_input_text,
                button: this._settings.search_button_text
            });
        }
        if (this._settings.show_row_options) {
            this.build_row_options();
        }
        if (this._settings.sortable) {
            var clearAll = document.createElement('div');
            this._element.find('.tableBuilderSearchBarInner').append(clearAll);
            jQuery(clearAll).addClass('clearLeft');
        } else {
            this.clear_all(this._element.find('.tableBuilderSearchBarInner'));
        }
    }
    tb.prototype.build_search = function(_input_text) {
        if (!this._element.find('.tableBuilderSearchBar')[0]) {
            this.search_wrapper();
        }
        if (!this._element.find('.tableBuilderSearchInput')[0]) {
            var _filter_input = '<div class="tableBuilderSearchInput"><span class="tableBuilderSearchInputWrapper"><input type="text" class="tableBuilderInputField transitionAll" id="table_builder_search_input_field" value="' + (('input' in _input_text) ? _input_text.input : this._settings.search_input_text) + '"/><span class="buttonItem transitionAll tableBuilderCloseBtn" id="close_search"><span class="ui-icon transitionAll"></span></span></span><span class="tableBuilderSearchInputText buttonItem transitionAll tableBuilderButton" id="table_builder_search_input_text">' + (('button' in _input_text) ? _input_text.button : this._settings.search_button_text) + '</span></div>';
            (this._element.find('.tableBuilderSearchView')[0]) ? this._element.find('.tableBuilderSearchView').before(_filter_input): this._element.find('.tableBuilderSearchBarInner').append(_filter_input);
            this.create_search_action();
        } else {
            this._element.find('#table_builder_search_input_field').val((('input' in _input_text) ? _input_text.input : this._settings.search_input_text));
            this._element.find('#table_builder_search_input_text').html((('button' in _input_text) ? _input_text.button : this._settings.search_button_text));
            this.update({
                search_input_text: (('input' in _input_text) ? _input_text.input : this._settings.search_input_text),
                search_button_text: (('button' in _input_text) ? _input_text.button : this._settings.search_button_text)
            });
        }
    }
    tb.prototype.build_row_options = function() {
        if (!this._element.find('.tableBuilderSearchBar')[0]) {
            this.search_wrapper();
        }
        if (!this._element.find('.tableBuilderSearchView')[0]) {
            var _view_options = '<div class="tableBuilderSearchView"><div class="buttonItem transitionAll tableBuilderDropDown tableBuilderSearchRowButton" id="toggle_visible_rows"><div class="tableBuilderSearchRowButtonText">Visible Rows</div><div class="tableBuilderCarrotDown"></div></div></div>';
            (this._element.find('.tableBuilderSearchInput')[0]) ? this._element.find('.tableBuilderSearchInput').after(_view_options): this._element.find('.tableBuilderSearchBarInner').append(_view_options);
            this.clear_all(this._element.find('#toggle_visible_rows'));
            this.build_row_options_dropdown(this._settings.visible_row_options);
            this._element.find('#toggle_visible_rows').on('click', function() {
          	  ((jQuery(this).find('#toggle_visible_rows_list').hasClass('tableBuilderDropDownListActive')) ? jQuery(this).find('#toggle_visible_rows_list').removeClass('tableBuilderDropDownListActive') : jQuery(this).find('#toggle_visible_rows_list').addClass('tableBuilderDropDownListActive'));
        	});
        }
    }
    tb.prototype.build_row_options_dropdown = function(options) {
        (this._element.find('#toggle_visible_rows_list')[0]) ? this._element.find('#toggle_visible_rows_list').empty(): this._element.find('#toggle_visible_rows').append('<ul class="transitionAll tableBuilderDropDownList tableBuilderSearchRowList" id="toggle_visible_rows_list"></ul>');
        if (!Array.isArray) {
            Array.isArray = function(arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        var _optb = ((Array.isArray(options)) ? options : this._settings.visible_row_options);
        for (var i = 0; i < _optb.length; i++) {
            var _li = document.createElement('li');
            this._element.find('#toggle_visible_rows_list').append(_li);
            jQuery(_li).addClass('buttonItem').addClass('transitionAll').addClass('tableBuilderDropDownListItem');
            (_optb[i].toString().toLowerCase() == 'all' || _optb[i] == 1000000) ? jQuery(_li).attr('data-value', '1000000').html('All Rows'): jQuery(_li).attr('data-value', _optb[i]).html(_optb[i] + ' Rows');
            if (_optb[i] == this._settings.visible_rows) {
                jQuery(_li).addClass('tableBuilderDropDownListItemActive');
            }
        }
        this.create_show_row_options();
    }
    tb.prototype.build_small_sorter = function() {
        if (!this._element.find('.tableBuilderSortWrapper')[0]) {
            if (!this._element.find('.tableBuilderSearchBar')[0]) {
                this.search_wrapper();
            }
            this._element.find('.tableBuilderSearchBarInner').append('<div class="tableBuilderSortWrapper' + ((!this._settings.show_search && !this._settings.show_row_options) ? ' tableBuilderSortWrapperOnly' : '') + '"><div class="buttonItem transitionAll tableBuilderDropDown tableBuilderSortToggleButton" id="toggle_sort_rows"><div class="tableBuilderSearchRowButtonText">Sort By</div><div class="tableBuilderCarrotDown"></div></div></div>');
            this.clear_all(this._element.find('.tableBuilderSortToggleButton'));
            this.clear_all(this._element.find('.tableBuilderSearchBarInner'));
        }
    }
    tb.prototype.build_preloader = function() {
        if (!this._element.find('.tableBuilderTableWrapper')[0]) {
            this._element.find('.tableBuilderWrapper').append('<div class="tableBuilderTableWrapper"></div>');
        }
        this._element.find('.tableBuilderTableWrapper').append('<div class="tableBuilderPreloaderWrapper"><div class="tableBuilderPreloaderSpinnerWrapper"><div class="tableBuilderPreloaderSpinner"></div><div class="tableBuilderPreloaderSpinnerText">Loading Data...</div></div></div>');
    }
    tb.prototype.build_headers = function() {
        if (!this._element.find('.tableBuilderHeader')[0]) {
            if (!this._element.find('.tableBuilderTableWrapper')[0]) {
                this._element.find('.tableBuilderWrapper').append('<div class="tableBuilderTableWrapper"></div>');
            }
            this._element.find('.tableBuilderTableWrapper').append('<div class="tableBuilderTableHeaderWrapper transitionAll"><table class="tableBuilderTableHeader transitionAll' + ((this._settings.responsive_table) ? ' tableBuilderResponsive' : ' tableBuilderHeaderNotResponsive') + ((this._settings.sortable) ? ' tableBuilderSortable' : '') + ((this._settings.fixed_header) ? ' tableBuilderFixedHeader' : '') + '"><thead class="tableBuilderHeaderWrapper"><tr class="tableBuilderHeader transitionAll"></tr></thead></table></div>');
        }
        for (var h in this._header_list) {
            this._element.find('.tableBuilderHeader').append('<th class="tableBuilderHeaderText tableBuilderHeaderPos_' + h + ((h in this._settings.column_classes) ? (' ' + this._settings.column_classes[h]) : '') + ' tableBuilderHeader_' + this._columns.toString() + ((typeof(this._settings.column_width[h]) != 'undefined' && this._settings.column_width[h] === 0) ? ' tableBuilderHeaderHidden' : '') + '" id="table_builder_header_' + h + '"' + ((typeof(this._settings.column_width[h]) != 'undefined' && this._settings.column_width[h] !== '') ? (' style="width:' + this._settings.column_width[h] + '%"') : '') + '><div class="tableBuilderHeaderTextValue' + ((this._settings.sortable) ? ' tableBuilderHeaderSortable' : '') + ((h == this._settings.sort_column) ? ((this._settings.sort_order.toLowerCase() == 'desc') ? ' tableBuilderHeaderSortableDesc tableBuilderHeaderSortableActive' : ' tableBuilderHeaderSortableAsc tableBuilderHeaderSortableActive') : '') + '">' + this._header_list[h].replace(/--/g, ' ') + '</div></th>');
            if (this._settings.sortable) {
                if (!this._element.find('#toggle_visible_sort_list')[0]) {
                    var sortToggleDropdown = document.createElement('ul');
                    this._element.find('#toggle_sort_rows').append('<ul class="transitionAll tableBuilderDropDownList tableBuilderSearchSortList" id="toggle_visible_sort_list"></ul>');
                }
                if (!this._element.find('li[data-value="table_builder_header_' + h +'"]')[0]) {
	                this._element.find('#toggle_visible_sort_list').append('<li class="buttonItem transitionAll tableBuilderDropDownListItem' + ((h == this._settings.sort_column) ? ' tableBuilderDropDownListItemActive' : '') + '" data-value="table_builder_header_' + h + '">' + this._header_list[h].replace(/--/g, ' ') + '</li>');
	            }
            }
        }
        this.clear_all(this._element.find('.tableBuilderHeader'));
        if (this._settings.fixed_header) {
            this.create_fixed_header();
        }
        if (this._settings.sortable) {
            this._settings.sort_original = this._settings.sort_order;
	        this._element.find('#toggle_sort_rows').on('click', function() {
    	        ((jQuery(this).find('#toggle_visible_sort_list').hasClass('tableBuilderDropDownListActive')) ? jQuery(this).find('#toggle_visible_sort_list').removeClass('tableBuilderDropDownListActive') : jQuery(this).find('#toggle_visible_sort_list').addClass('tableBuilderDropDownListActive'));
        	});
            this.create_header_buttons_small_select();
            this.create_header_buttons();
        }
        this.build_body();
    }
    tb.prototype.build_body = function() {
        if (!this._element.find('.tableBuilderTableBody')[0]) {
            if (!this._element.find('.tableBuilderTableWrapper')[0]) {
                this._element.find('.tableBuilderWrapper').append('<div class="tableBuilderTableWrapper"></div>');
            }
            this._element.find('.tableBuilderTableWrapper').append('<div class="tableBuilderTableBodyWrapper transitionAll"><table class="tableBuilderTableBody transitionAll' + ((this._settings.responsive_table) ? ' tableBuilderResponsive' : ' tableBuilderHeaderBodyNotResponsive') + ((this._settings.sortable) ? ' tableBuilderSortable' : '') + '"><tbody class="tableBuilderBodyWrapper transitionAll"></tbody></table></div>');
        }
        if (this._settings.table_credit != null) {
            this.credit_text(this._settings.table_credit);
        }
        if (this._settings.table_source != null) {
            this.source_text({
                text: this._settings.table_source,
                link: this._settings.table_source_link
            });
        }
        this._settings.pagination = 1;
        (this._settings.sort_column != null && !isNaN(this._settings.sort_column) && this._settings.sort_column < this._columns) ? this.sort(this._settings.sort_column, this._settings.sort_order, ''): this.add_table_rows(this._data, this._settings.pagination, this._settings.visible_rows);
    }
    tb.prototype.build_pagination = function(total, current) {
        (!this._element.find('.tableBuilderMoreButtonsWrapper')[0]) ? this._element.find('.tableBuilderTableWrapper').after('<div class="tableBuilderMoreButtonsWrapper"><div class="tableBuilderMoreButtonsInnerWrapper"></div></div>'): this._element.find('.tableBuilderMoreButtonsInnerWrapper').empty();
        this._element.find('.tableBuilderMoreButtonsInnerWrapper').append('<div class="tableBuilderNextBTN tableBuilderMoreButton buttonItem transitionAll" id="table_builder_next_btn">Next</div>');
        this._element.find('#table_builder_next_btn').unbind('click');
        this._element.find('#table_builder_next_btn').on('click', jQuery.proxy(this.next, tb._this, this));
        var _total = Math.ceil(total / current);
        this._element.find('.tableBuilderMoreButtonsInnerWrapper').append('<div class="tableBuilderNumberButtonWrapper' + ((_total <= 10) ? '' : ' tableBuilderNumberButtonWrapperLarge') + '"><div class="tableBuilderNumberButtonInner"></div></div><div class="tableBuilderNumberInputWrapper" id="table_builder_number_input_wrapper"><input type="text" class="tableBuilderInputField tableBuilderNumberInputField transitionAll' + ((_total <= 10) ? ' tableBuilderNumberInputFieldSmall' : '') + '" id="table_builder_number_input_field" value="1/' + _total.toString() + '" /></div>');
        this._element.find('#table_builder_number_input_field').unbind();
        var _self = this;
        this._element.find('#table_builder_number_input_field').on('blur', 
        	jQuery.proxy(function(){
        		_self.paginate(_self._element.find('#table_builder_number_input_field').val().split('/')[0], _self)
        	})
        ).on('keyup', jQuery.proxy(function(event){
        	if (event.keyCode == 13) {
        		_self.paginate(_self._element.find('#table_builder_number_input_field').val().split('/')[0], _self)
        	}
        }));        
        this._element.find('.tableBuilderMoreButtonsInnerWrapper').append('<div class="tableBuilderPrevBTN tableBuilderMoreButton tableBuilderNotActiveBTN buttonItem transitionAll" id="table_builder_prev_btn">Prev</div>');
        this._element.find('#table_builder_prev_btn').unbind('click');
        this._element.find('#table_builder_prev_btn').on('click', jQuery.proxy(this.prev, tb._this, this));
        this.build_pagination_number_buttons(_total);
        this._settings.pagination = 1;
        this.clear_all(this._element.find('.tableBuilderMoreButtonsInnerWrapper'));
    }
    tb.prototype.build_pagination_number_buttons = function(total) {
        for (var i = 0; i < total; i++) {
            this._element.find('.tableBuilderNumberButtonInner').append('<div class="tableBuilderNumber transitionAll' + ((i == 0) ? ' tableBuilderNumberActive' : '') + '" id="table_builder_number_' + i + '">' + parseFloat(i + 1) + '</div>')
        }
        this.clear_all(this._element.find('.tableBuilderNumberButtonInner'));
        var _self = this;
        this._element.find('.tableBuilderNumberButtonInner').find('.tableBuilderNumber').each(function() {
            jQuery(this).on('click', jQuery.proxy(_self.paginate, tb._this, (parseFloat(jQuery(this).attr('id').split('table_builder_number_')[1]) + 1), _self));
        });
    }
    tb.prototype.repeat_header = function() {
        this._element.find('.tableBuilderBodyWrapper').append('<tr class="tableSortRow tableRowRepeatedHeader"></tr>');
        for (var h in this._header_list) {
            this._element.find('.tableRowRepeatedHeader').last().append('<th class="tableBuilderHeaderText tableBuilderHeaderPos_' + h + ((h in this._settings.column_classes) ? (' ' + this._settings.column_classes[h]) : '') + ' tableBuilderHeader_' + this._columns.toString() + ((typeof(this._settings.column_width[h]) != 'undefined' && this._settings.column_width[h] === 0) ? ' tableBuilderHeaderHidden' : '') + '" id="table_builder_header_' + h + '"' + ((typeof(this._settings.column_width[h]) != 'undefined' && this._settings.column_width[h] !== '') ? (' style="width:' + this._settings.column_width[h] + '%"') : '') + '><div class="tableBuilderHeaderTextValue' + ((this._settings.sortable) ? ' tableBuilderHeaderSortable' : '') + ((h == this._settings.sort_column) ? ((this._settings.sort_order.toLowerCase() == 'desc') ? ' tableBuilderHeaderSortableDesc tableBuilderHeaderSortableActive' : ' tableBuilderHeaderSortableAsc tableBuilderHeaderSortableActive') : '') + '">' + this._header_list[h].replace(/--/g, ' ') + '</div></th>');
        }
        this.clear_all(this._element.find('.tableRowRepeatedHeader').last());
        if (this._settings.sortable) {
            this.create_header_buttons();
        }
    }
    tb.prototype.no_rows_found = function() {
        this._element.find('.tableBuilderBodyWrapper').append('<div class="tableSortNoRows">No Results Found</div>');
        var _self = this;
        this._element.find('.tableSortNoRows').on('click', function() {
            jQuery(this).remove();
            _self.clear_search();
            _self._element.find('#close_search').hide();
            _self._element.find('#table_builder_search_input_field').val(_self._settings.search_input_text);
        });
    }
    tb.prototype.clear_all = function(parent) {
        var clearAll = document.createElement('div');
        parent.append(clearAll);
        jQuery(clearAll).addClass('clearAll');
    }
    tb.prototype.check_time = function(data) {
        var _has_meridian = false;
        var re = /^\d{1,2}[:]\d{2}([:]\d{2})?( [aApP][mM]?)?$/;
        if (!re.test(data)) {
            return false;
        }
        if (data.toLowerCase().indexOf("p") != -1) {
            _has_meridian = true;
        }
        if (data.toLowerCase().indexOf("a") != -1) {
            _has_meridian = true;
        }
        var _values = data.split(":");
        if ((parseFloat(_values[0]) < 0) || (parseFloat(_values[0]) > 23)) {
            return false;
        }
        if (_has_meridian) {
            if ((parseFloat(_values[0]) < 1) || (parseFloat(_values[0]) > 12)) {
                return false;
            }
        }
        if ((parseFloat(_values[1]) < 0) || (parseFloat(_values[1]) > 59)) {
            return false;
        }
        if (_values.length > 2) {
            if ((parseFloat(_values[2]) < 0) || (parseFloat(_values[2]) > 59)) {
                return false;
            }
        }
        return true;
    }
    tb.prototype.has_html = function(data) {
        return data.toString().match(/<.*?>/ig) != null ? true : false
    }
    tb.prototype.find_data = function(data, index) {
        for (var i = 0; i < this._data.length; i++) {
            if (data[i].data[index] !== '' && data[i].data[index] !== this._settings.blank_data) {
                return data[i].data[index]
            }
        }
        return data[0].data[index]
    }
	tb.prototype.generate_random_id = function(plugin) {
        var _random = '',
            _chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0; i < 20; i++) {
            _random += _chars[Math.round(Math.random() * (_chars.length - 1))];
        }
        this._settings.random_id = _random;
        return _random;
    }
    tb.prototype.parse_data = function(src_data) {
        this._data = [];
        this._original_data = [];
        this._header_list = [];
        this._header_list = src_data.data[0];
        this._columns = 0;
        this._columns = src_data.data[0].length;
        this._rows = 0;
        this._rows = src_data.data.length - 1;
        if (this._settings.ranking && this._header_list[0] != '#') {
            this._header_list.splice(0, 0, "#");
            this._columns++;
            this._settings.ranking_set = false;
        }
        for (var i = 1; i < src_data.data.length; i++) {
            var _row = {
                ranking: i,
                data: [],
                _class: ''
            };
            if (this._settings.ranking) {
                _row.data.push(i);
            }
            if ((i - 1) in this._settings.row_classes) {
                _row._class = (' ' + this._settings.row_classes[i - 1])
            }
            for (var r in src_data.data[i]) {
                _row.data.push(this.strip_microsoft_format(src_data.data[i][r]));
            }
            this._data.push(_row);
            this._original_data.push(_row)
        }
        if (this._element.find('.tableBuilderSearchView')[0] && this._rows < this._settings.visible_row_options[0]) {
            this._element.find('.tableBuilderSearchView').addClass('tableBuilderSearchViewHidden');
            if (!this._settings.show_search) {
                this._element.find('.tableBuilderSearchBar').addClass('tableBuilderSearchInputHidden');
                if(!this._settings.sortable) {
                	this._element.find('.tableBuilderSearchBar').addClass('tableBuilderSearchAllHidden');
                }
            }
        }
        this.trigger('parse_data_complete');
        this.build_headers();
    }
    tb.prototype.parse_existing_table = function() {
        this._data = [];
        this._original_data = [];
        this._header_list = [];
        this._columns = 0;
        this._rows = 0;
        var g = [],
            _h = [];
        var _index = 0;
        this._element.find('.tableBuilderLegacy').find('tr').each(function() {
            var e = {};
            var _counter = 0;
            jQuery(this).children().each(function() {
                if (_index == 0) {
                    _h.push(jQuery(this).html());
                }
                e[_h[_counter]] = jQuery(this).html();
                _counter++;
            });
            (_index == 0) ? g.push(_h): g.push(e);
            _index++;
        });
        this.parse_data({
            data: g
        });
    }
    tb.prototype.get_google_data = function(src_data) {
        this._data = [];
        this._original_data = [];
        this._header_list = [];
        this._columns = 0;
        this._rows = 0;
        var _self = this;
        jQuery.ajax({
            url: this.format_spreadsheet_url(src_data),
            dataType: 'jsonp',
            success: function(d) {
                _self.breakdown_google_data(d);
                if (_self._settings.refresh_data > 0) {
                    _self._refresh_data = setTimeout(function() {
                        clearTimeout(_self._refresh_data);
                        _self.refresh_data(_self._settings.refresh_data);
                    }, _self._settings.refresh_data * 60000);
                }
            },
            error: function(xhr, status, error) {
                _self._element.find('.tableBuilderPreloaderSpinner').hide()
                _self._element.find('.tableBuilderPreloaderSpinnerText').html("Error<br/><br/> Can't Find Data");
            }
        });
    }
    tb.prototype.format_spreadsheet_url = function(url) {
        return (url.indexOf('https://spreadsheets.google.com/feeds/list/') != -1) ? url : ((url.indexOf('https://docs.google.com/') != -1) ? ('https://spreadsheets.google.com/feeds/list/' + ((url.indexOf('pub?key=') != -1) ? url.split('pub?key=')[1].split('&output=')[0] : url.split('https://docs.google.com/spreadsheets/d/')[1].split('/pubhtml')[0]) + '/1/public/values?alt=json-in-script') : url)
    }
    tb.prototype.breakdown_google_data = function(data) {
        var g = [],
            _h = []
        for (var i in data.feed.entry) {
            var e = {}
            for (var d in data.feed.entry[i]) {
                if (d.indexOf('gsx$') != -1) {
                    var m = d.toString().split('gsx$')
                    if (i == 0) {
                        _h.push(m[1])
                    }
                    e[m[1]] = data.feed.entry[i][d].$t
                }
            }
            if (i == 0) {
                g.push(_h)
            }
            g.push(e)
        }
        this.parse_data({
            data: g
        });
    }
    tb.prototype.create_header_buttons = function() {
    	var _self = this;
        this._element.find('.tableBuilderWrapper').find('.tableBuilderHeaderText').each(function() {
            jQuery(this).unbind('click');
            jQuery(this).on('click', jQuery.proxy(function(){
            	_self.header_click(jQuery(this).attr('id').split('table_builder_header_')[1])
            }));
        });
    }
    tb.prototype.toggle_header_arrows = function(current, prev) {
        this._element.find('#toggle_visible_sort_list').find('.tableBuilderDropDownListItemActive').removeClass('tableBuilderDropDownListItemActive');
        this._element.find('#toggle_visible_sort_list').find('li[data-value="table_builder_header_' + current + '"]').addClass('tableBuilderDropDownListItemActive');
        if (current != prev) {
            this._element.find('.tableBuilderHeaderSortableActive').removeClass('tableBuilderHeaderSortableActive').removeClass('tableBuilderHeaderSortableAsc').removeClass('tableBuilderHeaderSortableDesc');
            this._element.find('#table_builder_header_' + current).find('.tableBuilderHeaderTextValue').addClass('tableBuilderHeaderSortableActive');
            (this._settings.sort_order.toLowerCase() == 'desc') ? this._element.find('#table_builder_header_' + current).find('.tableBuilderHeaderTextValue').addClass('tableBuilderHeaderSortableDesc'): this._element.find('#table_builder_header_' + current).find('.tableBuilderHeaderTextValue').addClass('tableBuilderHeaderSortableAsc');
        } else {
            ((this._settings.sort_order.toLowerCase() == 'desc') ? this._element.find('#table_builder_header_' + current).find('.tableBuilderHeaderTextValue').removeClass('tableBuilderHeaderSortableAsc').addClass('tableBuilderHeaderSortableDesc') : this._element.find('#table_builder_header_' + current).find('.tableBuilderHeaderTextValue').removeClass('tableBuilderHeaderSortableDesc').addClass('tableBuilderHeaderSortableAsc'));
        }
    }
    tb.prototype.create_show_row_options = function() {
        var _self = this;
        this._element.find('#toggle_visible_rows_list').find('.tableBuilderDropDownListItem').each(function() {
            jQuery(this).unbind('click');
            jQuery(this).on('click', function() {
                _self._settings.visible_rows = parseFloat(jQuery(this).attr('data-value'));
                _self._element.find('#toggle_visible_rows_list .tableBuilderDropDownListItemActive').removeClass('tableBuilderDropDownListItemActive');
                jQuery(this).addClass('tableBuilderDropDownListItemActive');
                _self.visible_rows(parseFloat(jQuery(this).attr('data-value')));
            });
        });
    }
    tb.prototype.create_header_buttons_small_select = function() {
        var _self = this;
        this._element.find('#toggle_visible_sort_list').find('.tableBuilderDropDownListItem').each(function() {
            jQuery(this).unbind('click');
            jQuery(this).on('click', jQuery.proxy(function(){
            	_self.header_click(jQuery(this).attr('data-value').split('table_builder_header_')[1])
            }));
        });
    }
    tb.prototype.in_format_array = function(arr, index) {
        for (var g = 0; g < arr.length; g++) {
            if (parseFloat(arr[g]) == parseFloat(index)) {
                return true;
            }
        }
        return false;
    }
    tb.prototype.create_search_action = function() {
    	var _self = this;
        this._element.find('#table_builder_search_input_field').on('focus', function() {
            if (jQuery(this).val() == _self._settings.search_input_text) {
                jQuery(this).val('');
            }
        }).on('blur', function() {
            if (jQuery(this).val() == '') {
                jQuery(this).val(_self._settings.search_input_text)
            }
        }).on('keyup', jQuery.proxy(function(event){
        	if (event.keyCode == 13) {
        		if (jQuery(this).val() != _self._settings.search_input_text && jQuery(this).val() != '') {
                    _self.search(jQuery(this).val());
                    _self._element.find('#close_search').show();
                }
        	}
        }));
        this._element.find('#table_builder_search_input_text').on('click', function() {
            if (_self._element.find('#table_builder_search_input_field').val() != '' && _self._element.find('#table_builder_search_input_field').val() != _self._settings.search_input_text) {
                _self.search(_self._element.find('#table_builder_search_input_field').val());
                _self._element.find('#close_search').show();
            }
        });
        this._element.find('#close_search').unbind('click');
        this._element.find('#close_search').on('click', function() {
            _self._element.find('#close_search').hide();
            _self._element.find('#table_builder_search_input_field').val(_self._settings.search_input_text)
            _self.clear_search();
        });
    }
    tb.prototype.create_fixed_header = function() {
    	var _self = this;
        jQuery(window).on("resize.tb_resize scroll.tb_scroll", function(e) {
            if (_self._settings.fixed_header && _self._element.find('.tableBuilderTableHeader').is(':visible')) {
                var _place_holder = _self._element.find('.tableBuilderTableBody').offset().top;
                var _view_top = jQuery(window).scrollTop();
                if (_view_top > _place_holder - 40) {
                    _self._element.find('.tableBuilderTableHeaderWrapper').css({
                        'height': _self._element.find('.tableBuilderHeaderWrapper').height()
                    });
                    _self._element.find('.tableBuilderHeaderWrapper').addClass('tableBuilderHeaderWrapperFixed').css({
                        'width': _self._element.find('.tableBuilderWrapper').width(),
                        'height': 'auto'
                    });
                } else if (_view_top <= _place_holder) {
                    _self._element.find('.tableBuilderHeaderWrapper').removeClass('tableBuilderHeaderWrapperFixed');
                    _self._element.find('.tableBuilderHeaderWrapper').css({
                        'width': '100%'
                    });
                    _self._element.find('.tableBuilderTableHeaderWrapper').css({
                        'height': 'auto'
                    });
                }
                if (_view_top > _self._element.find('.tableBuilderTableWrapper').height() + _self._element.find('.tableBuilderTableWrapper').offset().top - _self._element.find('.tableBuilderHeaderWrapper').height()) {
                    _self._element.find('.tableBuilderHeaderWrapper').removeClass('tableBuilderHeaderWrapperFixed');
                    _self._element.find('.tableBuilderHeaderWrapper').css({
                        'width': '100%'
                    });
                    _self._element.find('.tableBuilderTableHeaderWrapper').css({
                        'height': 'auto'
                    });
                }
            }
        });
    }
    tb.prototype.strip_microsoft_format = function(data) {
        return ((typeof(data) == 'string') ? data.replace(/[\u2018|\u2019|\u201A]/g, "'").replace(/[\u201C|\u201D|\u201E]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/[\u2026]/g, '...').replace(/\u02C6/g, "^").replace(/\u2039/g, "<").replace(/\u203A/g, ">").replace(/[\u02DC|\u00A0]/g, " ") : data);
    }
    tb.prototype.format_time_value = function(data) {
        var b = data.split(':');
        if (b.length == 2) {
            b[2] = 0;
        }
        if (data.toLowerCase().indexOf('pm') != -1) {
            if (parseFloat(b[0]) < 12) {
                b[0] = 12 + parseFloat(b[0])
            }
        }
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDay(), parseFloat(b[0]), parseFloat(b[1]), parseFloat(b[2]))
    }
    tb.prototype.leading_zero = function(data) {
        return ((parseFloat(data) < 10) ? ('0' + data.toString()) : data);
    }
    tb.prototype.time_hours = function(data) {
        if (parseFloat(data) > 12) {
            return parseFloat(data) - 12;
        }
        return data
    }
    tb.prototype.am_pm = function(data, format) {
        return ((parseFloat(data) >= 12) ? ((format == 'A') ? 'PM' : 'pm') : ((format == 'A') ? 'AM' : 'am'));
    }
    tb.prototype.number_ender = function(data) {
        var _num = parseFloat(data) % 10;
        if (_num == 1 && parseFloat(data) != 11) {
            return data.toString() + "st";
        }
        if (_num == 2 && parseFloat(data) != 12) {
            return data.toString() + "nd";
        }
        if (_num == 3 && parseFloat(data) != 13) {
            return data.toString() + "rd";
        }
        return data.toString() + "th";
    }
    tb.prototype.format_pretty_numbers = function(num, decimals, zero) {
        var _sym = this.format_number_symbol(num),
            _number = (num.toString().replace(/[$%+,]/g, '') * 1),
            _decimals = ((typeof(decimals) != 'undefined') ? decimals : this._settings.decimals),
            _zero = ((typeof(zero) != 'undefined') ? zero : this._settings.zero_out);
        return _sym.dollar + _sym.positive + this.add_commas((((_decimals == 0) ? parseInt(Math.round(_number)) : ((_zero) ? ((Math.round((parseFloat(_number) * Math.pow(10, (_decimals)))) / Math.pow(10, (_decimals))).toFixed(_decimals)) : (Math.round((parseFloat(_number) * Math.pow(10, (_decimals)))) / Math.pow(10, (_decimals))))))) + _sym.percent;
    }
    tb.prototype.format_number_symbol = function(num) {
        var _symbol = false,
            _dollar = '',
            _percent = '',
            _positive = '';
        if (num.toString().match(/.*[$%+,].*/ig) != null) {
            if (num.indexOf('$') != -1) {
                _dollar = '$';
            } else if (num.indexOf('+') != -1) {
                _positive = '+';
            } else if (num.indexOf('%') != -1) {
                _percent = '%';
            }
            num = parseFloat(num.toString().replace(/[$%+,]/g, ''));
            _symbol = true;
        }
        return {
            bool: _symbol,
            dollar: _dollar,
            percent: _percent,
            positive: _positive
        }
    }
    tb.prototype.format_special_numbers = function(num) {
        var _number = num.replace(/[^a-zA-Z0-9]/g, '.').split('.');
        if (_number.length == 1) {
            return $TS.prototype.tb_format_numbers(parseFloat(num));
        } else {
            return num
        }
    }
    tb.prototype.add_commas = function(num) {
        num += '';
        var x = num.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    tb.prototype.sort_by_string = function(_self) {
        return function(a, b) {
            var c = ((a.data[parseFloat(_self._settings.sort_column)] !== '' && a.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? ('' + a.data[parseFloat(_self._settings.sort_column)].replace(/[^a-zA-Z-]/g, '').toLowerCase()) : _self.move_blank_data('string')).toLowerCase();
            var d = ((b.data[parseFloat(_self._settings.sort_column)] !== '' && b.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? ('' + b.data[parseFloat(_self._settings.sort_column)].replace(/[^a-zA-Z-]/g, '').toLowerCase()) : _self.move_blank_data('string')).toLowerCase();
            return ((_self._settings.sort_order.toLowerCase() == 'desc') ? (c > d ? -1 : c < d ? 1 : 0) : (c < d ? -1 : c > d ? 1 : 0));
        }
    }
    tb.prototype.sort_by_number = function(_self) {
        return function(a, b) {
            var c = (a.data[parseFloat(_self._settings.sort_column)] !== '' && a.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? ((isNaN(a.data[parseFloat(_self._settings.sort_column)].toString().replace(/[$£€%+,]/g, '') * 1)) ? (parseFloat(_self.sort_special_numbers(a.data[parseFloat(_self._settings.sort_column)]).toString().replace(/[$£€,%+]/g, ''))) : (parseFloat(a.data[parseFloat(_self._settings.sort_column)].toString().replace(/[$£€,%+]/g, '')))) : _self.move_blank_data('number');
            var d = (b.data[parseFloat(_self._settings.sort_column)] !== '' && b.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? ((isNaN(b.data[parseFloat(_self._settings.sort_column)].toString().replace(/[$£€%+,]/g, '') * 1)) ? (parseFloat(_self.sort_special_numbers(b.data[parseFloat(_self._settings.sort_column)]).toString().replace(/[$£€,%+]/g, ''))) : (parseFloat(b.data[parseFloat(_self._settings.sort_column)].toString().replace(/[$£€,%+]/g, '')))) : _self.move_blank_data('number');
            return ((_self._settings.sort_order.toLowerCase() == 'desc') ? (c > d ? -1 : c < d ? 1 : 0) : (c < d ? -1 : c > d ? 1 : 0));
        }
    }
    tb.prototype.sort_special_numbers = function(a) {
        var z = a.replace(/[^a-zA-Z0-9]/g, '.').split('.');
        if (z.length == 1) {
            return z[0]
        } else {
            for (var i = 1; i < z.length; i++) {
                if (parseFloat(z[i]) < 10) {
                    z[i] = '0' + parseFloat(z[i]).toString();
                }
            }
            return z.join().replace(/,/g, '.');
        }
    }
    tb.prototype.sort_by_date = function(_self) {
        return function(a, b) {
            var c = (a.data[parseFloat(_self._settings.sort_column)] !== '' && a.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? (Date.parse(a.data[parseFloat(_self._settings.sort_column)])) : _self.move_blank_data('date');
            var d = (b.data[parseFloat(_self._settings.sort_column)] !== '' && b.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? (Date.parse(b.data[parseFloat(_self._settings.sort_column)])) : _self.move_blank_data('date');
            return ((_self._settings.sort_order.toLowerCase() == 'desc') ? (c > d ? -1 : c < d ? 1 : 0) : (c < d ? -1 : c > d ? 1 : 0));
        }
    }
    tb.prototype.sort_by_time = function(_self) {
        return function(a, b) {
            var c = (a.data[parseFloat(_self._settings.sort_column)] !== '' && a.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? (_self.format_time_value(a.data[parseFloat(_self._settings.sort_column)])) : _self.move_blank_data('time');
            var d = (b.data[parseFloat(_self._settings.sort_column)] !== '' && b.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? (_self.format_time_value(b.data[parseFloat(_self._settings.sort_column)])) : _self.move_blank_data('time');
            return ((_self._settings.sort_order.toLowerCase() == 'desc') ? (c > d ? -1 : c < d ? 1 : 0) : (c < d ? -1 : c > d ? 1 : 0));
        }
    }
    tb.prototype.sort_by_html = function(_self) {
        return function(a, b) {
            var c = ((a.data[parseFloat(_self._settings.sort_column)] !== '' && a.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? (_self.strip_html(a.data[parseFloat(_self._settings.sort_column)]).toLowerCase()) : _self.move_blank_data('html')).toLowerCase();
            var d = ((b.data[parseFloat(_self._settings.sort_column)] !== '' && b.data[parseFloat(_self._settings.sort_column)] !== _self._settings.blank_data) ? (_self.strip_html(b.data[parseFloat(_self._settings.sort_column)]).toLowerCase()) : _self.move_blank_data('html')).toLowerCase();
            return ((_self._settings.sort_order.toLowerCase() == 'desc') ? (c > d ? -1 : c < d ? 1 : 0) : (c < d ? -1 : c > d ? 1 : 0));
        }
    }
    tb.prototype.strip_html = function(a) {
        return a.replace(/<.*?>/g, '').toLowerCase();
    }
    tb.prototype.move_blank_data = function(a) {
        if (a == 'string' || a == 'html') {
            return (((this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'desc') || (this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'asc')) ? 'zzzzzzzzzz' : 'aaaaaaaaaa');
        } else if (a == 'number') {
            return (this._settings.sort_order.toLowerCase() == 'asc') ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        } else if (a == 'date') {
            return (((this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'desc') || (this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'asc')) ? Date.parse('3001-12-12') : Date.parse('1001-01-01'));
        } else if (a == 'time') {
            return (((this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'desc') || (this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'asc')) ? this.format_time_value('23:59:59') : this.format_time_value('00:00:00'));
        } else {
            return (((this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'desc') || (this._settings.sort_order.toLowerCase() == 'asc' && $TS._tb_settings.sort_default == 'asc')) ? 'zzzzzzzzzz' : 'aaaaaaaaaa');
        }
    }
    tb.prototype.set_ranking = function(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].data[0] = (i + 1)
        }
        return data
    }
    tb.prototype.table_title = function(title) {
        if (typeof(title) == 'undefined' && this._element.find('.tableBuilderTitleWrapper')[0]) {
            this._element.find('.tableBuilderTitleWrapper').remove();
        } else {
            if (!this._element.find('.tableBuilderTitleWrapper')[0]) {
                this._element.find('.tableBuilderWrapper').prepend('<div class="tableBuilderTitleWrapper"><div class="tableBuilderTitleText">' + title + '</div></div>');
            } else {
                this._element.find('.tableBuilderTitleText').html(title);
                this.update({
                    table_title: title
                });
            }
        }
    }
    tb.prototype.table_copyblock = function(copyblock) {
        if (typeof(copyblock) == 'undefined' && this._element.find('.tableBuilderSubheadWrapper')[0]) {
            this._element.find('.tableBuilderSubheadWrapper').remove();
        } else {
            if (!this._element.find('.tableBuilderSubheadWrapper')[0]) {
                var _subhead = '<div class="tableBuilderSubheadWrapper"><div class="tableBuilderSubheadText">' + copyblock + '</div></div>';
                (this._element.find('.tableBuilderTitleWrapper')[0]) ? this._element.find('.tableBuilderTitleWrapper').after(_subhead): this._element.find('.tableBuilderWrapper').prepend(_subhead);
            } else {
                this._element.find('.tableBuilderSubheadText').html(copyblock);
                this.update({
                    table_copyblock: copyblock
                });
            }
        }
    }
    tb.prototype.credit_text = function(credit) {
        if (typeof(credit) == 'undefined' && this._element.find('.tableBuilderCreditText')[0]) {
            this._element.find('.tableBuilderCreditText').remove();
        } else {
            if (!this._element.find('.tableBuilderSourceWrapper')[0]) {
                this._element.find('.tableBuilderTableWrapper').after('<div class="tableBuilderSourceWrapper"></div>');
            }
            if (!this._element.find('.tableBuilderCreditText')[0]) {
                this._element.find('.tableBuilderSourceWrapper').append('<div class="tableBuilderCreditText"><span class="tableBuilderCreditLabel">Produced By:</span> ' + credit + '</div>');
            } else {
                this._element.find('.tableBuilderCreditText').html('<span class="tableBuilderCreditLabel">Produced By:</span> ' + credit);
                this.update({
                    table_credit: credit
                });
            }
        }
    }
    tb.prototype.source_text = function(source) {
        if (typeof(source) == 'undefined' && this._element.find('.tableBuilderSourceText')[0]) {
            this._element.find('.tableBuilderSourceText').remove();
        } else {
            if (!this._element.find('.tableBuilderSourceWrapper')[0]) {
                this._element.find('.tableBuilderTableWrapper').after('<div class="tableBuilderSourceWrapper"></div>');
            }
            if (!this._element.find('.tableBuilderSourceText')[0]) {
                this._element.find('.tableBuilderSourceWrapper').prepend('<div class="tableBuilderSourceText">' + (("link" in source && source.link != null && source.link != '') ? ('<span class="tableBuilderSourceLink">Source:</span> <a href="' + source.link + '" target="_blank">' + source.text + '</a>') : '<span class="tableBuilderSourceLink">Source:</span> ' + source.text) + '</div>');
            } else {
                this._element.find('.tableBuilderSourceText').html((('link' in source && source.link != null && source.link != '') ? ('<span class="tableBuilderSourceLink">Source:</span> <a href="' + source.link + '" target="_blank">' + source.text + '</a>') : '<span class="tableBuilderSourceLink">Source:</span> ' + source.text));
                this.update({
                    table_source: source.text,
                    table_source_link: source.link
                });
            }
        }
    }
    tb.prototype.add_table_rows = function(data, pagination, rows) {
        if (typeof(data) == 'undefined') {
            data = this._data;
        }
        var _total = data.length,
            _temp = (typeof(rows) != 'undefined' && !isNaN(rows)) ? rows : this._settings.visible_rows;
        var _counter = 0;
        for (var i = (_temp * (pagination - 1)); i < (((_temp * pagination) > _total) ? _total : (_temp * pagination)); i++) {
            if (this._settings.repeat_header) {
                if (_counter != 0 && _counter % parseFloat(this._settings.repeat_header) == 0) {
                    this.repeat_header();
                }
            }
            this.add_row_data(data, i);
            _counter++;
        }
        if (_total > _temp && !this._element.find('.tableBuilderMoreButtonsInnerWrapper')[0]) {
            this.build_pagination(_total, _temp);
        }
        if (typeof(respond) != 'undefined') {
            respond.update()
        }
        this.trigger('build_complete');
        if (this._element.find('.tableBuilderPreloaderWrapper').is(':visible')) {
            this._element.find('.tableBuilderPreloaderWrapper').hide();
        }
        this.trigger('add_table_rows', {
            action: {
                name: 'add_table_rows',
                value: {
                    data: data,
                    pagination: pagination,
                    rows: rows
                }
            }
        });
    }
    tb.prototype.add_row_data = function(data, index) {
        this._element.find('.tableBuilderBodyWrapper').append('<tr class="tableSortRow ' + ((index % 2) ? 'tableSortOdd' : 'tableSortEven') + (data[index]._class) + '" data-ranking="' + data[index].ranking + '" data-index="' + index + '" id="table_builder_row_' + index + '"></tr>');
        for (var x = 0; x < data[index].data.length; x++) {
            this._element.find('#table_builder_row_' + index).append('<td class="tableRowInfo tableRowInfoData' + ((this._settings.bold_sort && x == this._settings.sort_column) ? ' tableRowInfoDataActive' : '') + ((x in this._settings.column_classes) ? (' ' + this._settings.column_classes[x]) : '') + ' tableRowInfoPos_' + x + ' tableRowInfo_' + this._columns.toString() + ((typeof(this._settings.column_width[x]) != 'undefined' && this._settings.column_width[x] === 0) ? ' tableRowInfoDataHidden' : '') + '" ' + ((typeof(this._settings.column_width[x]) != 'undefined' && this._settings.column_width[x] !== '') ? (' style="width:' + this._settings.column_width[x] + '%"') : '') + '>'+((this._settings.responsive_table) ? ('<div class="tableRowInfoColumn" id="table_row_column_' + index + '_' + x + '">' + this._header_list[x].replace(/--/g, ' ') + '</div>') : '')+'<div class="tableRowInfoValue" id="table_row_value_' + index + '_' + x + '">' + this.format_row_data(data[index].data[x], x) + '</div>'+((this._settings.responsive_table) ?'<div class="clearAll"></div>' : '')+'</td>');
        }
        this.clear_all(this._element.find('#table_builder_row_' + index));
        this.trigger('row_added', {
            action: {
                name: 'row_added',
                value: {
                    data: data,
                    row: index
                }
            }
        });
    }
    tb.prototype.format_row_data = function(data, row_index) {
        if (data === null || data === '') {
            return this._settings.blank_data;
        } else {
            var _type = this.check_data_type(data, row_index);
            if (_type == 'time') {
                return this.format_time(data, this._settings.time_format);
            } else if (_type == 'number') {
                if (isNaN(data.toString().replace(/[$%+,]/g, '') * 1)) {
                    return this.format_special_numbers(data, row_index);
                } else {
                    return this.format_number(data, row_index);
                }
            } else if (_type == 'date') {
                return this.format_date(data, this._settings.date_format);
            } else if (_type == 'string') {
                if (data.indexOf('@') != -1 && (data.indexOf('.com') != -1 || data.indexOf('.net') != -1 || data.indexOf('.org') != -1 || data.indexOf('.edu') != -1 || data.indexOf('.gov') != -1)) {
                    return this.format_email(data);
                } else if (data.charAt(0) == '@') {
                    return this.format_twitter(data);
                } else if (data.indexOf('.com') != -1 || data.indexOf('.net') != -1 || data.indexOf('.org') != -1 || data.indexOf('.html') != -1 || data.indexOf('.gov') != -1) {
                    return this.format_link(data);
                } else {
                    return data
                }
            } else {
                return data;
            }
            return data
        }
    }
    tb.prototype.format_time = function(data, format) {
        var _time = this.format_time_value(data),
            _format = ((typeof(format) != 'undefined') ? format : this._settings.time_format)
        return _format.replace(/hh/g, this.leading_zero(this.time_hours(_time.getHours()))).replace(/HH/g, this.leading_zero(_time.getHours())).replace(/mm/g, this.leading_zero(_time.getMinutes())).replace(/ss/g, this.leading_zero(_time.getSeconds())).replace(/A/g, this.am_pm(_time.getHours(), 'A')).replace(/a/g, this.am_pm(_time.getHours(), 'a'));
    }
    tb.prototype.format_special_numbers = function(num, index) {
        return ((num.replace(/[^a-zA-Z0-9]/g, '.').split('.').length == 1) ? this.format_number(parseFloat(num), index) : num);
    }
    tb.prototype.format_number = function(num, index) {
        return ((this._settings.format_number || (typeof(this._settings.format_column[index]) != 'undefined' && this._settings.format_column[index] === '') || this.in_format_array(this._settings.format_column, index)) ? this.format_pretty_numbers(num, this._settings.decimals, this._settings.zero_out) : num);
    }
    tb.prototype.format_date = function(data, format) {
        var _date = new Date(data),
            _format = ((typeof(format) != 'undefined') ? format : this._settings.date_format),
            _months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            _mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            _day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return _format.replace(/Do/g, this.number_ender(_date.getDate())).replace(/DD/g, this.leading_zero(_date.getDate())).replace(/D/g, _date.getDate()).replace(/MMMM/g, _months[_date.getMonth()]).replace(/MMM/g, _mon[_date.getMonth()]).replace(/MM/g, this.leading_zero((_date.getMonth() + 1))).replace(/Mo/g, this.number_ender((_date.getMonth() + 1))).replace(/MmM/g, (_date.getMonth() + 1)).replace(/YYYY/g, _date.getFullYear()).replace(/YY/g, _date.getFullYear().toString().substr(2, 2)).replace(/dddd/g, _days[_date.getDay()]).replace(/ddd/g, _day[_date.getDay()]);
    }
    tb.prototype.format_email = function(email) {
        return '<a href="mailto:' + email + '" target="_blank">' + email + '</a>';
    }
    tb.prototype.format_twitter = function(handle) {
        return '<a href="http://twitter.com/' + handle.substring(1, handle.length) + '" target="_blank">' + handle + '</a>';
    }
    tb.prototype.format_link = function(link) {
        return '<a href="' + ((link.indexOf('http://') == -1 && link.indexOf('https://') == -1) ? ('http://' + link) : link) + '" target="_blank">' + link + '</a>';
    }
    tb.prototype.check_data_type = function(data, row_index) {
    	var _type;
        if (this._settings.sort_types.length > 0 && this._settings.sort_types[parseFloat(row_index)] != null && jQuery.inArray(this._settings.sort_types[parseFloat(row_index)].toLowerCase(), ['string', 'number', 'date', 'time', 'html']) > -1) {
            _type = this._settings.sort_types[parseFloat(row_index)].toLowerCase()
        } else {
            if (this.check_time(data)) {
                _type = 'time'
            } else if (!isNaN(data)) {
                _type = 'number';
            } else if (data.toString().replace(/[,%$+–.]/g, '').replace(/\d+/g, '').length == 0) {
                _type = 'number'
            } else if (new Date(data) != 'Invalid Date' && !isNaN(new Date(data)) && !isNaN(Date.parse(data))) {
                _type = 'date';
            } else if (this.has_html(data)) {
                _type = 'html';
            } else {
                _type = 'string';
            }
        }
        this.trigger('data_type', {
            action: {
                name: 'data_type',
                value: {
                    type: _type
                }
            }
        });
        return _type;
    }
    tb.prototype.sort = function(column, direction, type, _self) {
    	if (typeof(_self) == 'undefined') {
    		_self = this;
    	}
        var _column = ((typeof(column) != 'undefined' && !isNaN(column) && column <= this._columns) ? column : 0),
            _direction = ((typeof(direction) != 'undefined') ? direction : this._settings.sort_order),
            _type = (typeof(type) != 'undefined' && type != '' && (jQuery.inArray(type.toLowerCase(), ['string', 'number', 'date', 'time', 'html']) > -1)) ? type : ((this._data[0].data[_column] !== '' && this._data[0].data[_column] !== this._settings.blank_data) ? this.check_data_type(this._data[0].data[_column], _column) : this.check_data_type(this.find_data(this._data, _column), _column))
        this._settings.sort_column = _column;
        this._settings.sort_order = _direction;
        if (this._element.find('.tableBuilderHeaderPos_' + _column)[0] && !this._element.find('.tableBuilderHeaderPos_' + _column).find('.tableBuilderHeaderTextValue').hasClass('tableBuilderHeaderSortable' + _direction.charAt(0).toUpperCase() + _direction.slice(1))) {
            this.toggle_header_arrows(_column, ((this._element.find('.tableBuilderHeaderSortableActive')[0]) ? this._element.find('.tableBuilderHeaderSortableActive').parent().attr('id').split('table_builder_header_')[1] : -1));
        }
        this.clear_table_rows(false);
        if (_column == null) {
            return this.add_table_rows(this._data, this._settings.pagination, this._settings.visible_rows);
        }
        if (_type == 'time') {
            this._data.sort(this.sort_by_time(_self));
        } else if (_type == 'number') {
            this._data.sort(this.sort_by_number(_self));
        } else if (_type == 'date') {
            this._data.sort(this.sort_by_date(_self));
        } else if (_type == 'html') {
            this._data.sort(this.sort_by_html(_self));
        } else if (_type == 'string') {
            this._data.sort(this.sort_by_string(_self));
        }
        if (this._settings.ranking && !this._settings.ranking_set) {
            this.set_ranking(this._data);
            this._settings.ranking_set = true;
        }
        this.add_table_rows(this._data, this._settings.pagination, this._settings.visible_rows)
        this.trigger('sort_complete', {
            action: {
                name: 'sort_complete',
                value: {
                    column: column,
                    direction: direction
                }
            }
        });
    };
    tb.prototype.clear_table_rows = function(bool) {
        if (this._element.find('.tableBuilderBodyWrapper')[0]) {
            this._element.find('.tableBuilderBodyWrapper').empty();
        }
        if (bool && this._element.find('.tableBuilderMoreButtonsWrapper')[0]) {
            this._element.find('.tableBuilderMoreButtonsWrapper').remove();
        }
        this.trigger('rows_cleared');
    }
    tb.prototype.header_click = function(index) {
    	if (this._element.find('.tableBuilderHeaderTextValue').hasClass('tableBuilderHeaderSortable')) {
	        var _id = ((typeof(index) != 'undefined') ? parseFloat(index) : this._settings.sort_column)
    	    this._settings.sort_column = _id;
        	((_id == ((this._element.find('.tableBuilderHeaderSortableActive')[0]) ? this._element.find('.tableBuilderHeaderSortableActive').parent().attr('id').split('table_builder_header_')[1] : -1)) ? (this._settings.sort_order = ((this._settings.sort_order.toLowerCase() == 'desc') ? 'asc' : 'desc')) : (this._settings.sort_order = this._settings.sort_default));
	        this.toggle_header_arrows(this._settings.sort_column, ((this._element.find('.tableBuilderHeaderSortableActive')[0]) ? this._element.find('.tableBuilderHeaderSortableActive').parent().attr('id').split('table_builder_header_')[1] : -1));
    	    this.sort(this._settings.sort_column, this._settings.sort_order, '', this);
    	}
    }
    tb.prototype.visible_rows = function(rows) {
        if (typeof (rows) == 'string' && rows.toLowerCase() == 'all') {
            rows = 1000000
        };
        var _rows = ((typeof(rows) != 'undefined' && !isNaN(rows)) ? rows : this._settings.visible_rows);
        this._settings.visible_rows = _rows;
        this.clear_table_rows(true);
        if (!this._element.find('#toggle_visible_rows_list').find('li[data-value="' + _rows + '"]').hasClass('tableBuilderDropDownListItemActive')) {
            this._element.find('#toggle_visible_rows_list').find('.tableBuilderDropDownListItemActive').removeClass('tableBuilderDropDownListItemActive')
            if (_rows >= this._rows) {
                _rows = 1000000
            }
            this._element.find('#toggle_visible_rows_list').find('li[data-value="' + _rows + '"]').addClass('tableBuilderDropDownListItemActive');
        }
        this.add_table_rows(this._data, this._settings.pagination, this._settings.visible_rows);
        this.trigger('visible_rows_changed', {
            action: {
                name: 'visible_rows_changed',
                value: {
                    rows: _rows
                }
            }
        });
    }
    tb.prototype.next = function(_self) {
    	if (typeof(_self) == 'undefined') {
    		_self = this;
    	}
        if (_self._settings.pagination < Math.ceil(_self._rows / _self._settings.visible_rows)) {
            _self._element.find('.tableBuilderNumberActive').removeClass('tableBuilderNumberActive');
            _self._element.find('#table_builder_number_' + _self._settings.pagination).addClass('tableBuilderNumberActive');
            _self.clear_table_rows(false);
            _self._element.find('#table_builder_prev_btn').removeClass('tableBuilderNotActiveBTN');
            if (parseFloat(_self._settings.pagination) == Math.ceil(_self._rows / _self._settings.visible_rows) - 1) {
                _self._element.find('#table_builder_next_btn').addClass('tableBuilderNotActiveBTN');
            }
            _self._settings.pagination++;
            _self._element.find('#table_builder_number_input_field').val(_self._settings.pagination.toString() + '/' + Math.ceil(_self._rows / _self._settings.visible_rows));
            _self.add_table_rows(_self._data, _self._settings.pagination, _self._settings.visible_rows);
            _self.trigger('pagination_complete', {
                action: {
                    name: 'pagination_complete',
                    value: {
                        pagination: _self._settings.pagination
                    }
                }
            });
        }
    }
    tb.prototype.prev = function(_self) {
    	if (typeof(_self) == 'undefined') {
    		_self = this;
    	}
        if (_self._settings.pagination > 1) {
            _self._element.find('.tableBuilderNumberActive').removeClass('tableBuilderNumberActive');
            _self._settings.pagination--;
            _self._element.find('#table_builder_number_' + (_self._settings.pagination - 1)).addClass('tableBuilderNumberActive');
            _self.clear_table_rows(false);
            _self._element.find('#table_builder_next_btn').removeClass('tableBuilderNotActiveBTN');
            if (parseFloat(_self._settings.pagination) == 1) {
                _self._element.find('#table_builder_prev_btn').addClass('tableBuilderNotActiveBTN');
            }
            _self._element.find('#table_builder_number_input_field').val(_self._settings.pagination.toString() + '/' + Math.ceil(_self._rows / _self._settings.visible_rows));
            _self.add_table_rows(_self._data, _self._settings.pagination, _self._settings.visible_rows);
            _self.trigger('pagination_complete', {
                action: {
                    name: 'pagination_complete',
                    value: {
                        pagination: _self._settings.pagination
                    }
                }
            });
        }
    }
    tb.prototype.paginate = function(num, _self) {
    	if (typeof(_self) == 'undefined') {
    		_self = this;
    	}
        if (typeof(num) != 'undefined' && num != '' && !isNaN(num) && (parseFloat(num) > 0 && (parseFloat(num) <= Math.ceil(_self._rows / _self._settings.visible_rows)))) {
            _self._element.find('.tableBuilderNumberActive').removeClass('tableBuilderNumberActive');
            if (_self._element.find('#table_builder_number_' + (num - 1))[0]) {
                _self._element.find('#table_builder_number_' + (num - 1)).addClass('tableBuilderNumberActive');
            }
            _self._settings.pagination = parseFloat(num);
            (num > 1) ? _self._element.find('#table_builder_prev_btn').removeClass('tableBuilderNotActiveBTN') : _self._element.find('#table_builder_prev_btn').addClass('tableBuilderNotActiveBTN');
            (num == Math.ceil(_self._rows / _self._settings.visible_rows)) ? _self._element.find('#table_builder_next_btn').addClass('tableBuilderNotActiveBTN') : _self._element.find('#table_builder_next_btn').removeClass('tableBuilderNotActiveBTN');
            _self._element.find('#table_builder_number_input_field').val(_self._settings.pagination + '/' + (Math.ceil(_self._rows / _self._settings.visible_rows)));
            _self.clear_table_rows(false);
            _self.add_table_rows(_self._data, _self._settings.pagination, _self._settings.visible_rows);
        }
    }
    tb.prototype.search = function(term) {
        if (typeof(term) != 'undefined') {
            var _temp = [];
            for (var i = 0; i < this._data.length; i++) {
                row_test: for (var g = 0; g < this._data[i].data.length; g++) {
                	if (this._data[i].data[g].toString().toLowerCase().indexOf(term.toLowerCase()) != -1) {
                        _temp.push(this._data[i]);
                        break row_test;
                    }
                }
            }
            this._data = _temp;
            this._rows = _temp.length;
            this.clear_table_rows(true);
            (this._data.length > 0) ? this.add_table_rows(this._data, this._settings.pagination, this._settings.visible_rows): this.no_rows_found();
            this.trigger('search', {
                action: {
                    name: 'search',
                    value: {
                        term: term
                    }
                }
            });
        }
    }
    tb.prototype.clear_search = function() {
        this.clear_table_rows(true);
        this._data = [];
        for (var i = 0; i < this._original_data.length; i++) {
            this._data.push(this._original_data[i]);
        }
        this._rows = this._data.length;
        this.add_table_rows(this._data, this._settings.pagination, this._settings.visible_rows);
        this.trigger('clear_search');

    }
    tb.prototype.refresh_data = function(min) {
        if (this._settings.external_data || typeof(this._settings.src) == 'string') {
            if ((typeof(min) == 'undefined') || ((typeof(min) != 'undefined') ? parseFloat(min) : this._settings.refresh_data) <= 0) {
                clearTimeout(this._refresh_data);
            } 
            this._settings.refresh_data = ((typeof(min) != 'undefined') ? parseFloat(min) : this._settings.refresh_data);
            this._element.find('.tableBuilderPreloaderWrapper').show();
            this._element.find('.tableBuilderTableHeaderWrapper').remove();
            this._element.find('.tableBuilderTableBodyWrapper').remove();
            this._element.find('.tableBuilderMoreButtonsWrapper').remove();
            this.get_google_data(this._settings.src);
        } else {
        	this._element.find('.tableBuilderPreloaderWrapper').show();
            this._element.find('.tableBuilderTableHeaderWrapper').remove();
            this._element.find('.tableBuilderTableBodyWrapper').remove();
            this._element.find('.tableBuilderMoreButtonsWrapper').remove();
            this.parse_data(this._settings.src);
        }
        this.trigger('data_refresh', {
            action: {
                name: 'data_refresh',
                value: {
                	min: ((typeof(min) != 'undefined') ? parseFloat(min) : this._settings.refresh_data)
                }
            }
        });
    }
    tb.prototype.destroy = function() {
    	this.trigger('destroy_table');
        this._element.find('.tableBuilderWrapper').remove();
        //jQuery.removeData(this._element, "dataviz.table_builder");
        jQuery(this._element).removeData("dataviz.table_builder")
        jQuery(document).off('resize.tb_resize');
        jQuery(document).off('resize.tb_scroll');
        if (this._element.find('.tableBuilderLegacy')[0]) {
            this._element.find('.tableBuilderLegacy').removeClass('tableBuilderLegacy');
            this._element.find('.tableBuilderNewParent').removeClass('tableBuilderNewParent');
        }
    }
    tb.prototype.update = function(updated_options) {
        for (var i in updated_options) {
            if (i in this._settings) {
                this._settings[i] = updated_options[i]
            }
        }
        this.trigger('updated_settings', {
            action: {
                name: 'settings',
                value: {
                	updated: updated_options,
                	all: this._settings
                }
            }
        });
    };
    tb.prototype.trigger = function(name, data, namespace, state, enter) {
        var handler = jQuery.camelCase(
                jQuery.grep(['on', name, namespace], function(v) {
                    return v
                })
                .join('-').toLowerCase()
            ),
            event = jQuery.Event(
                [name, 'dataviz', namespace || 'table_builder'].join('.').toLowerCase(),
                jQuery.extend({
                    relatedTarget: this
                }, status, data)
            );
        this.register({
            name: name
        });
        this._element.trigger(event);
        if (this.settings && typeof this.settings[handler] === 'function') {
            this.settings[handler].call(this, event);
        }
        return event;
    };
    tb.prototype.register = function(object) {
        if (!jQuery.event.special[object.name]) {
            jQuery.event.special[object.name] = {};
        }
        if (!jQuery.event.special[object.name].tb) {
            var _default = jQuery.event.special[object.name]._default;
            jQuery.event.special[object.name]._default = function(e) {
                if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('dataviz') === -1)) {
                    return _default.apply(this, arguments);
                }
                return e.namespace && e.namespace.indexOf('dataviz') > -1;
            };
            jQuery.event.special[object.name].tb = true;
        }
    };

    jQuery.fn.table_builder = function(_option) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var _this = jQuery(this), _data = _this.data('dataviz.table_builder');
            if (!_data) {
                _data = new tb(this, typeof _option == 'object' && _option);
                _this.data('dataviz.table_builder', _data);
            }
            if (typeof _option == 'string') {
                if (jQuery.inArray(_option, ['next', 'prev', 'paginate', 'search', 'clear_search', 'table_title', 'table_copyblock', 'credit_text', 'source_text', 'add_table_rows', 'add_row_data', 'clear_table_rows', 'refresh_data', 'sort', 'visible_rows', 'build_search', 'build_row_options', 'build_row_options_dropdown', 'create_header_buttons_small_select', 'header_click', 'build_small_sorter', 'check_data_type', 'update', 'destroy']) != -1) {
                    try {
                        _data[_option].apply(_data, args);
                    } catch (err) {
                        _data.trigger('error', {
                            action: {
                                name: 'update',
                                error: {
                                    message: err
                                }
                            }
                        });
                    }
                }
            }
        });
    };

    jQuery.fn.table_builder.Constructor = tb;

})(window.jQuery, window, document);