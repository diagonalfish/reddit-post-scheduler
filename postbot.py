import praw
import datetime
import sqlite3

# Reddit creds
rsub = "subreddit"
ruser = "username"
rpass = "password"

# DB setup
db = sqlite3.connect('posts.db')
c = db.cursor()

# Fetch potential post
c.execute("SELECT * FROM posts WHERE posted = 0 AND datetime('now', 'localtime') >= datetime(posttime)")
postdata = c.fetchone()
if postdata == None:
    print("No posts to handle right now.")
    exit()

# Post it!
r = praw.Reddit(user_agent="Reddit Post Scheduler v0.2 by /u/diagonalfish", site_name='reddit_bypass_cdn')
r.login(ruser, rpass)
submission = r.submit(rsub, postdata[1], text=postdata[2])
submission.distinguish()

# Mark it as posted
c = db.cursor()
c.execute("UPDATE posts SET posted = 1, url = ? WHERE id = ?", (submission.url, postdata[0]))
db.commit()
