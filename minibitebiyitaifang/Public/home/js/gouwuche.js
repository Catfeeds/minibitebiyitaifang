
$(document).ready(function () {
  //部分全选
	$(".select").each(function(i){
	  	$(this).click(function(){
	  		if($(this).is(":checked")==true){
	         $(".shangpin_one").eq(i).find(":checkbox").prop("checked",true)
		 }else{
		 	 $(".shangpin_one").eq(i).find(":checkbox").prop("checked",false)
		 }
	  	GetCount();	
	  	})

	  });
   //反选 	  
$(".allselect").click(function () {
		$(".shangpin_one input[name=newslist]").each(function () {
			if ($(this).attr("checked")) {
				$(this).attr("checked", false);
			} else {
				$(this).attr("checked", true);
			} 
		});
		GetCount();
	});

//	$("#gwc_tb input[name=newslist]").click(function () {
//		if ($(this).attr("checked")) {
//		} else {
//		}
//	});

	// 单件商品选中的价钱
	$("#gwc_tb input[name=newslist]").click(function () {
		GetCount();
	});
});
//******************
function GetCount() {
	//显示价钱
	var conts = 0;
	var aa = 0;
	$("#gwc_tb input[name=newslist]").each(function () {
		if ($(this).attr("checked")) {
			for (var i = 0; i < $(this).length; i++) {
				conts += parseFloat($(this).val());
				aa += 1;
			}
		}
	});
	
	$("#zong1").html((conts).toFixed(2));
	$("#jz1").css("display", "none");
	$("#jz2").css("display", "block");
}

//删除
$(document).ready(function(){
    var r_btn=$(".remove_btn");
    var shop=$(".shangpin_one_top")
   
    r_btn.each(function(i){
    	$(this).click(function(){
           shop.eq(i).remove()           
            GetCount();
   	})  		
})
  

//$("#del_All").click(function(){
//	  	$(".xuan").each(function (i) {
//				if ($(this).attr("checked")) {
//					
//						shop.eq(i).remove()
//
//				
//					
//				} else{
//					//alert("请选择要删除的商品");
//				} 
//			});
//			    GetCount();
//	      })
  })  
  
 
  
  
  
