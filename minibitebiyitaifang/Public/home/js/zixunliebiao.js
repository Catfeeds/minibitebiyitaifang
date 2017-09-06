
$(function(){
	
	
	//点击字变颜色
	$(".type").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("curr").siblings().removeClass("curr")
	 })
	  
	})
	
	$("._type").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("active").siblings().removeClass("active")
	 })
	  
	})
	
	   /*向上滚动箭头隐藏，向下滚动显示*/
    $("#xuanfu").find("li:last").hide();
    $(window).scroll(function(){
        if($(window).scrollTop() > 50){
            $("#xuanfu").find("li:last").fadeIn(800);
           
        }else{
           $("#xuanfu").find("li:last").hide();
        }
    });
    
    /*点击箭头，缓慢滑到顶部*/
    $("#xuanfu").find("li:last").on("click", function(){
        $("body,html").animate({"scrollTop":0},500);
   });
  //左右焦点图
    $('.all-goods .item').hover(function(){
		$(this).addClass('active')
		$(this).find('.product-wrap').show();
	},function(){
		$(this).removeClass('active')
		$(this).find('.product-wrap').hide();
	});

  //资讯分类
	$('.all-goods .item').hover(function(){
		$(this).addClass('active')
		$(this).find('.product-wrap').show();
	},function(){
		$(this).removeClass('active')
		$(this).find('.product-wrap').hide();
	});



})