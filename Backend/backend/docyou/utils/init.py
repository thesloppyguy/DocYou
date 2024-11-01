from docyou.model.utils import Setup
import os


def get_setup_status():
    return Setup.objects.get()


def get_init_validate_status(request):
    session = request.session
    if os.environ.get("INIT_PASSWORD"):
        return session.get("is_init_validated") or Setup.query.first()

    return True


def get_login_cache_key(*, account_id: str, token: str):
    return f"account_login:{account_id}:{token}"
