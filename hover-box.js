/*
  Displays tooltips that show shortcut mappings over the relevant elements.
*/

easyShortcut.shortcuts = {};
easyShortcut.shortcutBoxes = {};
easyShortcut.shortcutHandlers = {};
easyShortcut.shortcutPool = new Array();
easyShortcut.number = ["1","2","3","4","5","6","7","8","9","0"];

$(function(){
  $(document).bind('keydown', 'Alt', function(e){
    console.log(e);
    easyShortcut.displayShortcuts();
  });
  
  $(document).bind('keyup', 'Alt', function(e){
    easyShortcut.hideShortcuts();
  });
  
  $('a').each(function(i, e){ easyShortcut.assignKey(e) }); 
});

easyShortcut.assignKey = function(e){
	$.each(e, function(){

		var textInfo = null; 
		
		if ($(this).attr('name') !== '') {
			textInfo = $(this).attr('name');
		};
		
		if (textInfo == null && $.trim($(this).text()) != "") {
			console.log("here");
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
		
		e.shortcut = textInfo.substr(0,1).toLowerCase();
				
		console.log(shortcut);
		
		if ($.inArray(shortcut, easyShortcut.shortcutPool) == -1) 
		{
			easyShortcut.shortcutPool.push(shortcut);
		}
		else{
			for (i in easyShortcut.number){
				var shortcutWithNumber = shortcut + i;
				if( $.inArray(shortcutWithNumber, easyShortcut.shortcutPool) == -1){
					easyShortcut.shortcutPool.push(shortcutWithNumber);
					break;
				}
			};
		};
    
    easyShortcut.shortcuts[e.shortcut] = e;
    var handler = function(){ easyShortcut.onShortcut(e) };
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
