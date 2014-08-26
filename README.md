reddit-post-scheduler
=====================

Bot that posts scheduled posts to a subreddit, and web interface for scheduling posts (complete with previews!)

This was developed for use on reddit's college football section (http://www.reddit.com/r/CFB), but it should work for any subreddit if configured properly.

Requirements:

* node.js (and npm to install modules)
* Python
* PRAW (Python Reddit API Wrapper)
* crontab
* sqlite3

To use:

* Install PRAW, node.js, and other dependencies.
* Edit postbot.py and change the subreddit, username, and password for the bot to post with.
* Run 'npm install' in the web/ directory to install needed modules.
* Open postscheduler.js and modify the username and password near the top.
* Run 'node postscheduler.js' to start the web interface.
* Create a crontab to cd to the directory with postbot.py and run it once per minute (or whenever).
* Navigate to http://yourserver:3000. Start scheduling posts. Enjoy!

To add and use post flair, you need to add rows to the 'flair' table in the SQLite database. I will leave this as an exercise to the reader for now, but you just need to insert a row with 'text' and 'class' set.  These correspond to the displayed text and the CSS class of the post flair.  This will be added to the list of options when selecting post flair on the add post/edit post page.
