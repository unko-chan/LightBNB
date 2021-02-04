select city, count(reservations.property_id) as total_reservations
from properties
join reservations on property_id = properties.id
group by city
order by total_reservations desc