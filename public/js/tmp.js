  var User = new Model('user', function() {
        this.persistence(Model.localStorage);
        this.extend({
            find_by_screen_name: function(screen_name) {
                return this.detect(function() {
                    return this.attr("screen_name") === screen_name
                })
            }
        })
    });
    var getFriends = function(ids) {
        var url = 'http://api.twitter.com/1/users/lookup.json?user_id=' + ids.join(',') + '&callback=?';
        $.getJSON(url, {}, function(data) {
            for (var i = 0, len = data.length; i < len; i++) {
                var screen_name = '@' + data[i].screen_name;
                if (User.find_by_screen_name(screen_name) === undefined) {
                    var user = new User({screen_name: screen_name});
                    user.save();
                }
            }
        });
    }

    var getFriendIds = function(screen_name, cursor) {
        var url = 'http://api.twitter.com/1/friends/ids.json?screen_name=' + screen_name + '&cursor=' + cursor + '&callback=?';
        $.getJSON(url, {}, function(data) {
            var ids = data.ids;

            for (var i = 0, len = ids.length / 100; i < len; i++) {
                var sliced_ids = ids.slice(i * 100, (i + 1) * 100);
                getFriends(sliced_ids);
            }

            if (data.next_cursor !== 0) {
                getFriendIds(screen_name, data.next_cursor);
            }
        });
    }


    var autoCompleteName = function() {
        $("#tweet_box textarea").keyup(function(event) {
            var text = $('#tweet_box textarea').val();

            if (text[text.length - 1] != '@') {
                return;
            }

            var self = this;

            var screen_names = User.map(function() {
                return this.attr("screen_name");
            });

            $(this).autocomplete(screen_names, {
                multiple: true,
                multipleSeparator: ' ',
                mustMatch: false
            });
            /*
             .result(function(event, item) {      // callbackイベントを設定
             var value = $(self).val();
             console.log(value);
             $(self).val(value + " "); // @screen_nameの後に半角スペースを1つ置く
             $(self).unbind();
             });
             */
            $(this).keydown();                    // "@"が既に入力されているので、能動的にkeydownして補完させる
        });
    };


    $(function() {
        User.load(function() {
        });
        /*
         twttr.anywhere(function (T) {
         T("#tweet_box").tweetBox({
         height: 50,
         width: 520
         });
         });

         twttr.anywhere(function (T) {
         if (T.isConnected()) {
         var current_user = T.currentUser;
         var screen_name = current_user.data('screen_name');
         getFriends(screen_name, "-1");

         } else {
         T("#login").connectButton();
         }
         });
         */
        // getFriendIds('ninoseki', "-1");
        // autoCompleteName();

    });