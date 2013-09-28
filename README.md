reddit-post-scheduler
=====================

Bot that posts scheduled posts to a subreddit, and web interface for scheduling posts (complete with previews!)

Requirements:

* node.js (and npm to install modules)
* Python
* PRAW (Python Reddit API Wrapper)
* crontab
* sqlite3

To use:

* Install PRAW, node.js, and other dependencies.
* Run 'npm install' in the web/ directory to install needed modules.
* Open postscheduler.js and modify the username and password near the top.
* Run 'node postscheduler.js' to start the web interface.
* Create a crontab to cd to the directory with postbot.py and run it once per minute (or whenever).
* Navigate to http://yourserver:3000. Start scheduling posts. Enjoy!
