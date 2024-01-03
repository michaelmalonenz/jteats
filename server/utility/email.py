import json
from smtplib import SMTP_SSL
from email.message import EmailMessage
from email.policy import SMTP
from flask import render_template


SMTP_CONFIG = None


def _get_smtp_config():
    global SMTP_CONFIG
    if SMTP_CONFIG is None:
        with open('smtpconfig.json') as inf:
            SMTP_CONFIG = json.load(inf)
    return SMTP_CONFIG


def _send_email(content, to_addr):
    config = _get_smtp_config()
    with SMTP_SSL(host=config["host"], port=config["port"]) as smtp:
        smtp.login(user=config["username"], password=config["password"])
        msg = EmailMessage(SMTP)
        msg.set_content(content)
        smtp.send_message(msg, from_addr='noreply@jteats.xyz', to_addrs=to_addr)


def send_close_meal_emails(meal):
    user_ids = set([x.user_id for x in meal.order_items])
    for user_id in user_ids:
        user_items = [item for item in meal.order_items if item.user_id == user_id]
        user = user_items[0].user
        _send_email(
            render_template(
                '_close_mail_email',
                user = user,
                items = user_items,
            ),
            user.email
        )
