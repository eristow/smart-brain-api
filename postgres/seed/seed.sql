BEGIN TRANSACTION;

INSERT into users (name, age, pet, email, entries, joined)
  values ('a', 26, 'cat', 'a@a.com', 5, '2018-01-01');
INSERT into login (hash, email)
  values ('$2a$10$hpifwFSeOlc0L718Zgeyg.7W/rKbkHKPAxns3qV0WK6DAg02m8OdC', 'a@a.com');

COMMIT;
