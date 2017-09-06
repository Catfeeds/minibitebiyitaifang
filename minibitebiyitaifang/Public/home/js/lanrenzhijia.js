// 代码整理：懒人之家

$(document).ready(function (){
	//点击小图切换大图
	$("#thumbnail li a").click(function(){
		$(".zoompic img").hide().attr({ "src": $(this).attr("href"), "title": $("> img", this).attr("title") });
		$("#thumbnail li.current").removeClass("current");
		$(this).parents("li").addClass("current");
		return false;
	});
	$(".zoompic>img").load(function(){
		$(".zoompic>img:hidden").show();
	});
	
	//小图片左右滚动
	var $slider = $('.sliderbox .slider ul');
	var $slider_child_l = $('.sliderbox .slider ul li').length;
	var $slider_width = $('.sliderbox .slider ul li').width();
	$slider.width($slider_child_l * $slider_width);
	
	var slider_count = 0;
	
	if ($slider_child_l < 5) {
		$('#btn-right').css({cursor: 'auto'});
		$('#btn-right').removeClass("disabled");
	}
	
	$('#btn-right').click(function() {
		if ($slider_child_l < 5 || slider_count >= $slider_child_l - 5) {
			return false;
		}
		
		slider_count++;
		$slider.animate({left: '-=' + $slider_width + 'px'}, 'fast');
		slider_pic();
	});
	
	$('#btn-left').click(function() {
		if (slider_count <= 0) {
			return false;
		}
		slider_count--;
		$slider.animate({left: '+=' + $slider_width + 'px'}, 'fast');
		slider_pic();
	});
	
	function slider_pic() {
		if (slider_count >= $slider_child_l - 5) {
			$('#btn-right').css({cursor: 'auto'});
			$('#btn-right').addClass("disabled");
		}
		else if (slider_count > 0 && slider_count <= $slider_child_l - 5) {
			$('#btn-left').css({cursor: 'pointer'});
			$('#btn-left').removeClass("disabled");
			$('#btn-right').css({cursor: 'pointer'});
			$('#btn-right').removeClass("disabled");
		}
		else if (slider_count <= 0) {
			$('#btn-left').css({cursor: 'auto'});
			$('#btn-left').addClass("disabled");
		}
	}
	
});