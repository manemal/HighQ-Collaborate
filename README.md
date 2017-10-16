# HighQ-Collaborate
Customisations for HighQ Collaborate product

This javascript library is intended to help others with functionality related to the HighQ Collaborate SaaS platform.

The library is intended for version 4.1 onwards of Collaborate.


## ClientCustomisations
This is a library that includes a set of helper functions when creating Home page dashboards for a site.

#### Methods

##### forPeopleList

This is for use when you have People List's in your home page dashboard and you want to apply manual ordering.  Currently Collaborate only support displaying the generated list in alphabetical order.

###### Usage
```javascript
ClientCustomisations.forPeopleList(@list_title).using(@identifier).reorderBy(@user_list);
```
Where
- **@list_title:** Is the title of your people list (string) OR can be the Id of your People List macro.
- **@identifier:** is how you will indentify the users in the next parameter. Options are
    - "name": The list contains the user's name.
    - "email": The list contains the user's email.
    - "userid": The list contains the user's system ID.
- **@user_list:** An array users in the order with which you want them displayed atop of the People List.

###### Examples of usage
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
