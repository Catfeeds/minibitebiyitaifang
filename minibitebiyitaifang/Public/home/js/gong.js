
$(function(){

	 /*鼠标放上li改变背景色缓动*/
    var oDiv = $(".xuanfu").find("li");
    oDiv.each(function(index){
        $(this).hover(function(){
            $(this).addClass("current");
        },function(){
            $(this).removeClass("current");
        });
    });
    
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
    
})
















































