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

    /**
     * Display a list of the current users Favourite Files.
     */
    ClientCustomisations.getFavouriteFilesList = function() {

        var cssDefaultList = "list-unstyled favModalScroll";

        return {
            forSite: function(siteID) {

                // if user passes anything other than a +ve integer, default to all sites
                if (_.isNaN(+siteID) || siteID < 1) {
                    siteID = undefined;
                }

                return {
                    placeInto: function($elem) {

                        var lastRowID = _.isUndefined(window["BannertopCollection"].lastRowID) ? 0 : +window["BannertopCollection"].lastRowID;

                        // make sure is valid number - otherwise zero (start)
                        lastRowID = +lastRowID || 0;

                        // we support user supplying string of jquery selector or just the name of the id
                        if (!($elem instanceof jQuery)) {

                            // try selector string first
                            var $elFind = $($elem.toString());
                            if (!$elFind.length) {
                                // no element exists with that selector, try prefixing with id (#) selector before failing
                                $elFind = $("#" + $elem.toString());
                            }

                            $elem = $elFind;
                        }

                        // make sure is valid jQuery object before continuing
                        if (!($elem instanceof jQuery) || !$elem.length) {
                            console.error("ClientCustomisations - cannot find provided element in the page", $elem);
                            return ClientCustomisations;
                        }

                        // make sure we are adding to an <UL> unordered list element
                        if ($elem.prop("tagName") === "UL") {
                            $elem.addClass(cssDefaultList);
                        } else {
                            $elem = $("<ul></ul>").appendTo($elem).addClass(cssDefaultList);
                        }

                        if (!lastRowID) {
                            $elem.empty();
                        }

                        // Build the url we use to query Collaborate about the user's Favourite documents
                        var url = "./dashboardFavouriteItemList.action?displayContent=FAVOURITES_ITEM_LIST&metaData.fromAction=FAVOURITE_MODAL_REFRESH&favouritesearch=&filtercontenttype=Document&currentPage=0&rowID={{ROW_ID}}&{{TOKEN_NAME}}={{TOKEN_VALUE}}"
                            .replace(/{{ROW_ID}}/i, lastRowID)
                            .replace(/{{TOKEN_NAME}}/i, window.systemProperty["CSRF_TOKEN_NAME"])
                            .replace(/{{TOKEN_VALUE}}/i, window.systemProperty["CSRF_TOKEN_VALUE"]);

                        $.post(url, {
                            "check": true,
                            "metaData.screenWidth": screen.width,
                            "ts": new Date().valueOf()
                        }).done(function(html) {

                            // and the returned list to process
                            var $html = $("<ul></ul>").append(html);

                            // if siteID provided, filter the list to only include...
                            if (+siteID) {
                                $html.find(">li").each(function(){
                                    if (!$(this).find("a[href][siteID='" + siteID + "']").length) {
                                        $(this).remove();
                                    }
                                });
                            }

                            // add list items to the element user passed in
                            $elem.append($html.children());

                            // if more results pending, collect until done
                            if (!window["BannertopCollection"].isStopScrolling) {
                                ClientCustomisations.getFavouriteFilesList().forSite(siteID).placeInto($elem);
                            }
                        });

                        return ClientCustomisations;
                    }
                };
            }
        }
    };

})(jQuery.noConflict());