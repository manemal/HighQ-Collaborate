/****
 * HighQ-Collaborate ClientCustomisations
 * https://github.com/manemal/HighQ-Collaborate
 *
 * @author Andrew Quinn <andrew.quinn@corrs.com.au>
 *
 * Released under MIT License. See LICENSE.txt or http://opensource.org/licenses/MIT
 */
;(function($) {

    ClientCustomisations = window.ClientCustomisations || {};

    /**
     * Setup custom ordering for a People List (macro)
     *
     * @param {String} macro - This can be either the title of the list OR the macro id
     */
    ClientCustomisations.forPeopleList = function(macro) {
        var re = new RegExp("renderListItem.*macroID=\\d+$","i"),
            reUID = /(\d+)\);$/i,
            css = [
                ".macroList_people.ci-modified div.clearfix {",
                    "margin-bottom:15px;",
                    "padding-bottom:15px;",
                    "border-bottom:1px solid #e7e7e7",
                "}"
            ].join("");
        return {
            /**
             * Define how we will identifier user's we which to reorder
             *
             * @param {String} identifier
             */
            using: function(identifier) {
                return {
                    /**
                     * Provide an array of user's in the order we which them place atop.
                     * Contains of the array depends on the previous call (using).
                     *
                     * @param {Array} users
                     */
                    reorderBy: function(users) {
                        $(document).ajaxComplete(function(event, xhr, ajaxOptions) {
                            if (re.test(ajaxOptions.url)) {
                                var $list = $("#siteHomeContentID").find("div.macroList_people.ckLinkInfo:not(.ci-modified)").filter(function(i, el) {
                                    return _.isNaN(+macro) ?
                                        // if macro parameter is the list title...
                                        $.trim($(el).find("h4").text()).toLowerCase() === $.trim(macro.toLowerCase()) :
                                        // if macro parameter is the id
                                        $(el).find("h4").parent("[id='list_"+macro+"']").length;
                                });
                                if ($list.length) {
                                    if (!$("head>style[data-src='ci-modified']").length) {
                                        // add our required css styling (if not already done so)
                                        $("head").append('<style type="text/css" data-src="ci-modified">'+css+'</style>');
                                    }
                                    if (!$list.find(">ci-container-moved").length) {
                                        // add the container for our moved users
                                        $list.find(">h4").after('<div class="ci-container-moved"></div>');
                                        // and remove any horizontal rule elements in the list (we replace with CSS styling)
                                        $list.find(">hr").remove();
                                    }
                                    $list.find(">div:not(.ci-user)>div>a[onclick*='(this,']").each(function(i,e){
                                        // add the user id to each list item to allow us to
                                        // use CSS in the future to target specific users
                                        if ((match = $(e).attr("onclick").match(reUID))) {
                                            $(e).parents("div.clearfix:first").addClass("ci-user").attr("data-uid", match[1]);
                                        }
                                    });
                                    users
                                        // clean up the user list provided
                                        .map(function(t) { return $.trim(t); })
                                        // now for each user find them in the list (based on identification method specified)
                                        .map(function(user) {
                                            switch($.trim(identifier).toLowerCase()){

                                                // if we are identifying users by their system user id
                                                case "userid":
                                                    return $list.find(">div:not(.ci-container-moved) a.peopleName[onclick*='(this, "+user+")']").parents("div.clearfix:first");

                                                // if we are identifying users by their name (full name as displayed in the list)
                                                case "name":
                                                    return $list.find(">div:not(.ci-container-moved) a.peopleName[title]").filter(function(i,e){
                                                        //console.log(i,e,user);
                                                        return $(e).attr("title").toLowerCase() === user.toLowerCase();
                                                    }).parents("div.clearfix:first");

                                                // if we are identifying users by their email address
                                                case "email":
                                                    return $list.find(">div:not(.ci-container-moved) a[href^='mailto:']")
                                                        .filter(function(i,e) {
                                                            return $(e).attr("href").toLowerCase() === "mailto:"+user.toLowerCase();
                                                        }).parents("div.clearfix:first");

                                                // unknown identification specified
                                                default:
                                                    return $("");
                                            }
                                        }).forEach(function(el){
                                            // for each user found, move them into our 'moved' container at the top of the list
                                            $(el).appendTo($list.addClass("ci-modified").find(">.ci-container-moved"));
                                        });
                                }
                            }
                        });

                        // return back the namespace to allow chaining of methods
                        return ClientCustomisations;
                    }
                }
            }
        };
    };
})(jQuery.noConflict());