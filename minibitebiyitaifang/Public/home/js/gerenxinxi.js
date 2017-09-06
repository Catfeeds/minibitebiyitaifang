
 $(function(){
           $(":input").blur(function(){
               if(this.value==""){
                   $(this).next("h4").text($(this).prev().text()+"不能为空");
               } 
               
                //昵称 验证   汉字
               if($(this).is("#Y1")){
                   var $Y1=$(this).val();
                   var parr=/^[0-9a-zA-Z|\u4e00-\u9fa5]+$/;
                   if(!parr.test($Y1)){
                    $(this).addClass("hehe").next("h4").text("2-18位，字母、数字、汉字")
                   }else{ 
                         $(this).addClass("haha")
                         .next("h4").text("")
                      }
               }
               if($(this).is(".Y5")){
                   var $Y2=$(this).val();
                   var parr=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
                   if(!parr.test($Y2)){
                   $(this).addClass("hehe").next("h4").text("请输入6-12位字母及数字！")
                   }else{ 
                         $(this).addClass("haha")
                         .next("h4").text("")
                      }
               }
                //手机号  验证   11位数字
               if($(this).is("#Y3")){
                   var $Y3=$(this).val();
                   var parr=/(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
                  if(!parr.test($Y3)){
                    $(this).addClass("hehe").next("h4").text("手机号不正确")
                   }else{ 
                         $(this).addClass("haha")
                         .next("h4").text("")
                      }
               }
               
           })
            
           //如果用户直接点击提交按钮
           $('.button input').on('click', function() {
              var _val1 = $('#Y1').val();
              var _val3 = $('#Y3').val();
              if(_val1=='' || _val3==' ') {
                return false;
              } else {
                if($("h4:empty").length == 3) {
                  return true;
                } else {
                  return false;
                }
              }
           });
           /*$("form1").submit(function(){
			         
               if($("h4:empty").length == 3){
               	  return true;
			         } else {				   
				          return false; 
				       }
           })*/
            
       })
       