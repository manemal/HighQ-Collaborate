# HighQ-Collaborate
Customisations for HighQ Collaborate product

This javascript library is intended to help others with functionality related to the HighQ Collaborate SaaS platform.

---

**NOTE:** This library is now deprecated due to changes in the Collaborate dashboard architecture and technologies used (5.x onwards).

---

## ClientCustomisations
This is a library that includes a set of helper functions when creating Home page dashboards for a site.

### Installation

Before you go any further, if you haven't already, you will need to raise a support call with your HighQ Support team to ask them for the following request:

    - Please enable Javascript within Rich-text pages for my Collaborate instance

See https://kb-collaborate.highq.com/advanced-tip_-displaying-external-content-in-rich-text-pages for more details (scroll down to the "Javascript" heading). Once you get the response back from HighQ indicating this feature has been enabled, step through the list below to include the library into your instance.


1. Go to the [dist](https://github.com/manemal/HighQ-Collaborate/tree/master/dist) folder and download the latest version of the script file:
    - [current version](https://raw.githubusercontent.com/manemal/HighQ-Collaborate/master/dist/client-customisations.min.js) (_This will load the script into a new window. Click right mouse and select "Save as" from the menu._) 
1. Go to the System Admin section in your Collaborate instance, and select **File Library** from the left hand side menu
1. Click the **Add new file** button and upload the script file to your library
1. Once uploaded, hover over the file name of your newly uploaded file (in the table displayed) and click the right mouse to bring up the browser context menu.
    - select the option to copy the link to the clipboard (Copy link address in Chrome, or Copy shortcut in IE11)
    
    ![Screenshot](/docs/img/sysadmin-filelibrary.png?raw=true "System File Library screen")
    
1. Now edit your sites Home page dashboard and click the Source button in the toolbar that is displayed.
    
    ![Screenshot](/docs/img/site-home-edit.png?raw=true "Edit Toolbar in Home Dashboard")
    
1. Add the following tags into the Source window:

    ```html
        <script type="text/javascript" src="(paste in the link you copied in step 4)"></script>
    ```
    
    so for the example from the image link in step 4, we'd see something like:

    ```html
        <script type="text/javascript" src="https://myinstance.highq.com/myinstance/flag/flag_9999.action?timestamp=20171017082158"></script>
    ```
    
    This will _include_ the script for you to use it's features.
    - Now add another script tag where you will write the script of what you want to achieve, e.g.

    ```html
    <script type="text/javascript">
        ClientCustomisations.forPeopleList("My List").using("email").reorderBy([
            "user1@example.com",
            "user2@example.com",
            "user3@example.com"        
        ]);
    </script>
    ```
    
    The list of users should be separated by a comma (,) and surrounded by double quotes (")
    
1. Click the OK (green button) to save your changes, and click the tickbox to save the Home page back to Collaborate.
1. :+1: That's it, click on the Home page link in the top main navigation and you should see the reordered list.

___
### Methods
- [forPeopleList](#forpeoplelist)
- [getFavouriteFilesList](#getfavouritefileslist) 
___

#### forPeopleList
This is for use when you have People List's in your home page dashboard and you want to apply manual ordering.  Currently Collaborate only support displaying the generated list in alphabetical order.

##### Usage
```javascript
ClientCustomisations.forPeopleList(@list_title).using(@identifier).reorderBy(@user_list);
```

Where
- **@list_title:** Is the title of your people list (string) OR can be the Id (integer) of your People List macro.
- **@identifier:** is how you will identify the users in the next parameter. Options are
    - "name": The list contains the user's name.
    - "email": The list contains the user's email.
    - "userid": The list contains the user's system ID.
- **@user_list:** An array users in the order with which you want them displayed atop of the People List.

##### Examples of usage
If you had a People's list with the title "Business Development", and you wanted two senior staff (David Jones, Julia Smith) to be at the top of the list then you would include the script:

```javascript
ClientCustomisations.forPeopleList("Business Development").using("name").reorderBy([ 
   "David Jones", "Julia Smith" 
]);
```

Or, if you want to use their email addresses:

```javascript
ClientCustomisations.forPeopleList("Business Development").using("email").reorderBy([ 
   "david.jones@acme.com", "julia.smith@acme.com" 
]);
```

This essentially promotes those people to the top of the list (in the order you specified). If you have more than one list in the Home page, you just duplicate the script changing the People list title, and people you want promoted, e.g.

```javascript
ClientCustomisations.forPeopleList("Business Development").using("email").reorderBy([ 
   "david.jones@acme.com", "julia.smith@acme.com" 
]); 
ClientCustomisations.forPeopleList("My Other List").using("email").reorderBy([ 
   "james.bond@acme.com", "derek.flint@acme.com", "napoleon.solo@acme.com", "jason.bourne@acme.com" 
]);
```

Or you can _chain_ them together, e.g.

```javascript
ClientCustomisations
    .forPeopleList("Business Development").using("email").reorderBy([ 
        "david.jones@acme.com",
        "julia.smith@acme.com" 
    ])
    .forPeopleList("My Spy List").using("email").reorderBy([ 
        "james.bond@acme.com",
        "derek.flint@acme.com",
        "napoleon.solo@acme.com",
        "jason.bourne@acme.com" 
    ]);
```
There is no difference between the two approaches above, it's whichever reads clearer for you.

If you know the Id of the People List, you can use this instead of the list title,
e.g. If my (macro) id is 131:
 
```javascript
ClientCustomisations.forPeopleList(131).using("name").reorderBy([ 
   "David Jones", "Julia Smith" 
]);
```

***TIP: How do you find out the Id?***
```
...TODO... 
```
___

#### getFavouriteFilesList
This will allow you to display a list of the user's Favourite Files in the Home page dashboard, for either the current site, or a provided site Id.

##### Usage
```javascript
ClientCustomisations.getFavouriteFilesList().forSite(@siteId).placeInto(@location);
```

Where
- **@siteId:** This is optional.
    If you do not supply a site Id, then all favourites will be displayed regardless of which site they are from.
    If you supply a site Id, then only favourite documents from that site will be displayed.
- **@location:** This is the location of where you want the list to be displayed and can be the Id of the element you want the list to appear in, or it can be a jQuery selector string, or it can be the jQuery selected object itself (see examples).

##### Examples of usage

If you want the users favourite documents from all sites, and placed into the element with id "myList"
> see [w3schools.com](https://www.w3schools.com/tags/att_id.asp) for what or how to use "id"

```javascript
ClientCustomisations.getFavouriteFilesList().forSite().placeInto("myList");
```

If you want the users favourite documents from just site #42, and placed into the element with id "myList"

```javascript
ClientCustomisations.getFavouriteFilesList().forSite(42).placeInto("myList");
```

If you want the users favourite documents from just site #42, and placed into the element found at "#dashboard div.listContainer"

```javascript
ClientCustomisations.getFavouriteFilesList().forSite(42).placeInto("#dashboard div.listContainer");
```

If you want the users favourite documents from just site #42, and placed into this element

```javascript
var $element = $j("#myList");
ClientCustomisations.getFavouriteFilesList().forSite(42).placeInto($element);
```
