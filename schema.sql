CREATE TABLE users (
    id serial primary key,
    username character varying(255) NOT NULL UNIQUE CHECK (char_length(username) >= 3),
    passwordhash text NOT NULL,
    name character varying(255) NOT NULL,
    imagepath text
);

CREATE TABLE categories (
    id serial primary key,
    category character varying(255) NOT NULL UNIQUE
);

CREATE TABLE books (
    id serial primary key,
    title character varying(255) NOT NULL UNIQUE,
    isbn13 character varying(13) NOT NULL UNIQUE CHECK (ISBN13 ~ '^[0-9 ]*$'),
    author character varying(255),
    description text,
    category integer NOT NULL REFERENCES categories,
    isbn10 character varying(10),
    datetime timestamp with time zone,
    pagecount integer CHECK (pagecount > 0),
    language character varying(2)
);

CREATE TABLE review (
    id serial primary key,
    userid integer NOT NULL REFERENCES users,
    bookid integer NOT NULL REFERENCES books,
    rating integer NOT NULL CHECK (rating >= 1 and rating <= 5),
    review text
);
