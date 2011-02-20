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
  
  $('a').each(function(i, e){ easyShortcut.assignKey(e) }); 
});

easyShortcut.assignKey = function(e){
  console.log('assigning', e);
  if(e && e.text){
    e.shortcut = e.text.substr(0, 1);
    if(!e.shortcut || easyShortcut.shortcuts[e.shortcut] || e.shortcut.length < 1){
      console.log('already a: ' + e.shortcut);
      return;
    }
    
    easyShortcut.shortcuts[e.shortcut] = e;
    var handler = function(){ easyShortcut.onShortcut(e) };
    easyShortcut.shortcutHandlers[e.shortcut] = handler;
    $(document).bind('keyup', 'Alt+' + e.shortcut, handler);
  }
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
