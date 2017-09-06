
$(function(){

	$('.type li').click(function() {
	    $(this).addClass('curr').siblings().removeClass('curr');
	    $('#searchtype').val($(this).attr('num'));
	    var keyword=$('#keyword').val();
	    if($('#searchtype').val()==0){
	    	//产品搜索
	    	 $('#searchForm').attr("action","/index.php/Product/index/");
	    	 
	    }else if($('#searchtype').val()==1){
	    	//店铺搜索
	    	 $('#searchForm').attr("action","/index.php/Shopping/shopsList/");
	    	
	    }else{
			$('#searchForm').attr("action","/index.php/News/index/");
		}
	    
	});
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
	
	//焦点图	
     var index=0;
        var imgStart;
        var len=$(".num li").length;
        $(".bt_jdt").hover(function(){
            clearInterval(imgStart);
        },function(){
            imgStart=setInterval(function(){
                index++;
                show2();
            },3000);
        }).triggerHandler("mouseout");
        $(".num li").click(function(){
            index=$(".num li").index(this);
            show2();
        })
        function show2(){
            var adWidth=$(".bt_jdt").width();
            if(index==len){
            index=0;
            }
            $(".slider").stop(true).animate({
               left:-adWidth*index
            },1500);
            $(".num li").removeClass("on").eq(index).addClass("on");
        }    
        

		
		
 ///*<!--数码电脑专区-->*/选项卡2
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
                                /*if(i==j){
                                    tabs[j].style.display="block";
                                    //alert(elem[j].firstChild);
                                    elem[j].firstChild.className="selected";
                                }
                                else{
                                    tabs[j].style.display="none";
                                    elem[j].firstChild.className="";
                                }*/
                            }
                        }
                    })(i)
                }
            }
        }
    }();
          tabs.set("nav1","menu_con1");//执行
          
          
	 ///*<!--运动健身专区 -->*/选项卡3
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
                               /* if(i==j){
                                    tabs[j].style.display="block";
                                    //alert(elem[j].firstChild);
                                    elem[j].firstChild.className="selected";
                                }
                                else{
                                    tabs[j].style.display="none";
                                    elem[j].firstChild.className="";
                                }*/
                            }
                        }
                    })(i)
                }
            }
        }
    }();
    tabs.set("nav2","menu_con2");//执行
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
                                   /* if(i==j){
                                        tabs[j].style.display="block";
                                        //alert(elem[j].firstChild);
                                        elem[j].firstChild.className="selected";
                                    }
                                    else{
                                        tabs[j].style.display="none";
                                        elem[j].firstChild.className="";
                                    }*/
                                }
                            }
                        })(i)
                    }
                }
            }
        }();
        tabs.set("nav3","menu_con3");//执行
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
                                        /*if(i==j){
                                            tabs[j].style.display="block";
                                            //alert(elem[j].firstChild);
                                            elem[j].firstChild.className="selected";
                                        }
                                        else{
                                            tabs[j].style.display="none";
                                            elem[j].firstChild.className="";
                                        }*/
                                    }
                                }
                            })(i)
                        }
                    }
                }
            }();
            tabs.set("nav4","menu_con4");//执行
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
                                            /*if(i==j){
                                                tabs[j].style.display="block";
                                                //alert(elem[j].firstChild);
                                                elem[j].firstChild.className="selected";
                                            }
                                            else{
                                                tabs[j].style.display="none";
                                                elem[j].firstChild.className="";
                                            }*/
                                        }
                                    }
                                })(i)
                            }
                        }
                    }
                }();
                tabs.set("nav5","menu_con5");//执行
   //跟着下划线变色 
   $("#nav").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("one").siblings().removeClass("one");
	 })
})     
   $("#nav").find("li").each(function(){
	  $(this).on('mouseover',function(){
	  	$(this).addClass("one").siblings().removeClass("one");
	 })
})     
    
	$("#nav1").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("two").siblings().removeClass("two");
	 })
    	
  })     
               
    $("#nav2").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("three").siblings().removeClass("three");
	 })
	  
})            
$("#nav3").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("four").siblings().removeClass("four");
	 })	
}) 

$("#nav4").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("five").siblings().removeClass("five");
	 })	
})
$("#nav5").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("six").siblings().removeClass("six");
	 })	
})
$("#nav6").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("seven").siblings().removeClass("seven");
	 })	
})
$("#nav7").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("eight").siblings().removeClass("eight");
	 })	
})
$("#nav8").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("nine").siblings().removeClass("nine");
	 })	
})
$("#nav9").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("ten").siblings().removeClass("ten");
	 })	
})
$("#nav10").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("eleven").siblings().removeClass("eleven");
	 })	
})
$("#nav11").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("twelve").siblings().removeClass("twelve");
	 })	
})
$("#nav12").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("thirteen").siblings().removeClass("thirteen");
	 })	
})
$("#nav13").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("fourteen").siblings().removeClass("fourteen");
	 })	
})
$("#nav14").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("fifteen").siblings().removeClass("fifteen");
	 })	
})
$("#nav15").find("li").each(function(){
	  $(this).click(function(){
	  	$(this).addClass("sixteen").siblings().removeClass("sixteen");
	 })	
})
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
            
            /*点击箭头，缓慢滑到顶部*/
            $("#xuanfu").find("li:last").on("click", function(){
                $("body,html").animate({"scrollTop":0},500);
           });
          //左右焦点图
           

 
    
})
















































