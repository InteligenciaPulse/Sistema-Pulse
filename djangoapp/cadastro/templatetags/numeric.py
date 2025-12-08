from django import template

register = template.Library()

@register.filter
def to_number_format(value):
    if value is None:
        return "0.0"

    try:
        s = f"{float(value):.2f}"
    except:
        return value

    return s.replace(",", ".")
