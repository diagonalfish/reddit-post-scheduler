reddit-post-scheduler
=====================

Bot that posts scheduled posts to a subreddit, and web interface for scheduling posts (complete with previews!)

This was developed for use on reddit's college football section (http://www.reddit.com/r/CFB), but it should work for any subreddit if configured properly.

Requirements:

* node.js (tested on 0.10.42, but probably works on newer ones). Javascript dependencies are bundled in this repository.
* Python (tested on 2.7.x)
* [PRAW](https://praw.readthedocs.org/en/stable/)
* [praw2oauth2](https://github.com/avinassh/prawoauth2)
* crontab
* sqlite3 runtime libraries ('sqlite3' and 'libsqlite3-0' on Debian/Ubuntu-flavored *nix)

To use:

* Install PRAW, node.js, and other dependencies.
* Edit postbot.py and change the subreddit, and OAuth keys for the bot to post with.
* Open postscheduler.js and modify the username/password.
* Run 'node postscheduler.js' in the 'web' directory to start the web interface.
* Create a crontab to cd to the directory with postbot.py and run it once every 5 minutes.
* Navigate to http://yourserver:3000. Start scheduling posts. Enjoy!

To add and use post flair, you need to add rows to the 'flair' table in the SQLite database. I will leave this as an exercise for the user for now, but you just need to insert a row with 'text' and 'class' set.  These correspond to the displayed text and the CSS class of the post flair.  This may someday be to the list of options when selecting post flair on the add post/edit post page.
