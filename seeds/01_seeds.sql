INSERT INTO users (name, email, password)
VALUES ('kevin liang', 'example@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('liang kevin', 'email@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('first last', 'hello@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, active, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, true, 'title', 'description', 'thumbnail_photo_url', 'cover_photo_url', 1, 1, 1, 1, 'Canada', 'Victoria Street', 'Vancouver', 'BC', 'post_code'),
(2, true, 'title', 'description', 'thumbnail_photo_url', 'cover_photo_url', 2, 2, 2, 2, 'Canada', '44th Street', 'Vancouver', 'BC', 'post_code'),
(3, true, 'title', 'description', 'thumbnail_photo_url', 'cover_photo_url', 3, 3, 3, 3, 'Canada', '46th Street', 'Vancouver', 'BC', 'post_code');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 5, 'message'),
(2, 2, 2, 4, 'message'),
(3, 3, 3, 2, 'message');

