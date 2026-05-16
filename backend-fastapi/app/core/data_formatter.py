from datetime import datetime

def format_date(dt):
    if not dt:
        return None
    return dt.strftime("%d %b %Y")

def format_time_ago(dt):
    diff = datetime.now() - dt
    hours = diff.seconds // 3600
    if hours < 1:
        return "Just now"
    return f"{hours} hrs ago"