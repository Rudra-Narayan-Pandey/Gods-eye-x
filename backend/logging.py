import logging
import json
import datetime
import traceback
from typing import Any, Tuple

try:
    import requests
except Exception:
    requests = None


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_record = {
            "timestamp": datetime.datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # include any extra attributes passed via 'extra'
        extras = {k: v for k, v in record.__dict__.items() if k not in (
            "name",
            "msg",
            "args",
            "levelname",
            "levelno",
            "pathname",
            "filename",
            "module",
            "exc_info",
            "exc_text",
            "stack_info",
            "lineno",
            "funcName",
            "created",
            "msecs",
            "relativeCreated",
            "thread",
            "threadName",
            "processName",
            "process",
        )}
        if extras:
            # sanitize objects for JSON serializability
            for k, v in extras.items():
                try:
                    json.dumps({k: v})
                except Exception:
                    extras[k] = str(v)
            log_record.update(extras)

        if record.exc_info:
            log_record["exc"] = self.formatException(record.exc_info)

        return json.dumps(log_record, default=str)


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


def categorize_exception(exc: Exception) -> Tuple[str, str]:
    """Return a short category and a sanitized message for an exception.

    Categories: rate_limit, timeout, network_error, invalid_api_key, server_error, parse_error, unknown
    """
    text = str(exc) if exc is not None else ""
    lower = text.lower()

    # Type-based checks
    try:
        import requests as _requests
    except Exception:
        _requests = requests

    if _requests is not None and isinstance(exc, getattr(_requests.exceptions, "Timeout", (Exception,))):
        return "timeout", text[:500]
    if _requests is not None and isinstance(exc, getattr(_requests.exceptions, "ConnectionError", (Exception,))):
        return "network_error", text[:500]

    # Content heuristics
    if "rate" in lower or "429" in lower:
        return "rate_limit", text[:500]
    if "timeout" in lower:
        return "timeout", text[:500]
    if "connection" in lower or "refused" in lower:
        return "network_error", text[:500]
    if "401" in lower or "unauthor" in lower or "invalid api key" in lower:
        return "invalid_api_key", text[:500]
    if "500" in lower or "502" in lower or "503" in lower or "server error" in lower:
        return "server_error", text[:500]
    if "json" in lower or "parse" in lower:
        return "parse_error", text[:500]

    return "unknown", text[:500]
