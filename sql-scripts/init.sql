create table if not exists users (
  id serial primary key,
    email VARCHAR(60) unique not null,
    password VARCHAR(8) not null
);

create table if not exists credentials (
  user_id int not null,
  name varchar(50) not null,
  email varchar(60) not null,
  password varchar(50) not null,
  username varchar(30),
  url varchar(30),
  
  constraint password_user_fk foreign key (user_id) references users(id)
);