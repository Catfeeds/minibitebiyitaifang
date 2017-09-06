
$(function(){
   

      function hideAll(){
          _Pages.css('display','none');
        $('.numlink').removeClass('current');
     }
      $(document).ready(function(){
     $('.page:eq(0)').css('display','block');
      createLinks();
     $('.numlink:eq(0)').addClass('current');
     var _Next = $('#next');
     var _Prev = $('#prev');
      var _Link = $('.numlink');
     var now =  parseInt($('.numlink').index($('.current')));
    _Next.click(function(){
     hideAll();
     process(now+1,_Prev,_Next);
     now = parseInt($('.numlink').index($('.current')));
    });
      _Prev.click(function(){
    hideAll();
     process(now-1,_Prev,_Next);
    now = parseInt($('.numlink').index($('.current')));
    })
        _Link.click(function(){
    var that = $(this);
     hideAll();
    var which = that.index() - 1;
    process(which,_Prev,_Next);
    now = parseInt($('.numlink').index($('.current')));
      })
   })
           
     //全选   
	$(".allselect").click(function () {
		$(".one input[id=newslist]").each(function () {
			if ($(this).attr("checked")) {
				$(this).attr("checked", false);
			} else {
				$(this).attr("checked", true);
			} 
		});
		
	});
	
})



