$(function() {
    // Model
    var Note = Backbone.Model.extend({
        defaults: {
            content: 'click here to write',
            color: 'green',
            x: 40,
            y: 40
        },
        clear: function() {
            this.destroy();
        }
    });

    // Coolection
    var NoteList = Backbone.Collection.extend({
        model: Note,
        localStorage: new Store("notes")
    });

    // Note View
    var NoteView = Backbone.View.extend({
        tagName: 'div', // name of tag to be created
        className: 'note', // name of class to be created

        template: _.template($('#note-template').html()),

        events: {
            'click div.delete': 'clear',
            'dragstop': 'updatePosition',
            'keyup textarea.tweet-box': 'updateContent'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'clear', 'updatePosition', 'updateContent', 'updateCounter');

            this.model.bind('change', this.updateCounter);
            this.model.bind('remove', this.remove);
        },

        render: function() {
            var note = this.template(this.model.toJSON());

            $(this.el).html(note);
            $(this.el).attr('id', this.model.id);
            $(this.el).css({
                'left': this.model.get('x'),
                'top': this.model.get('y')
            });

            $(this.el).draggable({
                containment: 'parent',
                distance: 10,
                opacity: 0.75
            });

            this.updateCounter();

            return this; // for chainable calls, like .render().el
        },
        clear: function() {
            this.model.clear();
            $(this.el).remove();
        },
        updatePosition: function(event, ui) {
            this.model.save({
                x: ui.position.left,
                y: ui.position.top
            });
        },
        updateContent: function() {
            this.model.save({
                content: $(this.el).find('textarea').val()
            });
        },
        updateCounter: function() {
            var len = 140 - this.model.get('content').length;
            $(this.el).find('.counter').text(len);
        }
    });

    // Note-List View
    var NoteListView = Backbone.View.extend({
        el: $('#main'), // el attaches to existing element
        events: {
            'click .addNote': 'addNote',
            'click div#dialog-overlay': 'hidePopup',
            'click div.publish': 'showPopup'
        },
        initialize: function() {
            _.bindAll(this, 'render', 'addNote', 'appendNote');

            this.collection = new NoteList();
            this.collection.bind('reset', this.render);
            this.collection.bind('add', this.appendNote);

            this.collection.fetch();
        },
        render: function(e) {
            this.collection.each(this.appendNote);
        },
        addNote: function(e) {
            var color = e.currentTarget.className.split(' ')[1];
            // color should be unique
            if ($('.note .' + color).length === 0) {
                this.collection.create({
                    color: color
                });
            }
        },
        appendNote: function(note) {
            var noteView = new NoteView({
                model: note
            });
            $(this.el).append(noteView.render().el);
        },
        showPopup: function(e) {
            // get the screen height and width
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();

            // calculate the values for center alignment
            var dialogTop = (maskHeight / 3) - ($('#dialog-box').height());
            var dialogLeft = (maskWidth / 2) - ($('#dialog-box').width() / 2);

            // assign values to the overlay and dialog box
            $('#dialog-overlay').css({height : maskHeight, width : maskWidth}).show();
            $('#dialog-box').css({top : dialogTop, left : dialogLeft}).show();

            // show Tweet box
            var id = $(e.currentTarget).parent().attr('id');
            twttr.anywhere(function (T) {
                T("#tweet-box").tweetBox({
                    label: 'tweet this?',
                    defaultContent: $('#' + id).find('textarea.tweet-box').val()
                });
            });
        },
        hidePopup: function() {
            $('#dialog-overlay, #dialog-box').hide();
            $('#dialog-box #tweet-box').empty();
        }
    });

    var noteListView = new NoteListView();
});