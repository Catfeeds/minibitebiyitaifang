
$(function(){
//分页

  
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
      
      
    //删除
    var r_btn=$(".remove_btn");
    var shop=$(".shangpin_one")
   
    r_btn.each(function(i){
    	$(this).click(function(){
           shop.eq(i).remove()           
   	})  		
})
  
 
      
      
      
})
