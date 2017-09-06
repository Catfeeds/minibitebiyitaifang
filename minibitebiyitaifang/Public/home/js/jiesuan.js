
$(function(){
	
	//点击字变颜色
	$(".zhifu").find("button").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("curr").siblings().removeClass("curr")
	 })
	  
	})
	
	
	//删除
	 var li=$(".name ul li");
	var table=$("table.hide_t");
	var ul= $(".name ul");
	var del=$(".deleted");
	li.each(function(i){
		$(this).hover(function(){
			
		table.eq(i).show()	
		
		},function(){
			table.eq(i).hide()		
		})
			
	})
	
	del.each(function(i){
		
	  $(this).click(function(){
	  	
	  	if(confirm("您真的要删除吗")){
	  		li.eq(i).remove()
	  	}else{
	  		
	  	}
	  
	  })

	})
	
	/*默认图标处*/

 	var ad=$(".address")
ad.each(function(i){
	ad.eq(i).click(function(){
	  li.eq(i).addClass("moren").siblings().removeClass("moren");
	  var name=$(".moren tr td:eq(0)").html();
	  $(".zongjia ol li #contact").val(name);
	  var add=$(".moren tr td:eq(1)").html();
	  $(".zongjia ol li #address_xq").val(add);
	  var tel=$(".moren tr td:eq(2)").html();
	  $(".zongjia ol li #tel").val(tel);
	  var code=$(".moren tr td:eq(3)").html();
	  $(".zongjia ol li #code").val(code);
	})
	
})
	//收起地址
	$(".shou_btn").click(function(){
		ul.toggleClass("hide")
	if(ul.is(":visible")==false){
		$(".shou_btn").html("展开地址 &dArr;")
	  }else{
	  	$(".shou_btn").html("收起地址&uArr;")
	  }
	})

//隐藏 显示
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
           $("#form1").submit(function(){
			   $(":input").blur();
               if($("h4:empty").length==5){	
               	return true;
			   }
               else{				   
				   return false; 
				   }
           })
           
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

        $('.king_yunfei').eq(0).attr('checked', 'checked');
    
})



 







