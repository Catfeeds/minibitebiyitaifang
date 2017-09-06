
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
	



})