
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
	
	$(".type1").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("curr1").siblings().removeClass("curr1")
	 })
	  
	})
   // var url=window.location.href;
    //var arr=url.split("/");
    //var valu=arr.pop();
    //if(valu == "ren"){
   	// alert("xiangdeng");
   	// $(".chanpin_you .paixu ul li:first").addClass("cur");
    //}
	
 //上下焦点图
   var page = 1;
   var i =1;
   var conheight = $('#menu_con').height();   //最大DIV的高
   var b=$(".imga").height();  
   var a=11;
   var imgheight=(b+a)+"px";
    
   var lilen = $('.tag ul li').length;            //li列表的长度
   var len = Math.ceil( lilen / i )-5;  
    $('.next1').click(function() {
	
     if( page ==(len-4)) {
$('.prev1').css("opacity","1");
    $('.con_list').animate({top:0},'slow');
   page = 1;
         }else{
			 $('.prev1').css("opacity","1");
      $('.con_list').animate({top:'-=' + imgheight},'slow');
    page++;
       }
   });
        $('.prev1').click(function() {
      if( page == 1 ) {
		   $('.prev1').css("opacity","0.5");
          return false;	   
           }else{
			    $('.prev1').css("opacity","1");
     $('.con_list').animate({top:'+=' + imgheight},'slow');
   page--;
    }
  });
      


 




})