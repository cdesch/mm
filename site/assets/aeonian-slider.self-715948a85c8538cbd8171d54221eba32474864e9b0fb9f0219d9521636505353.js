jQuery.fn.Aeonian = function (options) {

    var defaults = {
        'nextprev': true,
        'nextclass': 'next',
        'prevclass': 'prev',
        'pagi': true,
        'pagiclass': 'pagi',
        'search': [false, '2'],
        'data': [{
                tags: [{
                        name: 'h1',
                        content: "Can't found jSon Object"
                    }]
            }],
        'auto': [false, '10000'],
        'circular': true,
        'touch': true,
        'fullscreen': false,
        'carousel': [false, '3', '2', '1'],
        'sorting': false,
        'timeline': false,
        'timelineeffect':false
    };

    var settings = $.extend({}, defaults, options);
    var obj_data = settings['data'];

    return this.each(function () {
        if (settings['timeline']) {
            function sortNumber(a, b) {
                return a - b;
            }
            var month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var dates = [];
            for (slide in obj_data) {
                var d = new Date(obj_data[slide]['time']);
                var t = d.getTime();
                dates.push(t);
            }
            dates.sort(sortNumber);
            var tl_data = {}
            for (c_date in dates) {
                var d = new Date(dates[c_date]);
                var y = d.getFullYear();
                var m = d.getMonth();
                m = m + 1;
                var dt = d.getDate();
                if (typeof tl_data[y] != 'object') {
                    tl_data[y] = {};
                }
                if (typeof tl_data[y][m] != 'object') {
                    tl_data[y][m] = {};
                }
                if (typeof tl_data[y][m][dt] != 'object') {
                    tl_data[y][m][dt] = [];
                }
            }
            for (slide in obj_data) {
                var d = new Date(obj_data[slide]['time']);
                var y = d.getFullYear();
                var m = d.getMonth();
                m = m + 1;
                var dt = d.getDate();
                tl_data[y][m][dt].push(obj_data[slide]['tags']);
            }
            var tl_html_arr = [];
            for (get_year in tl_data) {
                var html_str = '';
                html_str += '<div class="year y'+get_year+'">';
                html_str += '<span class="ylabel">' + get_year + '</span>';
                for (get_month in tl_data[get_year]) {
                    for (get_day in tl_data[get_year][get_month]) {
                        for (get_data in tl_data[get_year][get_month][get_day]) {
                            html_str += '<div class="day d' + get_day +'">';
                            html_str += '<span class="line"></span><div class="tag">';
                            html_str += '<span class="dlabel">' + get_day + ' ' + month_name[get_month - 1]  + '</span>';
                            for (gettag in tl_data[get_year][get_month][get_day][get_data]) {
                                html_str += '<' + tl_data[get_year][get_month][get_day][get_data][gettag]['name'];
                                if (tl_data[get_year][get_month][get_day][get_data][gettag]['attr'] != undefined) {
                                    for (atr in tl_data[get_year][get_month][get_day][get_data][gettag]['attr']) {
                                        html_str += ' ' + atr;
                                        html_str += '="';
                                        html_str += tl_data[get_year][get_month][get_day][get_data][gettag]['attr'][atr];
                                        html_str += '"';
                                    }
                                }
                                if (tl_data[get_year][get_month][get_day][get_data][gettag]['name'] != 'img') {
                                    html_str += '>';
                                }
                                if (tl_data[get_year][get_month][get_day][get_data][gettag]['content']) {
                                    html_str += tl_data[get_year][get_month][get_day][get_data][gettag]['content'];
                                }
                                if (tl_data[get_year][get_month][get_day][get_data][gettag]['name'] == 'img') {
                                    html_str += ' />';
                                } else {
                                    html_str += '</' + tl_data[get_year][get_month][get_day][get_data][gettag]['name'] + '>';
                                }
                            }
                            html_str += '</div>';
                            html_str += '</div>';
                        }
                    }
                }
                html_str += '</div>';
                tl_html_arr[get_year] = html_str;
            }
            var tl_html = '';
            tl_html_arr.reverse();
            for(i in tl_html_arr) {
                tl_html += tl_html_arr[i];
            }
            _this = $(this);
            _this.append('<div class="midline"></div>'+tl_html);
            _this.find('.year').each(function() {
                if($(this).find('.day').length == 1) {
                    $(this).closest('.year').addClass('single');
                }
            });
            _this.find('.day').each(function() {
                if (settings['timelineeffect']) {
                    $(this).addClass('animated ' + settings['timelineeffect'] + '').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        $(this).removeClass('animate animated ' + settings['timelineeffect'] + '');
                    });
                }
            });  
        } else {
            if (settings['carousel'][0]) {
                var carousel_count = settings['carousel'][1];
                if ($(window).width() < 768) {
                    carousel_count = settings['carousel'][3];
                } else if ($(window).width() >= 768 && $(window).width() < 1024) {
                    carousel_count = settings['carousel'][2];
                }
                var c_obj_data = [];
                var c_obj = -1;
                for (c_i in obj_data) {
                    if (c_i % carousel_count == 0) {
                        c_obj++;
                        for (c_j in obj_data[c_i]) {
                            c_obj_data[c_obj] = [obj_data[c_i][c_j]];
                        }
                    } else {
                        for (c_j in obj_data[c_i]) {
                            c_obj_data[c_obj].push(obj_data[c_i][c_j]);
                        }
                    }
                }
                obj_data = c_obj_data;
            }

            var _this = $(this);

            if (settings['sorting'] != false) {
                var sorting_arr = [];
                if (settings['ori_data']) {
                    shorting_obj = settings['ori_data'];
                } else {
                    shorting_obj = settings['data'];
                }
                for (slide in shorting_obj) {
                    for (tag in shorting_obj[slide]['tags']) {
                        for (tag in shorting_obj[slide]['tags']) {
                            if (shorting_obj[slide]['tags'][tag]['name'] == settings['sorting']) {
                                if (sorting_arr.indexOf(shorting_obj[slide]['tags'][tag]['content']) < 0) {
                                    sorting_arr.push(shorting_obj[slide]['tags'][tag]['content'])
                                }
                            }
                        }
                    }
                }
                var sorting_html = '<select class="sorting"><option value="all">All</option>';
                for (sorting_val in sorting_arr) {
                    sorting_html += '<option value="';
                    sorting_html += sorting_arr[sorting_val];
                    sorting_html += '">';
                    sorting_html += sorting_arr[sorting_val];
                    sorting_html += '</option>';
                }
                sorting_html += '</select>';
                if (settings['sorting_html']) {
                    _this.append(settings['sorting_html']);
                } else {
                    _this.append(sorting_html);
                }
            }

            _this.find('.sorting').on("change", function() {
                if (settings['ori_data']) {
                    obj_data = settings['ori_data'];
                } else {
                    obj_data = settings['data'];
                }
                var sort_obj_data = [];
                if($(this).val() == 'all') {
                    if (settings['ori_data']) {
                        sort_obj_data = settings['ori_data'];
                    } else {
                        sort_obj_data = settings['data'];
                    }
                } else {
                    for (slide in obj_data) {
                        for (tag in obj_data[slide]['tags']) {
                            if (obj_data[slide]['tags'][tag]['name'] == settings['sorting']) {
                                if (obj_data[slide]['tags'][tag]['content'] == $(this).val()) {
                                    sort_obj_data.push(obj_data[slide]);
                                } else {
                                }
                            }
                        }
                    }
                }
                
                _this.html('');
                options['sorting_html'] = sorting_html;
                options['data'] = sort_obj_data;
                if (settings['ori_data']) {
                    options['ori_data'] = settings['ori_data'];
                } else {
                    options['ori_data'] = settings['data'];
                }
                options['current_slide'] = $(this).val();
                _this.Aeonian(options);
            });

            $(window).resize(function() {
                if (settings['ori_data']) {
                    options['ori_data'] = settings['ori_data'];
                } else {
                    options['ori_data'] = settings['data'];
                }
                options['data'] = settings['data'];
                _this.html('');
                _this.Aeonian(options);
            });

            if(settings["current_slide"]) {
                _this.find('.sorting').val(settings['current_slide']);
            }
            
            var selector = '';
            if (this['id']) {
                selector = '#' + this['id'];
            } else if (this['className']) {
                selector = '.' + this['className'];
                if (selector.indexOf(' ') > -1) {
                    selector = selector.split(" ");
                    selector = selector[0];
                }
            }

            _this.append('<div class="slide index0"></div>');

            if (settings['fullscreen']) {
                var fullscreen = jQuery(window).height();
                fullscreen = parseInt(fullscreen, 10);
                _this.find('.slide').height(fullscreen);
            }

            if (obj_data.length > 0) {
                var pagi_html = '<div class="' + settings['pagiclass'] + '">';
                var active_slide = 0;
                for (slide in obj_data) {
                    if (obj_data[slide]['active'] == true) {
                        active_slide = parseInt(slide, 10);
                    }
                    pagi_html += '<a href="' + slide + '">';
                    if (obj_data[slide]['thumbhtml']) {
                        pagi_html += obj_data[slide]['thumbhtml'];
                    } else {
                        pagi_html += parseInt(slide, 10) + 1;
                    }
                    pagi_html += '</a>';
                }
                pagi_html += '</div>';
                _this.append(pagi_html);
                _this.find('.' + settings['pagiclass'] + ' a').eq(active_slide).addClass('active');
                if (settings['pagi'] == false || obj_data.length < 2) {
                    _this.find('.' + settings['pagiclass'] + '').css('opacity', 0);
                }
                if (obj_data.length > 1) {
                    var process_html = '<a href="#" class="playpause';
                    if (settings['auto'][0] == true) {
                        process_html += '';
                    } else {
                        process_html += ' pause';
                    }
                    process_html += '"></a><div class="process"></div>';
                    _this.append(process_html);
                }
            }

            if (obj_data.length > 1 && settings['nextprev']) {
                _this.append('<div class="control"><a href="javascript:;" class="' + settings['prevclass'] + '"></a><a href="javascript:;" class="' + settings['nextclass'] + '"></a></div>');
            }

            if (obj_data.length > 1 && settings['search'][0] && settings['carousel'][0] == false) {
                _this.append('<div class="search"><input placeholder="" type="text" class="searchfield" /></div>');
                _this.find('.searchfield').on('keyup', function () {
                    _this.find('.' + settings['pagiclass'] + '').find('.find').removeClass('find');
                    if ($(this).val().length >= settings['search'][1]) {
                        var search_result_arr = [];
                        for (slide in obj_data) {
                            for (tag in obj_data[slide]['tags']) {
                                for (i in obj_data[slide]['tags']) {
                                    if (typeof obj_data[slide]['tags'][i] == 'object') {
                                        for (j in obj_data[slide]['tags'][i]) {
                                            if (typeof obj_data[slide]['tags'][i][j] != 'object') {
                                                if (typeof (obj_data[slide]['tags'][i][j]) != 'boolean') {
                                                    if (obj_data[slide]['tags'][i][j].indexOf($(this).val()) > -1) {
                                                        if (search_result_arr.indexOf(slide) == -1) {
                                                            if (obj_data[slide]['tags'][i]['name'] != 'iframe') {
                                                                search_result_arr.push(slide);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (obj_data[slide]['tags'][i].indexOf($(this).val()) > -1) {
                                            if (search_result_arr.indexOf(slide) == -1) {
                                                search_result_arr.push(slide);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (_this.find('.searchresult').length == 0) {
                        _this.find('.search').append('<div class="searchresult"></div>');
                    }
                    var searchresult = '';
                    for (i in search_result_arr) {
                        searchresult += '<a href="' + search_result_arr[i] + '">' + (parseInt(search_result_arr[i], 10) + 1) + '</a>';
                    }
                    _this.find('.search').find('.searchresult').html(searchresult);
                    _this.find('.searchresult').children('a').on("click", function (e) {
                        _this.find('.' + settings['pagiclass'] + '').children('a[href=' + $(this).attr("href") + ']').trigger('click');
                        e.preventDefault();
                    });
                    if (settings['pagi'] == false) {

                    } else {
                        for (i in search_result_arr) {
                            if (_this.find('.' + settings['pagiclass'] + ' a').eq(search_result_arr[i]).hasClass('find') == false) {
                                _this.find('.' + settings['pagiclass'] + ' a').eq(search_result_arr[i]).addClass('find');
                            }
                        }
                    }
                });
            }
            _this.find('.control').children('a').on("click", function (e) {
                if ($(this).attr('class') == settings['nextclass']) {
                    if (settings['circular']) {
                        if (_this.find('.' + settings['pagiclass'] + '').find('.active').next().length > 0) {
                            _this.find('.' + settings['pagiclass'] + '').find('.active').next().trigger('click');
                        } else {
                            _this.find('.' + settings['pagiclass'] + ' a:first-child').trigger('click');
                        }
                    } else {
                        _this.find('.' + settings['pagiclass'] + '').find('.active').next().trigger('click');
                    }
                } else {
                    if (settings['circular']) {
                        if (_this.find('.' + settings['pagiclass'] + '').find('.active').prev().length > 0) {
                            _this.find('.' + settings['pagiclass'] + '').find('.active').prev().trigger('click');
                        } else {
                            _this.find('.' + settings['pagiclass'] + ' a:last-child').trigger('click');
                        }
                    } else {
                        _this.find('.' + settings['pagiclass'] + '').find('.active').prev().trigger('click');
                    }
                } 
                e.preventDefault();
            });

            if (settings['touch']) {
                _this.find('.slide').on('swiperight', function (e) {
                    if (settings['circular']) {
                        if (_this.find('.' + settings['pagiclass'] + '').find('.active').prev().length > 0) {
                            _this.find('.' + settings['pagiclass'] + '').find('.active').prev().trigger('click');
                        } else {
                            _this.find('.' + settings['pagiclass'] + ' a:last-child').trigger('click');
                        }
                    } else {
                        _this.find('.' + settings['pagiclass'] + '').find('.active').prev().trigger('click');
                    }
                });
                _this.find('.slide').on('swipeleft', function (e) {
                    if (settings['circular']) {
                        if (_this.find('.' + settings['pagiclass'] + '').find('.active').next().length > 0) {
                            _this.find('.' + settings['pagiclass'] + '').find('.active').next().trigger('click');
                        } else {
                            _this.find('.' + settings['pagiclass'] + ' a:first-child').trigger('click');
                        }
                    } else {
                        _this.find('.' + settings['pagiclass'] + '').find('.active').next().trigger('click');
                    }
                });
            }

            if (settings['auto'][0]) {
                var auto_slide = setInterval(function () {
                    auto_slide_fun(_this);
                }, parseInt(settings['auto'][1], 10));
            }

            _this.find('.playpause').on("click", function (e) {
                if (e['isTrigger'] == undefined) {
                    if (settings['auto'][0] == true) {
                        settings['auto'][0] = false;
                    } else {
                        settings['auto'][0] = true;
                    }
                }
                if ($(this).hasClass('pause')) {
                    var processwid = _this.find('.process').attr('style').split(':');
                    processwid = parseInt(processwid[1], 10);
                    var speed = (parseInt(settings['auto'][1], 10) * (100 - processwid)) / 100;
                    auto_slide = setInterval(function () {
                        auto_slide_fun(_this);
                    }, speed);
                    _this.find('.process').animate({
                        width: '100%'
                    }, speed, function () {
                        $(this).css('width', '0');
                    });
                    $(this).removeClass('pause');
                } else {
                    if (typeof (auto_slide) != undefined) {
                        clearInterval(auto_slide);
                    }
                    _this.find('.process').stop();
                    $(this).addClass('pause');
                }
                e.preventDefault();
            });

            $(document).on('click', '' + selector + ' .cover', function (e) {
                if (e['target']['className'] == 'close') {
                    _this.find('.playpause').show();
                    $(this).removeClass('hide');
                    $('' + selector + ' iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
                    if (settings['auto'][0] == true) {
                        _this.find('.playpause.pause').trigger('click');
                    }
                } else {
                    _this.find('.playpause').hide();
                    $(this).addClass('hide');
                    $('' + selector + ' iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                    if (settings['auto'][0] == true) {
                        _this.find('.playpause').trigger('click');
                    }
                }

                e.preventDefault();
            });

            if (active_slide == 0 && settings['circular'] == false) {
                _this.find('.control').find(settings['prevclass']).hide();
            }
            if (active_slide == (obj_data.length - 1) && settings['circular'] == false) {
                _this.find('.control').find(settings['nextclass']).hide();
            }

            _this.find('.' + settings['pagiclass'] + '').children('a').on("click", function (e) {
                if (settings['auto'][0]) {
                    if (typeof (auto_slide) != undefined) {
                        clearInterval(auto_slide);
                    }
                    auto_slide = setInterval(function () {
                        auto_slide_fun(_this);
                    }, parseInt(settings['auto'][1], 10));
                    _this.find('.process').stop();
                    _this.find('.process').css('width', '0px').animate({
                        width: '100%'
                    }, parseInt(settings['auto'][1], 10), function () {
                        $(this).css('width', '0px');
                    });
                } else {
                    _this.find('.process').css('width', '0px');
                }
                var is_current = parseInt(_this.find('.slide').attr('class').split(' ').pop().slice(-1), 10);
                var obj_target = parseInt($(this).attr('href'), 10);
                if (settings['circular'] == false) {
                    if (obj_target == 0) {
                        _this.find('.control').find(settings['prevclass']).hide();
                        _this.find('.control').find(settings['nextclass']).show();
                    } else if (obj_target == (obj_data.length - 1)) {
                        _this.find('.control').find(settings['nextclass']).hide();
                        _this.find('.control').find(settings['prevclass']).show();
                    } else {
                        _this.find('.control').find(settings['nextclass']).show();
                        _this.find('.control').find(settings['prevclass']).show();
                    }
                }
                if (is_current != (obj_target + 1)) {
                    $(selector).addClass('loading');
                    $(selector + ' > div.slide > *').remove();
                    _this.find('.' + settings['pagiclass'] + '').find('.active').removeClass('active');
                    $(this).addClass('active');
                    var objtags = obj_data[obj_target]['tags'];
                    var ani_classes = '';
                    if (settings['carousel'][0]) {
                        var tag_html = '';
                        var carouselobj = obj_data[obj_target];
                        for (c_obji in carouselobj) {
                            tag_html += '<div class="carousel">';
                             for (t in carouselobj[c_obji]) {
                                 tag_html += '<' + carouselobj[c_obji][t]['name'];
                                if (carouselobj[c_obji][t]['attr'] != undefined) { 
                                    for (atr in carouselobj[c_obji][t]['attr']) {
                                        tag_html += ' ' + atr;
                                        tag_html += '="';
                                        tag_html += carouselobj[c_obji][t]['attr'][atr];
                                        tag_html += '"';
                                    }
                                }
                                if (carouselobj[c_obji][t]['name'] != 'img') {
                                    tag_html += '>';
                                }
                                if (carouselobj[c_obji][t]['content']) {
                                    tag_html += carouselobj[c_obji][t]['content'];
                                }
                                if (carouselobj[c_obji][t]['name'] == 'img') {
                                    tag_html += ' />';
                                } else {
                                    tag_html += '</' + carouselobj[c_obji][t]['name'] + '>';
                                }
                             }
                            tag_html += '</div>';
                        }
                        $(selector + ' > div.slide').append(tag_html);
                    } else {
                        for (tag in objtags) {
                            var tag_html = '';
                            if (objtags[tag]['name'] == 'iframe') {
                                if (obj_data[obj_target]['videoinbg']) {

                                } else {
                                    tag_html += '<div class="cover"><span class="play"></span><span class="close"></span></div>';
                                }
                                tag_html += '<' + objtags[tag]['name'] + ' width="';
                                if (objtags[tag]['width']) {
                                    tag_html += objtags[tag]['width'];
                                } else {
                                    tag_html += $(selector).width();
                                }
                                tag_html += '" height="';
                                if (objtags[tag]['height']) {
                                    tag_html += objtags[tag]['height'];
                                } else {
                                    tag_html += $(selector).height();
                                }
                                tag_html += '" src="' + objtags[tag]['src'] + '" frameborder="0" allowfullscreen ';
                                if (obj_data[obj_target]['videoinbg']) {
                                    tag_html += ' class="videoinbg" ';
                                }
                                tag_html += '></'+objtags[tag]['name']+'>';
                            } else if (objtags[tag]['name'] == 'video') {
                                tag_html += '<' + objtags[tag]['name'] + ' width="';
                                if (objtags[tag]['width']) {
                                    tag_html += objtags[tag]['width'];
                                } else {
                                    tag_html += $(selector).width();
                                }
                                tag_html += '" height="';
                                if (objtags[tag]['height']) {
                                    tag_html += objtags[tag]['height'];
                                } else {
                                    tag_html += $(selector).height();
                                }
                                if (objtags[tag]['attr'] != undefined) {
                                    for (atr in objtags[tag]['attr']) {
                                        tag_html += ' ' + atr;
                                        tag_html += '="';
                                        tag_html += objtags[tag]['attr'][atr];
                                        tag_html += '"';
                                    }
                                }
                                tag_html += '" controls >';
                                if (objtags[tag]['source'] != undefined) {
                                    for (source in objtags[tag]['source']) {
                                        tag_html += '<source src="' + objtags[tag]['source'][source] + '" type="video/' + source + '">';
                                    }
                                }
                                tag_html += 'Your browser does not support the video tag.';
                                tag_html += '</' + objtags[tag]['name'] + '>';
                            } else {
                                tag_html += '<' + objtags[tag]['name'];
                                if (objtags[tag]['attr'] != undefined) {
                                    for (atr in objtags[tag]['attr']) {
                                        tag_html += ' ' + atr;
                                        tag_html += '="';
                                        tag_html += objtags[tag]['attr'][atr];
                                        tag_html += '"';
                                    }
                                }
                                if (objtags[tag]['name'] != 'img') {
                                    tag_html += '>';
                                }
                                if (objtags[tag]['content']) {
                                    tag_html += objtags[tag]['content'];
                                }
                                if (objtags[tag]['name'] == 'img') {
                                    tag_html += ' />';
                                } else {
                                    tag_html += '</' + objtags[tag]['name'] + '>';
                                }
                            }
                            $(selector + ' > div.slide').append(tag_html);
                            ani_classes += ' ' + objtags[tag]['cssanimate'];
                        }
                    }
                    var img_length = $(selector + ' > div.slide img').length;
                    var incri = 0;
                    if(img_length == 0) {
                        $(selector).removeClass('loading');
                        if (settings['carousel'][0]) {
                            for (c_obji in carouselobj) {
                                for (t in carouselobj[c_obji]) {
                                    ani_classes = carouselobj[c_obji][t]['cssanimate'];
                                    if (carouselobj[c_obji][t]['cssanimate']) {
                                        $(selector + ' > div.slide > div.carousel').eq(c_obji).find('*').eq(t).addClass('animated ' + carouselobj[c_obji][t]['cssanimate'] + '').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                                            $(this).removeClass('animate animated ' + ani_classes + '');
                                        });
                                    }
                                }
                            }
                        } else {
                            for (tag in objtags) {
                                if (objtags[tag]['cssanimate']) {
                                    $(selector + ' > div.slide > *').eq(tag).addClass('animated ' + objtags[tag]['cssanimate'] + '').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                                        $(this).removeClass('animate animated ' + ani_classes + '');
                                    });
                                }
                            }
                        }
                    } else {
                        $(selector + ' > div.slide img').load(function() {
                            if(this.complete) {
                                incri++;
                                if(incri == img_length) {
                                    $(selector).removeClass('loading');
                                    if (settings['carousel'][0]) {
                                        for (c_obji in carouselobj) {
                                            for (t in carouselobj[c_obji]) {
                                                ani_classes = carouselobj[c_obji][t]['cssanimate'];
                                                if (carouselobj[c_obji][t]['cssanimate']) {
                                                    $(selector + ' > div.slide > div.carousel').eq(c_obji).find('*').eq(t).addClass('animated ' + carouselobj[c_obji][t]['cssanimate'] + '').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                                                        $(this).removeClass('animate animated ' + ani_classes + '');
                                                    });
                                                }
                                            }
                                        }
                                    } else {
                                        for (tag in objtags) {
                                            if (objtags[tag]['cssanimate']) {
                                                $(selector + ' > div.slide > *').eq(tag).addClass('animated ' + objtags[tag]['cssanimate'] + '').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                                                    $(this).removeClass('animate animated ' + ani_classes + '');
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                    var prevclass = $(selector + ' > div.slide').attr('class').split(' ').pop();
                    $(selector + ' > div.slide').removeClass(prevclass).addClass('index' + (obj_target + 1));

                    if (settings['fullscreen'] == false) {
                        $(selector + ' > div.slide').stop();
                        $(selector + ' > div.slide').removeAttr('style');
                        if (obj_data[obj_target]['backgroundamination'] != undefined) {
                            var ani_val = obj_data[obj_target]['backgroundamination'][0];
                            var ani_len = parseInt(obj_data[obj_target]['backgroundamination'][1], 10);
                            $(selector + ' > div.slide').animate({
                                backgroundSize: ani_val
                            }, ani_len);
                        }
                    }
                }
                
                if (settings['carousel'][0] == false) {
                    $(selector + ' > div.slide > *').not('iframe').each(function () {
                        var _current = $(this);
                        var target = $(selector + ' .' + settings['pagiclass'] + ' a.active').index();
                        var index = _current.index();
                        if (settings['data'][target]['tags'][index]['aftercssanimate']) {
                            if (settings['data'][target]['tags'][index]['aftercssanimate']['type']) {
                                var afterslide = setInterval(function () {
                                    $(_current).addClass('animated ' + settings['data'][target]['tags'][index]['aftercssanimate']['type'] + '').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
                                    clearInterval(afterslide);
                                }, settings['data'][target]['tags'][index]['aftercssanimate']['time']);
                            }
                        }
                        if (settings['data'][target]['tags'][index]['jqueryanimate']) {
                            var cssProperty = settings['data'][target]['tags'][index]['jqueryanimate'][0];
                            var newStyle = {};
                            newStyle[cssProperty] = settings['data'][target]['tags'][index]['jqueryanimate'][1];
                            var jqueryanimate = setInterval(function () {
                                $(_current).animate(newStyle, settings['data'][target]['tags'][index]['jqueryanimate'][2]);
                            }, settings['data'][target]['tags'][index]['jqueryanimate'][3]);
                        }
                    });
                }
                e.preventDefault();
            });

            var get_active_slide = active_slide;
            if (window.location.search) {
                var get_param = window.location.search.replace("?", "");
                if (get_param.indexOf('&') > -1) {
                    get_param = get_param.split("&");
                    for (i in get_param) {
                        if (get_param[i].indexOf('aeonian') > -1) {
                            var get_no_param = get_param[i].split("=");
                            get_no_param.reverse();
                            get_no_param = get_no_param[0];
                        }
                    }
                } else {
                    var get_no_param = get_param.split("=");
                    get_no_param.reverse();
                    get_no_param = get_no_param[0];
                }
                get_no_param = get_no_param - 1;
                if (get_no_param < obj_data.length) {
                    get_active_slide = get_no_param;
                }
            }
            _this.find('.' + settings['pagiclass'] + ' a[href=' + get_active_slide + ']').trigger('click');
        }
    });

    function auto_slide_fun(ele) {
        if (ele.find('.' + settings['pagiclass'] + '').find('.active').next().length > 0) {
            ele.find('.' + settings['pagiclass'] + '').find('.active').next().trigger('click');
        } else {
            ele.find('.' + settings['pagiclass'] + ' a:first-child').trigger('click');
        }
    }

};

/*-----Swipe Left & Right Event-----*/
(function (a, b, c) {
    typeof define == "function" && define.amd ? define(["jquery"], function (d) {
        return c(d, a, b), d.mobile
    }) : c(a.jQuery, a, b)
})(this, document, function (a, b, c, d) {
    (function (a, b) {
        var d = {touch: "ontouchend"in c};
        a.mobile = a.mobile || {}, a.mobile.support = a.mobile.support || {}, a.extend(a.support, d), a.extend(a.mobile.support, d)
    })(a), function (a, b, c, d) {
        function x(a) {
            while (a && typeof a.originalEvent != "undefined")
                a = a.originalEvent;
            return a
        }
        function y(b, c) {
            var e = b.type, f, g, i, k, l, m, n, o, p;
            b = a.Event(b), b.type = c, f = b.originalEvent, g = a.event.props, e.search(/^(mouse|click)/) > -1 && (g = j);
            if (f)
                for (n = g.length, k; n; )
                    k = g[--n], b[k] = f[k];
            e.search(/mouse(down|up)|click/) > -1 && !b.which && (b.which = 1);
            if (e.search(/^touch/) !== -1) {
                i = x(f), e = i.touches, l = i.changedTouches, m = e && e.length ? e[0] : l && l.length ? l[0] : d;
                if (m)
                    for (o = 0, p = h.length; o < p; o++)
                        k = h[o], b[k] = m[k]
            }
            return b
        }
        function z(b) {
            var c = {}, d, f;
            while (b) {
                d = a.data(b, e);
                for (f in d)
                    d[f] && (c[f] = c.hasVirtualBinding = !0);
                b = b.parentNode
            }
            return c
        }
        function A(b, c) {
            var d;
            while (b) {
                d = a.data(b, e);
                if (d && (!c || d[c]))
                    return b;
                b = b.parentNode
            }
            return null
        }
        function B() {
            r = !1
        }
        function C() {
            r = !0
        }
        function D() {
            v = 0, p.length = 0, q = !1, C()
        }
        function E() {
            B()
        }
        function F() {
            G(), l = setTimeout(function () {
                l = 0, D()
            }, a.vmouse.resetTimerDuration)
        }
        function G() {
            l && (clearTimeout(l), l = 0)
        }
        function H(b, c, d) {
            var e;
            if (d && d[b] || !d && A(c.target, b))
                e = y(c, b), a(c.target).trigger(e);
            return e
        }
        function I(b) {
            var c = a.data(b.target, f);
            if (!q && (!v || v !== c)) {
                var d = H("v" + b.type, b);
                d && (d.isDefaultPrevented() && b.preventDefault(), d.isPropagationStopped() && b.stopPropagation(), d.isImmediatePropagationStopped() && b.stopImmediatePropagation())
            }
        }
        function J(b) {
            var c = x(b).touches, d, e;
            if (c && c.length === 1) {
                d = b.target, e = z(d);
                if (e.hasVirtualBinding) {
                    v = u++, a.data(d, f, v), G(), E(), o = !1;
                    var g = x(b).touches[0];
                    m = g.pageX, n = g.pageY, H("vmouseover", b, e), H("vmousedown", b, e)
                }
            }
        }
        function K(a) {
            if (r)
                return;
            o || H("vmousecancel", a, z(a.target)), o = !0, F()
        }
        function L(b) {
            if (r)
                return;
            var c = x(b).touches[0], d = o, e = a.vmouse.moveDistanceThreshold, f = z(b.target);
            o = o || Math.abs(c.pageX - m) > e || Math.abs(c.pageY - n) > e, o && !d && H("vmousecancel", b, f), H("vmousemove", b, f), F()
        }
        function M(a) {
            if (r)
                return;
            C();
            var b = z(a.target), c;
            H("vmouseup", a, b);
            if (!o) {
                var d = H("vclick", a, b);
                d && d.isDefaultPrevented() && (c = x(a).changedTouches[0], p.push({touchID: v, x: c.clientX, y: c.clientY}), q = !0)
            }
            H("vmouseout", a, b), o = !1, F()
        }
        function N(b) {
            var c = a.data(b, e), d;
            if (c)
                for (d in c)
                    if (c[d])
                        return!0;
            return!1
        }
        function O() {
        }
        function P(b) {
            var c = b.substr(1);
            return{setup: function (d, f) {
                    N(this) || a.data(this, e, {});
                    var g = a.data(this, e);
                    g[b] = !0, k[b] = (k[b] || 0) + 1, k[b] === 1 && t.on(c, I), a(this).on(c, O), s && (k.touchstart = (k.touchstart || 0) + 1, k.touchstart === 1 && t.on("touchstart", J).on("touchend", M).on("touchmove", L).on("scroll", K))
                }, teardown: function (d, f) {
                    --k[b], k[b] || t.off(c, I), s && (--k.touchstart, k.touchstart || t.off("touchstart", J).off("touchmove", L).off("touchend", M).off("scroll", K));
                    var g = a(this), h = a.data(this, e);
                    h && (h[b] = !1), g.off(c, O), N(this) || g.removeData(e)
                }}
        }
        var e = "virtualMouseBindings", f = "virtualTouchID", g = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "), h = "clientX clientY pageX pageY screenX screenY".split(" "), i = a.event.mouseHooks ? a.event.mouseHooks.props : [], j = a.event.props.concat(i), k = {}, l = 0, m = 0, n = 0, o = !1, p = [], q = !1, r = !1, s = "addEventListener"in c, t = a(c), u = 1, v = 0, w;
        a.vmouse = {moveDistanceThreshold: 10, clickDistanceThreshold: 10, resetTimerDuration: 1500};
        for (var Q = 0; Q < g.length; Q++)
            a.event.special[g[Q]] = P(g[Q]);
        s && c.addEventListener("click", function (b) {
            var c = p.length, d = b.target, e, g, h, i, j, k;
            if (c) {
                e = b.clientX, g = b.clientY, w = a.vmouse.clickDistanceThreshold, h = d;
                while (h) {
                    for (i = 0; i < c; i++) {
                        j = p[i], k = 0;
                        if (h === d && Math.abs(j.x - e) < w && Math.abs(j.y - g) < w || a.data(h, f) === j.touchID) {
                            b.preventDefault(), b.stopPropagation();
                            return
                        }
                    }
                    h = h.parentNode
                }
            }
        }, !0)
    }(a, b, c), function (a, b, d) {
        function j(b, c, d) {
            var e = d.type;
            d.type = c, a.event.handle.call(b, d), d.type = e
        }
        a.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function (b, c) {
            a.fn[c] = function (a) {
                return a ? this.on(c, a) : this.trigger(c)
            }, a.attrFn && (a.attrFn[c] = !0)
        });
        var e = a.mobile.support.touch, f = "touchmove scroll", g = e ? "touchstart" : "mousedown", h = e ? "touchend" : "mouseup", i = e ? "touchmove" : "mousemove";
        a.event.special.scrollstart = {enabled: !0, setup: function () {
                function g(a, c) {
                    d = c, j(b, d ? "scrollstart" : "scrollstop", a)
                }
                var b = this, c = a(b), d, e;
                c.on(f, function (b) {
                    if (!a.event.special.scrollstart.enabled)
                        return;
                    d || g(b, !0), clearTimeout(e), e = setTimeout(function () {
                        g(b, !1)
                    }, 50)
                })
            }}, a.event.special.tap = {tapholdThreshold: 750, setup: function () {
                var b = this, d = a(b);
                d.on("vmousedown", function (e) {
                    function i() {
                        clearTimeout(h)
                    }
                    function k() {
                        i(), d.off("vclick", l).off("vmouseup", i), a(c).off("vmousecancel", k)
                    }
                    function l(a) {
                        k(), f === a.target && j(b, "tap", a)
                    }
                    if (e.which && e.which !== 1)
                        return!1;
                    var f = e.target, g = e.originalEvent, h;
                    d.on("vmouseup", i).on("vclick", l), a(c).on("vmousecancel", k), h = setTimeout(function () {
                        j(b, "taphold", a.Event("taphold", {target: f}))
                    }, a.event.special.tap.tapholdThreshold)
                })
            }}, a.event.special.swipe = {scrollSupressionThreshold: 30, durationThreshold: 1e3, horizontalDistanceThreshold: 30, verticalDistanceThreshold: 75, setup: function () {
                var b = this, c = a(b);
                c.on(g, function (b) {
                    function j(b) {
                        if (!f)
                            return;
                        var c = b.originalEvent.touches ? b.originalEvent.touches[0] : b;
                        g = {time: (new Date).getTime(), coords: [c.pageX, c.pageY]}, Math.abs(f.coords[0] - g.coords[0]) > a.event.special.swipe.scrollSupressionThreshold && b.preventDefault()
                    }
                    var e = b.originalEvent.touches ? b.originalEvent.touches[0] : b, f = {time: (new Date).getTime(), coords: [e.pageX, e.pageY], origin: a(b.target)}, g;
                    c.on(i, j).one(h, function (b) {
                        c.off(i, j), f && g && g.time - f.time < a.event.special.swipe.durationThreshold && Math.abs(f.coords[0] - g.coords[0]) > a.event.special.swipe.horizontalDistanceThreshold && Math.abs(f.coords[1] - g.coords[1]) < a.event.special.swipe.verticalDistanceThreshold && f.origin.trigger("swipe").trigger(f.coords[0] > g.coords[0] ? "swipeleft" : "swiperight"), f = g = d
                    })
                })
            }}, a.each({scrollstop: "scrollstart", taphold: "tap", swipeleft: "swipe", swiperight: "swipe"}, function (b, c) {
            a.event.special[b] = {setup: function () {
                    a(this).on(c, a.noop)
                }}
        })
    }(a, this)
});
