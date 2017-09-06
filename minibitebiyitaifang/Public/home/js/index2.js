$(function(){
	$('.p_name li').first().addClass('red').siblings().removeClass('red');
	      
    //左右焦点图		  
    var page = 1;
    var i =1;
    var conwidth = $('#menu_cons').width();   //最大DIV的高			
    var imgwidth=$(".img1").width()+"px"; 	
    var lilen = $('.tag1 ol li').length-6; //li列表的长度
	//alert(lilen);  18
	var len = Math.ceil( lilen / i );	
	//alert(len);	
   $('.next').click(function() {  
		//alert(page);
        if( page==(len-7)) {
            $('span.prev').css("opacity","1");
            $('.con_list').animate({left:0},'slow');
            page = 1;
        }else{
			$('span.prev').css("opacity","1");
            $('.con_list').animate({left:'-=' + imgwidth},'slow');
            page++;
        }
    });
    $('.prev').click(function() {             	 
        if( page == 1 ) {
            $('span.prev').css("opacity","0.5");
            return false;
        }else{
			$('span.prev').css("opacity","1");
            $('.con_list').animate({left:'+=' + imgwidth},'slow');
            page--;
        }
    });
           
    //上下焦点图
	var page = 1;
    var i =1;
    var conheight = $('#menu_con_p').height();   //最大DIV的高
    var b=$(".img2").height();
    var a=11;
    var imgheight=(b+a)+"px";
    var lilen = $('.tag2 ul li').length;//li列表的长度
    var len = Math.ceil( lilen / i )-5;
    $('.prev1').click(function() {
        if( page == 1 ) {
            $('span.prev1').css("opacity","0.5");
            return false;
        }else{
            $('span.prev1').css("opacity","1");
            $('.con_list1').animate({top:'+=' + imgheight},'slow');
            page--;
        }
    });
    $('.next1').click(function() {
		if( page ==(len-4)) {
			$('span.prev1').css("opacity","1");
			$('.con_list1').animate({top:0},'slow');
			page = 1;
        }else{
			$('span.prev1').css("opacity","1");
			$('.con_list1').animate({top:'-=' + imgheight},'slow');
			page++;
       }
   });

		   
		   
		   
      /*       var page = 1;
            var i =1;
            var conheight = $('#menu_con_p').height();   //最大DIV的高
            var b=$(".img2").height();
             var a=11;
   var imgheight=(b+a)+"px";
             var lilen = $('.tag2 ul li').length;//li列表的长度
   var len = Math.ceil( lilen / i );
    $('.prev1').click(function() {
        if( page == 1 ) {
            $('span.prev1').css("opacity","0.5");
            return false;
        }else{
            $('span.prev1').css("opacity","1");
            $('.con_list1').animate({top:'+=' + imgheight},'slow');
            page--;
        }
    });
    $('.next1').click(function() {
     if( page ==(len-4)) {
         $('span.prev1').css("opacity","1");
    $('.con_list1').animate({top:0},'slow');
   page = 1;
         }else{
         $('span.prev1').css("opacity","1");
      $('.con_list1').animate({top:'-=' + imgheight},'slow');
    page++;
       }
   }); */
    
	//选项卡
    var tabs=function(){
        function tag(name,elem){
            return (elem||document).getElementsByTagName(name);
        }
        //获得相应ID的元素
        function id(name){
            return document.getElementById(name);
        }
        function first(elem){
            elem=elem.firstChild;
            return elem&&elem.nodeType==1? elem:next(elem);
        }
        function next(elem){
            do{
                elem=elem.nextSibling;  
            }while(
                elem&&elem.nodeType!=1  
            )
            return elem;
        }
                return {
                     set:function(elemId,tabId){
                         var elem=tag("li",id(elemId));
                         var tabs=tag("div",id(tabId));
                         var listNum=elem.length;
                         var tabNum=tabs.length;
                         for(var i=0;i<listNum;i++){
                                 elem[i].onclick=(function(i){
                                     return function(){
                                         for(var j=0;j<tabNum;j++){
                                             if(i==j){
                                                 tabs[j].style.display="block";
                                                 //alert(elem[j].firstChild);
                                                 elem[j].firstChild.className="selected";
                                             }
                                             else{
                                                 tabs[j].style.display="none";
                                                elem[j].firstChild.className="";
                                             }
                                         }
                                     }
                                 })(i)
                             }
                         }
                     }
                 }();
                      tabs.set("top1","menu_top");//执行
               
             //评价  进度条
             function animate(){
             	var max="barred";
             	var middle="baryellow";
             	var min="barblue";	
             	
             	var maxValue=0;
             	var minValue=0;
             	
             	var maxIndex=0;
             	var minIndex=0;
             	
             	$(".charts").each(function(i,item){
             		var a=parseInt($(item).attr("w"));
             	
             		if(i==0){
             			minValue=a;
             			minIndex=i;
             		}
             	
             		if(a>maxValue){
             			maxValue=a;
             			maxIndex=i;
             		}else if(a<minValue){
             			minValue=a;
             			minIndex=i;
             		}
             	
             	});
             	
             	$(".charts").each(function(i,item){
             		var addStyle="";
             		var divindex=parseInt($(item).attr("divindex"));
             		if(divindex==maxIndex){
             			addStyle=max;
             		}else if(divindex==minIndex){
             			addStyle=min;
             		}else{
             			addStyle=middle;
             		}
             	
             		$(item).addClass(addStyle);
             		var a=$(item).attr("w");
             		$(item).animate({
             			width: a+"%"
             		},1000);
             	});
             	
             }
             animate();
        //   <!--回顶部-->
             
             
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
 
    
})
















































