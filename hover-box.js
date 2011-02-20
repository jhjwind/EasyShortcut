/*
  Displays tooltips that show shortcut mappings over the relevant elements.
*/

easyShortcut.shortcuts = {};
easyShortcut.shortcutBoxes = {};
easyShortcut.shortcutHandlers = {};


$(function(){
  $(document).bind('keydown', 'Alt', function(e){
    console.log(e);
    easyShortcut.displayShortcuts();
  });
  
  $(document).bind('keyup', 'Alt', function(e){
    easyShortcut.hideShortcuts();
  });
  
  easyShortcut.assignKey($('a')); 
});

easyShortcut.assignKey = function(e){
	easyShortcut.number = ["1","2","3","4","5","6","7","8","9","0"];
	easyShortcut.shortcutPool = new Array();
	
	$.each(e, function(){
		
		e = this;

		var textInfo = null; 
		
		if ($(this).attr('name') !== '') {
			textInfo = $(this).attr('name');
		};
		
		if (textInfo == null && $.trim($(this).text()) != "") {
			textInfo = $(this).text();
		};
		
		if (textInfo == null && $(this).has('img') !== null){
			console.log("has image");
			console.log($(this).has('img'));
			if ($($(this).children('img')[0]).attr('alt') !== ''){
				textInfo = $($(this).children('img')[0]).attr('alt');
			}
			else {
				textInfo = "i";
			};
		};
		
		console.log(textInfo);
		
		var tempShortcut = textInfo.substr(0,1).toLowerCase();
				
		console.log(tempShortcut);
		
		if ($.inArray(tempShortcut, easyShortcut.shortcutPool) == -1) 
		{
			easyShortcut.shortcutPool.push(tempShortcut);
			e.shortcut = tempShortcut;
		}
		else{
			for (i in easyShortcut.number){
				var shortcutWithNumber = tempShortcut + i;
				if( $.inArray(shortcutWithNumber, easyShortcut.shortcutPool) == -1){
					easyShortcut.shortcutPool.push(shortcutWithNumber);
					e.shortcut = shortcutWithNumber;
					break;
				}
			};
		};
		
		console.log("shortcut! ", e.shortcut, e);
  
    easyShortcut.shortcuts[e.shortcut] = e;
    var handler = function(){ easyShortcut.onShortcut(arguments.callee.e) };
		handler.e = e;
    easyShortcut.shortcutHandlers[e.shortcut] = handler;
    $(document).bind('keyup', 'Alt+' + e.shortcut, handler);
  
	});
}

easyShortcut.onShortcut = function(elem){
  console.log('got shortcut (' + elem.shortcut + ') for: ', elem);
  $(elem).focus();
}

easyShortcut.displayShortcuts = function(){
  for(var key in easyShortcut.shortcuts){
    var e = easyShortcut.shortcuts[key];
    var box = $('<div class="hover-box" />');
    box.css('position', 'absolute');
    $('body').append(box);
    
    var r = e.getClientRects()[0];
    if(!r) r = e.getBoundingClientRect();
    if(!r) return;
    var r2 = box[0].getBoundingClientRect();
    box.css('top', (r.top + window.scrollY + (r.height / 2) - (r2.height / 2)) + 'px');
    box.css('left', (r.right + window.scrollX - (r.width / 2) - (r2.width / 2)) + 'px');
    box.css('z-index', '10000');
    box.text(key);
    easyShortcut.shortcutBoxes[key] = box;
    
    $(e).addClass('hover-target');
    
  }
}

easyShortcut.hideShortcuts = function(){
  for(var key in easyShortcut.shortcutBoxes){
    $(easyShortcut.shortcuts[key]).removeClass('hover-target');
    $(easyShortcut.shortcutBoxes[key]).remove();
    delete easyShortcut.shortcutBoxes[key];
  }
}
