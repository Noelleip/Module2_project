-- Create Tables
CREATE TABLE users (
    id SERIAL primary key,
    username VARCHAR(1000) not null,
    useremail VARCHAR(1000) not null,
    password VARCHAR(1000) not null,
    image VARCHAR(1000),
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now(),
    UNIQUE (useremail)
);
CREATE TABLE attractions (
    id SERIAL primary key,
    name VARCHAR(1000) not null,
    image VARCHAR(1000),
    description VARCHAR(1000),
    position point,
    star integer,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE routes (
    id SERIAL primary key,
    name VARCHAR(1000) not null,
    start_station_id integer not null,
    end_station_id integer not null,
    image VARCHAR(1000),
    description VARCHAR(1000),
    distance decimal,
    duration decimal,
    difficulty integer,
    popularity integer,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE stations (
    id SERIAL primary key,
    name VARCHAR(1000) not null,
    district VARCHAR(1000),
    image VARCHAR(1000),
    position point,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE districts (
    id SERIAL primary key,
    name VARCHAR(1000) not null,
    route_id integer,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE route_points (
    id SERIAL primary key,
    route_id integer not null,
    position point,
    order_index integer not null,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
-- create joined tables
CREATE TABLE attraction_likes (
    id SERIAL primary key,
    user_id integer not null,
    attraction_id integer not null,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE route_likes (
    id SERIAL primary key,
    user_id integer not null,
    route_id integer not null,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE routes_attractions (
    id SERIAL primary key,
    route_id integer not null,
    attraction_id integer not null,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE route_comments (
    id SERIAL primary key,
    comment VARCHAR(1000),
    user_id integer not null,
    route_id integer not null,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);
CREATE TABLE attraction_comments (
    id SERIAL primary key,
    comment VARCHAR(1000),
    user_id integer not null,
    attraction_id integer not null,
    created_at TIMESTAMP default now(),
    updated_at TIMESTAMP default now()
);