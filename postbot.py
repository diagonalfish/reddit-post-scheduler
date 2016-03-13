import praw
import datetime
import sqlite3
from prawoauth2 import PrawOAuth2Mini

# Reddit creds
ruser = "username"
rsub = "subreddit"
app_key = "APPKEY"
app_secret = "APPSECRET"
access_token = "ACCESSTOKEN"
refresh_token = "REFRESHTOKEN"

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
r = praw.Reddit(user_agent="Reddit Post Scheduler v0.2 by /u/diagonalfish")

try:
    oauth_helper = PrawOAuth2Mini(r, app_key=app_key,
                                  app_secret=app_secret, access_token=access_token, refresh_token=refresh_token,
                                  scopes=["read", "mysubreddits", "submit", "edit", "modlog", "modposts", "modflair", "identity"])
except praw.errors.HTTPException as err:
    print err._raw
    exit()

submission = r.submit(rsub, postdata[1], text=postdata[2])
submission.distinguish()
if (postdata[8]):
    c.execute("SELECT * FROM flair WHERE id = ?", (postdata[8],))
    flair = c.fetchone()
    submission.set_flair(flair_text = flair[1], flair_css_class = flair[2])

# Mark it as posted
c = db.cursor()
c.execute("UPDATE posts SET posted = 1, url = ? WHERE id = ?", (submission.url, postdata[0]))
db.commit()
