def check_booking(request):
    # Extract the keyword parameters
    booker_name = request.data.get('booker_name')
    booker_email = request.data.get('booker_email')
    notes = request.data.get('notes')
    host_name = request.data.get('host_name')
    event_slug = request.data.get('event_slug')
    event_title = request.data.get('event_title')
    event_date_time = request.data.get('event_date_time')
    time_zone = request.data.get('time_zone')

    # ========== CHECKS ==========
    # 1- Check if a booking with the same name, slug, etc. already exists

    # 2- Check if the host is available at that time.


    #  Create another service function that generates Availability rule objects from the host intervals.
    # If time interval is 9-17, for 3 minutes, generate 18 objects for that user. 