select reservations.*, properties.*, avg(property_reviews.rating)
from reservations
join properties on properties.id = reservations.property_id
join property_reviews on property_reviews.property_id = reservations.property_id
where reservations.end_date < now()::date AND reservations.guest_id = 1
group by reservations.id, properties.id
order by reservations.start_date 
limit 10