
$(function(){

    // 点击字变颜色
	$(".dianpu_you").find("span").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("curr").siblings().removeClass("curr")
	     }) 
	})
	

	
//删除
	$(document).ready(function(){
    var r_btn=$(".remove_btn");
    var shop=$(".demo")
   
    r_btn.each(function(i){
    	$(this).click(function(){
           shop.eq(i).remove()            
   	       })  		
        })
    })


	
	
	
//隐藏 显示     新增收货地址弹框
$(".xianshi").click(function(){
	 $(".tanchuang").show();
  });
	  $(".quxiao").click(function(){ 	
	 	       $(".tanchuang").hide();
	 });



    

$(":input").blur(function(){
       if(this.value==""){
           $(this).next("h4").text($(this).prev().text()+"不能为空");
       }else{
       	$(this).next("h4").text("")
       }  
   })
                 //如果用户直接点击提交按钮
           
           
    $(".xianshi").click(function(){
      	  $(".mask").show();
      	  $(".tanchuang").show(); 	
    })
      autoCenter($(".tanchuang"))
      $(".quxiao").click(function(){
      	$(".mask").hide();
      	  $(".tanchuang").hide(); 
      	   $(".mask").hide();   	
      })

    
      
   function autoCenter(p) {
            var ele = document.documentElement || document.body;
            var x = (ele.clientWidth - p.width()) / 2;
            var y = (ele.clientHeight - p.height()) / 2;
            p.css({
                left: x,
                top: y
            })
    }
   
$(window).resize(function () {
                autoCenter($(".tanchuang"));
            })   



    })

/*编辑收货地址*/
/*$('.detail').on('click', function() {
	var _html = $(this).parent().parent().find('.type em').html();
	var _html = $parent.find('.type em').html();
	alert(_html);
});*/
