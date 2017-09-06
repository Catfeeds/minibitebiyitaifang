(function($) {
	//=================================================================================================
	//Miloc Ui 鍔犺浇
	$.fn.muiload = function() {
		return this.each(function() {
			var $this = $(this);

			$this.find('.datepicker').attr('readonly', true).datepicker({
				dateFormat: "yy/mm/dd"
			});

			$this.find('.tabs').tabs();

			//琛ㄦ牸浜ゆ浛琛�
			$('.table').each(function() {
				$(this).find('tr:even').addClass('even');
				$(this).find('tr:odd').addClass('odd');
			});
			//琛ㄦ牸琛屾晥鏋�
			$('.table-hover').each(function() {
				$(this).find('tr').mouseenter(function() {
					$(this).addClass('hover');
				}).mouseleave(function() {
					$(this).removeClass('hover');
				});
			});

			//extend
			$this.muiextend();
		});
	}
	//Miloc Ui 鎵╁睍鍔犺浇锛屽彲鑷鎵╁睍
	$.fn.muiextend = function() {
		var $this = $(this);
		return;
	}

	//=================================================================================================
	//鍥剧墖鑷姩閫傚簲
	$.fn.imgauto = function(options) {
		var defaults = {
				width: 0,
				height: 0,
				center: false
			},
			opts = $.extend({}, defaults, options);
	
		return this.find('img').each(function() {
			var img = $(this).css({ width: 'auto', height: 'auto' }),
				path = img.attr('src'),
				container = img.parent().css({ position: 'relative', overflow: 'hidden', display: 'block' });
			
			container.css({
				width: opts.width > 0 ? opts.width : container.width(),
				height: opts.height > 0 ? opts.height : container.height()
			});
			
			$.imgready(path, function(width, height){
				$.imgresize(img, width, height, opts.center);
			});
		});
	}
	$.imgresize = function(img, width, height, center) {
		var container = img.parent(),
			w = width,
			h = height,
			pw = container.width(),
			ph = container.height();
		
		if(center){
			if (pw / ph > w / h)
			{
				h = h / w * pw;
				w = pw;
			}
			else
			{
				w = w / h * ph;
				h = ph;
			}
		} else {
			if (pw / ph > w / h)
			{
				w = w / h * ph;
				h = ph;
			}
			else
			{
				h = h / w * pw;
				w = pw;
			}
		}
	
		img.css({
			position: 'absolute',
			left: '50%',
			top: '50%',
			marginLeft: parseInt(w * -.5),
			marginTop: parseInt(h * -.5),
			width: parseInt(w),
			height: parseInt(h)
		});
	}
	$.imgready = function(url, callback, error) {
		var img = new Image();
		img.src = url;
		if (img.complete) return callback(img.width, img.height);
			
		var div = $('<div>', {
				style: 'visibility:hidden;position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden'
			}),
			container = $(document.body) || $('head:first'),
			end = function () {
				img.onload = img.onerror = null;
				div.remove();
			};
			
		div.append(img).appendTo(container);
		
		img.onload = function () {
			end();
			callback(img.width, img.height);
		};
		img.onerror = function () {
			end();
			error && error();
		};
	}

	//=================================================================================================
	//骞荤伅鐗囥€佽疆鎾�
	$.slider = function(element, options) {
		var prevButton, nextButton, playButton, stopButton, container, control, page;
		var slider = $(element);
		var slides = slider.children();
		var opts = $.extend({}, $.slider.defaults, options);

		slider.interval = null;
		slider.index = 0;

		//鍒濆鍖�
		slider.init = function() {
			//灞曠ず瀹瑰櫒
			container = $('<div>', {
				'class': 'slider-container'
			}).css({
				position: 'relative',
				overflow: 'hidden'
			}).appendTo(slider);

			//灞曠ず鎺т欢
			control = $('<div>', {
				'class': 'slider-control'
			}).css({
				position: 'relative',
				overflow: 'hidden'
			}).appendTo(container);

			if(opts.button) {
				//涓婁竴涓寜閽�
				prevButton = $('<a>', {
					'class': 'slider-nav slider-prev',
					href: '#'
				}).html('<img src="http://3248196.com/static/slide_arrow_left_black.png" alt="next" />').click(function() {
					slider.prev();
					return false;
				}).appendTo(slider);

				//涓嬩竴涓寜閽�
				nextButton = $('<a>', {
					'class': 'slider-nav slider-next',
					href: '#'
				}).html('<img src="http://3248196.com/static/slide_arrow_right_black.png" alt="next" />').click(function() {
					slider.next();
					return false;
				}).appendTo(slider);
			}

			//鍒嗛〉
			page = $('<div>', {
				'class': 'slider-page'
			}).appendTo(slider);

			//璁剧疆鐩稿
			slider.css({
				position: 'relative'
			});

			//鍒濆 灞曠ず鍏冪礌 榛樿鏁堟灉
			//slides.find('img').css({ width: '100%', height: '100%' });
			if(opts.autosize){
				slides.css({
					display: 'block',
					width: '100%'
				});
			} else {
				slides.css({
					width: opts.width>0 ? opts.width : 'auto',
					height: opts.height>0 ? opts.height : 'auto'
				});
			}
			slides.hide().css({
				position: 'absolute',
				left: 0,
				top: 0
			}).appendTo(control);
			
			//璁剧疆鍒嗛〉椤� 鍜� 鍏冪礌鐩稿浣嶇疆
			slides.each(function(i) {
				$('<a>', {
					'class': 'slider-page-item',
					'slider-item': i,
					html: i + 1
				}).click(function() {
					slider.goto(parseInt($(this).attr('slider-item')));
					return false;
				}).appendTo(page);
			});

			// orientationchange focus
			$(window).bind('resize', function() {
				return slider.resize();
			});

			slider.resize();
			//slider.play();

			//榛樿绗竴涓縺娲荤姸鎬�
			// page.children(':first').addClass('slider-page-active');
			// slides.first().show().css({
				// zIndex: 1
			// });
			slider.animate(0);
		}

		slider.resize = function() {
			//alert("sdf");
			// opts.width > 0 && opts.width < slider.width() ? opts.width :
			var w = slider.width();
			//var h = opts.width > 0 && opts.height > 0 ? parseInt(opts.height / opts.width * w) : opts.height > 0 ? opts.height : slides.first().height();
			var h = opts.height;
			
			if(opts.autosize) h = parseInt(opts.height / opts.width * w);
			
			container.css({
				width: '100%',
				height: h
			});

			control.css({
				width: '100%',
				height: h
			});
			
			slides.each(function(i) {
				if(opts.valign === 'top')
					$(this).css({ top: '0', bottom: 'auto', marginTop: 0 });
					
				if(opts.valign === 'center')
					$(this).css({ top: '50%', bottom: 'auto', marginTop: $(this).height() / -2 });
					
				if(opts.valign === 'bottom')
					$(this).css({ top: 'auto', bottom: '0', marginTop: 0 });
				
				if($(this).width() != w)
					$(this).css({ left: '50%', right: 'auto', marginLeft: $(this).width() / -2 });
			});
			
			
			
			$('.slider-nav img').css({
				marginTop: $('.slider-nav').height() * 0.6 / 2
			});
		}

		slider.prev = function() {
			slider.animate(slider.index - 1);
		}

		slider.next = function() {
			slider.animate(slider.index + 1);
		}

		slider.goto = function(index) {
			slider.animate(index);
		}

		slider.play = function() {
			if (opts.autoplay) {
				slider.interval = setTimeout(slider.animate, opts.interval);
			}
		}

		slider.stop = function() {
			clearTimeout(slider.interval);
		}

		slider.animate = function(index) {
			if (index === undefined) index = slider.index + 1;
			if (index >= slides.length) index = 0;
			if (index < 0) index = slides.length - 1;

			slider.stop();

			page.children('.slider-page-active').removeClass('slider-page-active');
			slides.eq(slider.index).stop().fadeOut(opts.speed, function() {
				$(this).css({
					zIndex: 0
				});
			});
			
			if(opts.before != null){
				opts.before(index, slides.eq(index));
			}

			page.children(':eq(' + index + ')').addClass('slider-page-active');
			slides.eq(index).stop().fadeIn(opts.speed, function() {
				$(this).css({
					zIndex: 1
				});

				slider.play();
			
				if(opts.after != null){
					opts.after(index, slides.eq(index));
				}
			});
			
			slider.index = index;
		}

		slider.init();
	}
	//骞荤伅鐗囥€佽疆鎾粯璁よ缃�
	$.slider.defaults = {
		width: 0,
		height: 0,
		interval: 7000,
		speed: 600,
		autoplay: true,
		autosize: false,
		button: true,
		effect: 'fade', // or 'slide'
		valign: 'top',
		before: null,
		after: null
	}
	$.fn.slider = function(options) {
		return this.each(function() {
			new $.slider($(this), options);
		});
	}

	//=================================================================================================
	//纭妗�
	$.muiconfirm = function(options) {
		var defaults = {
			name: 'confirm',
			closeText: '脳',
			title: '缃戦〉娑堟伅',
			msg: '',
			width: 500,
			height: 200,
			yes: null,
			no: null
		};

		var opts = $.extend({}, defaults, options);

		var $name = 'muidialog-' + opts.name;
		if ($('#' + $name).size() <= 0) $(document.body).append('<div id="' + $name + '"></div>');

		var $dialog = $('#' + $name);

		$dialog.dialog({
			modal: true,
			closeText: opts.closeText,
			title: opts.title,
			width: opts.width,
			height: opts.height,
			buttons: [{
				text: '纭',
				click: function() {
					$(this).dialog('close');
					if (opts.yes != null) opts.yes();
				}
			}, {
				text: '鍙栨秷',
				click: function() {
					$(this).dialog('close');
					if (opts.no != null) opts.no();
				}
			}]
		}).html(opts.msg);
	}

	//=================================================================================================
	//Dialog瀵硅瘽妗�
	$.muidialog = function(options) {
		var opts = $.extend({}, $.muidialog.defaults, options);

		var $name = 'muidialog-' + opts.name;

		if ($('#' + $name).size() <= 0) $(document.body).append('<div id="' + $name + '"></div>');
		opts.url += (opts.url.indexOf('?') > 0 ? '&' : '?') + '_=' + Math.random();

		var $dialog = $('#' + $name);

		//alert('1');

		$.ajax({
			type: 'GET',
			dataType: 'html',
			url: opts.url,
			success: function(data) {
				//alert('2');
				$dialog.dialog({
					modal: true,
					closeText: opts.closeText,
					title: opts.title,
					width: opts.width,
					height: opts.height,
					buttons: opts.buttons
				}).html(data).muiload();
				//alert('3');
			}
		});
	}
	//Dialog瀵硅瘽妗嗛粯璁よ缃�
	$.muidialog.defaults = {
		url: '',
		name: 'default',
		closeText: '脳',
		title: '',
		width: 600,
		height: 600,
		buttons: [{
			text: 'OK',
			click: function() {
				$(this).dialog('close');
			}
		}]
	};

})(jQuery);