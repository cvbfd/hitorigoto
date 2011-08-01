var Note = Model("note", function() {
    this.persistence(Model.localStorage);
});

$(document).ready(function() {

    twttr.anywhere(function (T) {
        T(".tweet_box").tweetBox({
        });
    });

    $('.note').draggable({
        containment: 'parent',
        distance: 10,
        opacity: 0.75
    });
    // initialize
    Note.load(function() {
    });

    /*
     $('.addNote').click(function(){
     var note = new Note({
     'color' : this.className.split(' ')[1],
     'text'  : 'Click here to write',
     'angle' : Math.random() * 1.1,
     'w'     : 100,
     'h'     : 80,
     'x'     : 40,
     'y'     : 40
     });
     // add uid as id
     note.attr('id', note.uid);
     note.save();
     });

     $('textarea').live('focus', function(){
     if (this.value == "Click here to write"){
     this.value = "";
     }
     });

     $('.delete').live('click', function(){
     var id = $(this).parent()[0].id;
     var note = Note.find(id);
     note.destroy();
     });

     $('textarea').live('blur', function(){
     if (this.value == ""){
     this.value = "Click here to write";
     }
     var id   = $(this).parent()[0].id;
     var text = this.value;

     var note = Note.find(id);
     note.attr('text', text);
     note.save();

     });

     $('textarea').live('keyup', function(){
     var id   = $(this).parent()[0].id.split("_")[1];
     var text = this.value;

     var note = Note.find(id);
     note.attr('text', text);
     note.save();
     });

     // generate notes
     Note.each(function() {
     generateNote(this.attributes);
     });

     function generateNote(data){
     var template = '<div id="' + data.id + '" class="note white"><div class="ribbon"/><div class="delete">x</div><textarea class="textedit">' + data.text + '</textarea>';

     template = $(template).css({
     '-webkit-transform':'rotate(-'+data.angle+'deg)',
     '-moz-transform':'rotate(-'+data.angle+'deg)',
     'width': data.w,
     'height': data.h,
     'left': data.x,
     'top': data.y
     });
     template.find(".ribbon").addClass(data.color);


     $('#notesContainer').append(template);

     $('.note').draggable({
     containment: 'parent',
     distance: 10,
     opacity: 0.75
     }).resizable({
     containment: 'parent'
     });

     $(template).bind("dragstop", function(event, ui) {
     var x = ui.position.left;
     var y = ui.position.top;
     var w = $(this).width();
     var h = $(this).height();

     var note = Note.find(data.id);
     note.attr('x', x);
     note.attr('y', y);
     note.attr('w', w);
     note.attr('h', h);
     note.save();
     });

     $(template).bind("resize", function(event, ui) {
     var w = $(this).width();
     var h = $(this).height();

     var note = Note.find(data.id);
     note.attr('w', w);
     note.attr('h', h);
     note.save();
     });
     };

     //bind class events
     Note.bind('add', function(note) {
     generateNote(note.attributes);
     });

     Note.bind('remove', function(note) {
     $("#" + note.uid).remove();
     });
     */
});