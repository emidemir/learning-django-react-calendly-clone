from datetime import datetime as dt
from datetime import timedelta

from scheduling.models import AvailabilityRule

def get_next_specific_date(target_day_name):
    """
    Calculates the specific date for the next occurrence of a given day name.
    If today is the target day, it returns today's date.
    """
    # 1. Map your text choices to Python's weekday integers (0=Mon, 6=Sun)
    days_map = {
        'MONDAY': 0, 
        'TUESDAY': 1, 
        'WEDNESDAY': 2, 
        'THURSDAY': 3, 
        'FRIDAY': 4, 
        'SATURDAY': 5, 
        'SUNDAY': 6
    }
    
    today = dt.today()
    current_weekday = today.weekday()
    target_weekday = days_map[target_day_name.upper()]

    # 2. Calculate difference
    days_ahead = target_weekday - current_weekday
    
    # 3. If the day is in the past relative to the current week (e.g. Today is Fri, Target is Mon)
    # Add 7 to get the date for next week.
    if days_ahead < 0:
        days_ahead += 7
        
    return today + timedelta(days=days_ahead)

def create_slots(rule, duration_str, buffer_before, buffer_after, event_type):
    start_time = rule.pop('start_time')
    end_time = rule.pop('end_time')
    day_of_week = rule.pop('day_of_week')
    isAvailable = rule.pop('isAvailable')
    
    start_datetime = dt.combine(dt.today(), start_time)
    current = start_datetime
    end_datetime = dt.combine(dt.today(), end_time)
    calculated_date = get_next_specific_date(day_of_week)

    while current + timedelta(minutes=duration_str) <= end_datetime:
        # Add buffer before the event
        current += timedelta(minutes=buffer_before)

        # Create availability rule
        AvailabilityRule.objects.create(
            event_type = event_type,
            start_time = current.time(),
            end_time = (current + timedelta(minutes=duration_str)).time(),
            day_of_week = day_of_week,
            isAvailable = isAvailable,
            day = calculated_date
        )
        # Iterate to the next slot 
        current = current + timedelta(minutes=duration_str)

        # Add buffer after the event
        current += timedelta(minutes=buffer_after)    

    return True




