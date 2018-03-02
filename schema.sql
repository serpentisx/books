CREATE TABLE users (
    id serial primary key,
    username character varying(255) UNIQUE,
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
    title character varying(255) NOT NULL,
    ISBN13 character varying(13) NOT NULL UNIQUE,
    author character varying(255),
    description text,
    category integer NOT NULL REFERENCES categories,
    ISBN0 character varying(10),
    datetime character varying(255),
    pages integer,
    language character varying(2)
);

CREATE TABLE booksread (
    id serial primary key,
    userid integer NOT NULL REFERENCES users,
    bookid integer NOT NULL REFERENCES books,
    numberrating integer NOT NULL,
    review text
);